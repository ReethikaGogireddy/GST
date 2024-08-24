const cds = require('@sap/cds');
const { v4: uuidv4 } = require('uuid');

module.exports = cds.service.impl(async function() {
    const gstapi = await cds.connect.to('API_OPLACCTGDOCITEMCUBE_SRV');

    async function fetchAndUpsertData() {
        const { gstlocal, gstItems, remote } = this.entities;

        // Fetch records from the remote source
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
        
        try {
            let sourceRecords = await gstapi.run(qry);
            console.log('Fetched Data:', sourceRecords);

            // Group and process data for gstlocal
            const groupMap = new Map();
            sourceRecords.forEach(item => {
                const groupKey = `${item.CompanyCode}-${item.FiscalYear}-${item.AccountingDocument}`;
                if (!groupMap.has(groupKey)) {
                    item.ID = uuidv4(); // Generate UUID for new records
                    groupMap.set(groupKey, item);  // Store only one record per group
                }
            });

            const groupedData = Array.from(groupMap.values());
            const existingLocalRecords = await cds.run(
                SELECT.from(gstlocal)
                    .columns(['CompanyCode', 'FiscalYear', 'AccountingDocument'])
                    .where({
                        CompanyCode: { in: groupedData.map(r => r.CompanyCode) },
                        FiscalYear: { in: groupedData.map(r => r.FiscalYear) },
                        AccountingDocument: { in: groupedData.map(r => r.AccountingDocument) }
                    })
            );

            const newLocalRecords = groupedData.filter(groupedRecord => {
                return !existingLocalRecords.some(existingRecord =>
                    existingRecord.CompanyCode === groupedRecord.CompanyCode &&
                    existingRecord.FiscalYear === groupedRecord.FiscalYear &&
                    existingRecord.AccountingDocument === groupedRecord.AccountingDocument
                );
            });

            if (newLocalRecords.length > 0) {
                await cds.run(UPSERT.into(gstlocal).entries(newLocalRecords));
                console.log('Data upserted into gstlocal:', newLocalRecords);
            } else {
                console.log('No new data to upsert into gstlocal.');
            }

            // Process and upsert data for gstItems
            const recordsWithUUID = sourceRecords.map(record => ({
                ...record,
                ID: uuidv4() // Generate UUID for each record
            }));

            const existingItemsRecords = await cds.run(
                SELECT.from(gstItems)
                    .columns(['AccountingDocumentItem', 'FiscalYear'])
                    .where({
                        AccountingDocumentItem: { in: recordsWithUUID.map(r => r.AccountingDocumentItem) },
                        FiscalYear: { in: recordsWithUUID.map(r => r.FiscalYear) }
                    })
            );

            const existingItemsMap = new Map();
            existingItemsRecords.forEach(record => {
                const key = `${record.AccountingDocumentItem}-${record.FiscalYear}`;
                existingItemsMap.set(key, record);
            });

            const newItemsRecords = recordsWithUUID.filter(record => {
                const key = `${record.AccountingDocumentItem}-${record.FiscalYear}`;
                return !existingItemsMap.has(key);
            });

            if (newItemsRecords.length > 0) {
                await cds.run(UPSERT.into(gstItems).entries(newItemsRecords));
                console.log('Upserted records with UUIDs into gstItems:', newItemsRecords);
            } else {
                console.log('No new records to upsert into gstItems.');
            }

        } catch (error) {
            console.error('Error while fetching and upserting data:', error);
            throw new Error('Data fetching or upserting failed');
        }
    }

    // Register the fetchAndUpsertData handler
    this.on('ListReporter', async (req) => {
        try {
            await fetchAndUpsertData.call(this);
            console.log('Data fetch and upsert completed successfully.');
            return { message: 'Data fetch and upsert completed successfully.' };
        } catch (error) {
            console.error('Error during data fetch and upsert operation:', error);
            req.error(500, 'Error during data fetch and upsert operation');
        }
    });
});