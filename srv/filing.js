const cds = require('@sap/cds');
const { v4: uuidv4 } = require('uuid');

module.exports = cds.service.impl(async function() {
    const gstapi = await cds.connect.to('API_OPLACCTGDOCITEMCUBE_SRV');

    async function fetchAndUpsertData() {
        const { gstlocal, gstItems, remote } = this.entities;

        // Fetch data for gstlocal
        const qry = SELECT.from(remote)
            .columns([
                'CompanyCode',
                'FiscalYear',
                'AccountingDocument',
                'AccountingDocumentItem',
                'AccountingDocumentType',
                'DocumentReferenceID',
                'GLAccount',
                'TaxCode'
            ])
            .where(`AccountingDocumentType IN ('RV', 'DR', 'DG', 'RE', 'KR', 'KG')`);

        let res = await gstapi.run(qry);

        console.log('Fetched Data:', res);

        const groupMap = new Map();
        res.forEach(item => {
            const groupKey = `${item.CompanyCode}-${item.FiscalYear}-${item.AccountingDocument}`;
            if (!groupMap.has(groupKey)) {
                item.ID = uuidv4();
                groupMap.set(groupKey, item);
            }
        });

        const groupedData = Array.from(groupMap.values());

        const existingRecords = await cds.run(
            SELECT.from(gstlocal)
                .columns(['CompanyCode', 'FiscalYear', 'AccountingDocument'])
                .where({
                    CompanyCode: { in: groupedData.map(r => r.CompanyCode) },
                    FiscalYear: { in: groupedData.map(r => r.FiscalYear) },
                    AccountingDocument: { in: groupedData.map(r => r.AccountingDocument) },
                    AccountingDocumentType: { in: ['RV', 'DR', 'DG', 'RE', 'KR', 'KG'] }
                })
        );

        const newRecords = groupedData.filter(groupedRecord => {
            return !existingRecords.some(existingRecord =>
                existingRecord.CompanyCode === groupedRecord.CompanyCode &&
                existingRecord.FiscalYear === groupedRecord.FiscalYear &&
                existingRecord.AccountingDocument === groupedRecord.AccountingDocument
            );
        });

        if (newRecords.length > 0) {
            await cds.run(UPSERT.into(gstlocal).entries(newRecords));
            console.log("Data upserted successfully to gstlocal");
        } else {
            console.log("No new data to upsert to gstlocal.");
        }

        // Fetch data for gstItems
        const qryItems = SELECT.from(remote)
            .columns([
                'AccountingDocumentItem',
                'GLAccount',
                'TaxCode',
                'CompanyCode',
                'AccountingDocument',
                'FiscalYear',
                'AmountInTransactionCurrency'
            ])
            .where({ AccountingDocumentType: { in: ['RV', 'DR', 'DG', 'RE', 'KR', 'KG'] } });

        let sourceRecords = await gstapi.run(qryItems);
        console.log('Fetched Data for gstItems:', sourceRecords);

        const recordsWithUUID = sourceRecords.map(record => ({
            ...record,
            ID: record.ID || uuidv4()
        }));

        const existingItemsRecords = await cds.run(
            SELECT.from(gstItems)
                .columns(['AccountingDocumentItem', 'FiscalYear'])
                .where({
                    AccountingDocumentItem: { in: recordsWithUUID.map(r => r.AccountingDocumentItem) },
                    FiscalYear: { in: recordsWithUUID.map(r => r.FiscalYear) }
                })
        );

        const existingMap = new Map();
        existingItemsRecords.forEach(record => {
            const key = `${record.AccountingDocumentItem}-${record.FiscalYear}`;
            existingMap.set(key, record);
        });

        const newItemsRecords = recordsWithUUID.filter(record => {
            const key = `${record.AccountingDocumentItem}-${record.FiscalYear}`;
            return !existingMap.has(key);
        });

        if (newItemsRecords.length > 0) {
            await cds.run(UPSERT.into(gstItems).entries(newItemsRecords));
            console.log("Upserted records with UUIDs into gstItems");
        } else {
            console.log("No new records to upsert into gstItems.");
        }

        // Handle LGSTTaxItem processing
        let lastsyncdate1 = await cds.run(
            SELECT.one.from(gstlocal).columns('LastChangeDate').orderBy('LastChangeDate desc')
        );

        let counttaxdocs;

        if (lastsyncdate1 && lastsyncdate1.LastChangeDate) {
            const taxlastsyncdatetime = lastsyncdate1.LastChangeDate.toISOString();
            counttaxdocs = await gstapi.send({
                method: 'GET',
                path: `A_OperationalAcctgDocItemCube/$count?$filter=LastChangeDate gt datetimeoffset'${taxlastsyncdatetime}'`
            });
        } else {
            counttaxdocs = await gstapi.send({
                method: 'GET',
                path: 'A_OperationalAcctgDocItemCube/$count'
            });
        }

        if (counttaxdocs === 0) {
            console.log('No new tax documents to process.');
            return { message: 'No new tax documents to process.', batchResults: [] };
        }

        const batchResults = [];
        let newDataFetched = false;

        for (let i = 0; i < counttaxdocs; i += 5000) {
            const taxdocitemsQuery = {
                method: 'GET',
                path: `A_OperationalAcctgDocItemCube?$skip=${i}&$top=5000`
            };

            let results = await gstapi.send(taxdocitemsQuery);

            results = results.map(item => {
                if (item.LastChangeDate) {
                    item.LastChangeDate = convertSAPDateToISO(item.LastChangeDate);
                }
                item.ID = item.ID || uuidv4();
                return item;
            });

            results = removeDuplicateEntries(results);

            if (results.length > 0) {
                newDataFetched = true; // Set this to true if we fetch new results
                console.log(`Processing batch ${i / 5000 + 1} of tax documents`);
                await cds.run(UPSERT.into(gstlocal).entries(results));
                batchResults.push(`Batch ${i / 5000 + 1} processed.`);
            } else {
                console.log(`Skipping batch ${i / 5000 + 1} due to missing or duplicate IDs`);
            }

            // Check if we fetched records in the first batch
            if (i === 0 && !newDataFetched) {
                console.log('No new records found in the first batch. Stopping further batch processing.');
                break; // Stop if no new records were found after the first batch
            }
        }

        if (newDataFetched) {
            console.log('All records processed successfully.');
        } else {
            console.log('No new data to process after the initial batch. All records are fetched.');
        }

        return { message: 'All records processed.', batchResults };
    }

    this.on('ListReporter', async (req) => {
        try {
            const result = await fetchAndUpsertData.call(this);
            console.log('Data fetch and upsert completed successfully.');
            return { message: result.message, batchResults: result.batchResults };
        } catch (error) {
            console.error('Error during data fetch and upsert operation:', error);
            req.error(500, 'Error during data fetch and upsert operation');
        }
    });
});

function convertSAPDateToISO(dateString) {
    const timestamp = parseInt(dateString.match(/\d+/)[0], 10);
    return new Date(timestamp).toISOString();
}

function removeDuplicateEntries(results) {
    const uniqueResults = [];
    const seenIds = new Set();

    for (const item of results) {
        if (!seenIds.has(item.ID)) {
            uniqueResults.push(item);
            seenIds.add(item.ID);
        }
    }

    return uniqueResults;
}
