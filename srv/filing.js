const cds = require('@sap/cds');
const { v4: uuidv4 } = require('uuid');

module.exports = cds.service.impl(async function () {
    // Define the fetch action
    async function fetchAndUpsertData() {
        const gstapi = await cds.connect.to('API_OPLACCTGDOCITEMCUBE_SRV');
        const { remote, gstlocal, gstItems } = this.entities;

        // Query to fetch data
        const qry = SELECT.from(remote)
            .columns([
                'CompanyCode',
                'FiscalYear',
                'AccountingDocument',
                'AccountingDocumentItem',
                'PostingDate',
                'AccountingDocumentType',
                'DocumentReferenceID',
                'GLAccount',
                'TaxCode',
                'AmountInTransactionCurrency'
            ])
            .where({ AccountingDocumentType: { in: ['RV', 'DR', 'DG', 'RE', 'KR', 'KG'] } });

        const res = await gstapi.run(qry);

        if (!Array.isArray(res) || res.length === 0) {
            console.log('No records found in the fetched data.');
            return { message: 'No records found.' };
        }

        // Process gstlocal records
        const groupMap = new Map();
        res.forEach(item => {
            const groupKey = `${item.CompanyCode}-${item.FiscalYear}-${item.AccountingDocument}`;
            if (!groupMap.has(groupKey)) {
                item.ID = uuidv4();
                groupMap.set(groupKey, item);
            }
        });

        const groupedData = Array.from(groupMap.values());

        // Insert or update Accounting records
        const existingRecords = await cds.run(
            SELECT.from(gstlocal)
                .columns('CompanyCode', 'FiscalYear', 'AccountingDocument')
                .where({
                    CompanyCode: { in: groupedData.map(r => r.CompanyCode) },
                    FiscalYear: { in: groupedData.map(r => r.FiscalYear) },
                    AccountingDocument: { in: groupedData.map(r => r.AccountingDocument) }
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
            console.log('Inserted new records into gstlocal:', newRecords);
        } else {
            console.log('No new records to insert into gstlocal.');
            return { message: 'No new records to insert into gstlocal.' };
        }

        // Process Items records
        const recordsWithUUID = res.map(record => ({
            ...record,
            ID: uuidv4(),
            id: record.AccountingDocument
        }));

        const existingItemsRecords = await cds.run(
            SELECT.from(gstItems)
                .columns('AccountingDocument')
                .where({
                    AccountingDocument: { in: recordsWithUUID.map(r => r.AccountingDocument) }
                })
        );

        const existingItemsMap = new Map();
        existingItemsRecords.forEach(record => {
            existingItemsMap.set(record.AccountingDocument, record);
        });

        const newItemsRecords = recordsWithUUID.filter(record => {
            return !existingItemsMap.has(record.AccountingDocument);
        });

        if (newItemsRecords.length > 0) {
            await cds.run(UPSERT.into(gstItems).entries(newItemsRecords));
            console.log('Upserted records with UUIDs into Items:', newItemsRecords);
        } else {
            console.log('No new records to upsert into gstItems.');
            return { message: 'No new records to upsert into gstItems.' };
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
            return { message: 'No new tax documents to process.' };
        }

        const batchResults = []; // Store results for each batch processed

        for (let i = 0; i < counttaxdocs; i += 5000) {
            const taxdocitemsQuery = {
                method: 'GET',
                path: `A_OperationalAcctgDocItemCube?$skip=${i}&$top=5000`
            };

            let results = await gstapi.send(taxdocitemsQuery);

            results = results.map(item => {
                // Ensure LastChangeDate is in ISO format
                if (item.LastChangeDate) {
                    item.LastChangeDate = convertSAPDateToISO(item.LastChangeDate);
                }

                // Ensure PostingDate is in ISO format
                if (item.PostingDate) {
                    item.PostingDate = convertSAPDateToISO(item.PostingDate);
                }

                // Ensure ID is not null
                if (!item.ID) {
                    item.ID = generateUniqueID(item); // Generate a unique ID if missing
                }

                return item;
            });

            // Remove duplicate entries
            results = removeDuplicateEntries(results);

            if (results.length > 0) { // Only attempt UPSERT if there are valid records
                console.log("In Batch ", i, " of ", counttaxdocs, " records");
                await cds.run(UPSERT.into(gstlocal).entries(results));
                batchResults.push({ batch: i, count: results.length }); // Track the processed batch results
            } else {
                console.log("Skipping Batch ", i, " due to missing or duplicate IDs");
            }
        }

        console.log('Count of new tax documents:', counttaxdocs);
        return { message: `Processed ${counttaxdocs} tax documents.`, batchResults }; // Return batch results
    }

    this.on('ListReporter', async (req) => {
        try {
            const result = await fetchAndUpsertData.call(this);
            console.log('Data fetch and upsert completed successfully.');
            return { message: result.message, batchResults: result.batchResults }; // Include batch results in the response
        } catch (error) {
            console.error('Error during data fetch and upsert operation:', error);
            req.error(500, 'Error during data fetch and upsert operation');
        }
    });
});

// Function to convert SAP date to ISO format
function convertSAPDateToISO(dateString) {
    const timestamp = parseInt(dateString.match(/\d+/)[0], 10); // Extract the timestamp
    return new Date(timestamp).toISOString(); // Convert to ISO string
}

// Function to remove duplicate entries
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

// Function to generate a unique ID
function generateUniqueID(item) {
    return `${item.CompanyCode}-${item.FiscalYear}-${item.AccountingDocument}-${item.FiscalPeriod}`;
}
