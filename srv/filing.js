//const { indexof } = require('@cap-js/postgres/lib/func');
const cds = require('@sap/cds');
const { v4: uuidv4 } = require('uuid');

module.exports = cds.service.impl(async function(){
    const gstapi = await cds.connect.to('API_OPLACCTGDOCITEMCUBE_SRV');

    this.on('READ', 'remote', async req => {
        // Define the accepted AccountingDocumentType values
        const acceptedTypes = ['DR', 'DG', 'RV', 'KR', 'KG', 'RE'];

        // Create a WHERE clause that matches the accepted types using an OR condition
        req.query.where({ AccountingDocumentType: { in: acceptedTypes } });

        // Execute the query against the external service
        const results = await gstapi.run(req.query);

        // Filter results to ensure uniqueness of CompanyCode, FiscalYear, and AccountingDocument
        const uniqueResults = [];
        const seen = new Set();

        results.forEach(item => {
            const uniqueKey = `${item.CompanyCode}_${item.FiscalYear}_${item.AccountingDocument}`;
            if (!seen.has(uniqueKey)) {
                seen.add(uniqueKey);
                uniqueResults.push(item);
            }
        });

        return uniqueResults;
    });

    this.on('READ','tv', async req => {
        
        //console.log(res);
        return await gstapi.run(req.query.where(`AccountingDocumentType='RV'`));
    });


    this.before('READ', 'gstlocal', async req => {
        const { gstlocal, remote } = this.entities;
        
        // Create a query to fetch data from remote
        const qry = SELECT.from(remote)
            .columns([
                { ref: ['CompanyCode'] },
                { ref: ['FiscalYear'] },
                { ref: ['AccountingDocument'] },
                { ref: ['AccountingDocumentItem'] },
                { ref: ['PostingDate'] },
                { ref: ['AccountingDocumentType'] },
                { ref: ['DocumentReferenceID'] },
                { ref: ['AmountInTransactionCurrency'] }
            ])
            .where({ AccountingDocumentType: { in: ['RV', 'DR', 'DG', 'KR', 'KG', 'RE'] } }) // Filter by accepted types
            .limit(2000);
    
        try {
            // Execute the query against the external service
            let res = await gstapi.run(qry);
    
            // Generate unique ID if necessary or ensure ID is present
            res = res.map(entry => ({
                ID: entry.ID || uuidv4(), // Generate UUID if ID is not present
                CompanyCode: entry.CompanyCode,
                FiscalYear: entry.FiscalYear,
                AccountingDocument: entry.AccountingDocument,
                AccountingDocumentItem: entry.AccountingDocumentItem,
                PostingDate: entry.PostingDate,
                AccountingDocumentType: entry.AccountingDocumentType,
                DocumentReferenceID: entry.DocumentReferenceID,
                AmountInTransactionCurrency: entry.AmountInTransactionCurrency
            }));
    
            // Ensure data is valid before upserting
            if (res.length > 0) {
                const insqry = UPSERT.into(gstlocal).entries(res);
                await cds.run(insqry);
            } else {
                console.log("No data to upsert.");
            }
        } catch (error) {
            console.error("Error while fetching and upserting data from gstapi to gstlocal:", error);
            throw new Error("Data fetching or upserting failed");
        }
});
})

