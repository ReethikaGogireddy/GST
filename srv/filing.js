const cds = require('@sap/cds');
const { v4: uuidv4 } = require('uuid');

module.exports = cds.service.impl(async function() {
    const gstapi = await cds.connect.to('API_OPLACCTGDOCITEMCUBE_SRV');

    this.on('READ', 'remote', async req => {
        const acceptedTypes = ['DR', 'DG', 'RV', 'KR', 'KG', 'RE'];
        req.query.where({ AccountingDocumentType: { in: acceptedTypes } });
        const results = await gstapi.run(req.query);

        // const uniqueResults = [];
        // const seen = new Set();

        // results.forEach(item => {
        //     const uniqueKey = `${item.CompanyCode}_${item.FiscalYear}_${item.AccountingDocument}`;
        //     if (!seen.has(uniqueKey)) {
        //         seen.add(uniqueKey);
        //         uniqueResults.push(item);
        //     }
        // });

        // return uniqueResults;
        return results;
    });

    this.before('READ', 'gstlocal', async req => {
        const { gstlocal, remote } = this.entities;
    
        // Query to fetch records from the remote source
        const qry = SELECT.from(remote)
            .columns([
                'CompanyCode',
                'FiscalYear',
                'AccountingDocument',
                'PostingDate',
                'AccountingDocumentType',
                'DocumentReferenceID',
                'AmountInTransactionCurrency'
            ])
            .where(`AccountingDocumentType IN ('RV', 'DR', 'DG', 'RE', 'KR', 'KG')`)
            .limit(2000);
    
        try {
            // Fetch data from the remote API
            let res = await gstapi.run(qry);
            console.log('Fetched Data:', res);
    
            // Group records by CompanyCode, FiscalYear, and AccountingDocument
            const groupMap = new Map();
            res.forEach(item => {
                const groupKey = `${item.CompanyCode}-${item.FiscalYear}-${item.AccountingDocument}`;
                if (!groupMap.has(groupKey)) {
                    item.ID = uuidv4(); // Generate UUID for new records
                    groupMap.set(groupKey, item);  // Store only one record per group
                }
            });
    
            // Convert grouped data from Map to array
            const groupedData = [];
            groupMap.forEach(group => groupedData.push(group));
    
            // Fetch existing records from the gstlocal table
            const existingRecords = await cds.run(
                SELECT.from(gstlocal)
                    .columns('CompanyCode', 'FiscalYear', 'AccountingDocument')
                    .where({
                        CompanyCode: { in: groupedData.map(r => r.CompanyCode) },
                        FiscalYear: { in: groupedData.map(r => r.FiscalYear) },
                        AccountingDocument: { in: groupedData.map(r => r.AccountingDocument) },
    
                    })
            );
    
            // Filter out the already existing records
            const newRecords = groupedData.filter(groupedRecord => {
                return !existingRecords.some(existingRecord =>
                    existingRecord.CompanyCode === groupedRecord.CompanyCode &&
                    existingRecord.FiscalYear === groupedRecord.FiscalYear &&
                    existingRecord.AccountingDocument === groupedRecord.AccountingDocument 
                );
            });
    
            // Perform the UPSERT operation
            if (newRecords.length > 0) {
                await cds.run(UPSERT.into(gstlocal).entries(newRecords));
                console.log("Data upserted successfully");
            } else {
                console.log("No new data to upsert.");
            }
        } catch (error) {
            console.error("Error while fetching and upserting data from gstapi to gstlocal:", error);
            throw new Error("Data fetching or upserting failed");
        }
    });
    

    this.before('READ', 'gstItems', async (req) => {
        const { gstItems, remote } = this.entities;
    
        // Fetch records from the remote source
        const qry = SELECT.from(remote)
            .columns(
                'AccountingDocumentItem',
                'GLAccount',
                'TaxCode',
                'CompanyCode',
                'AccountingDocument'
            )
            .where({ AccountingDocumentType: { in: ['RV', 'DR', 'DG', 'RE', 'KR', 'KG'] } })
            .limit(2000);
    
        try {
            let sourceRecords = await gstapi.run(qry);
    
            // Log the fetched data for debugging
            console.log('Fetched Data for gstItems:', sourceRecords);
    
            // Add UUID to each record
            const recordsWithUUID = sourceRecords.map(record => ({
                ...record,
                ID: uuidv4() // Generate UUID for each record
            }));
    
            // Fetch existing records from the gstItems table
            const existingRecords = await cds.run(
                SELECT.from(gstItems)
                    .columns('AccountingDocumentItem', 'CompanyCode')
                    .where({
                        AccountingDocumentItem: { in: recordsWithUUID.map(r => r.AccountingDocumentItem) },
                        CompanyCode: { in: recordsWithUUID.map(r => r.CompanyCode) }
                    })
            );
    
            // Convert existing records to a map for fast lookup
            const existingMap = new Map();
            existingRecords.forEach(record => {
                const key = `${record.AccountingDocumentItem}-${record.CompanyCode}`;
                existingMap.set(key, record);
            });
    
            // Filter out records that already exist in the table
            const newRecords = recordsWithUUID.filter(record => {
                const key = `${record.AccountingDocumentItem}-${record.CompanyCode}`;
                return !existingMap.has(key);
            });
    
            if (newRecords.length > 0) {
                // Perform the UPSERT operation
                await cds.run(UPSERT.into(gstItems).entries(newRecords));
                console.log("Upserted records with UUIDs into gstItems:", newRecords);
            } else {
                console.log("No new records to upsert into gstItems.");
            }
        } catch (error) {
            console.error("Error while fetching and upserting data from gstapi to gstItems:", error);
            throw new Error("Data fetching or upserting failed");
        }
    
    });
});