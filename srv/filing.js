const cds = require('@sap/cds');
const { v4: uuidv4 } = require('uuid');

module.exports = cds.service.impl(async function() {
    const gstapi = await cds.connect.to('API_OPLACCTGDOCITEMCUBE_SRV');

    this.on('READ', 'remote', async req => {
        const acceptedTypes = ['DR', 'DG', 'RV', 'KR', 'KG', 'RE'];
        req.query.where({ AccountingDocumentType: { in: acceptedTypes } });
        const results = await gstapi.run(req.query);

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

    this.before('READ', 'gstlocal', async req => {
        const { gstlocal, remote } = this.entities;
        const qry = SELECT.from(remote)
            .columns([
                'CompanyCode',
                'FiscalYear',
                'AccountingDocument',
                'AccountingDocumentItem',
                'PostingDate',
                'AccountingDocumentType',
                'DocumentReferenceID',
                'AmountInTransactionCurrency'
            ])
            .where(`AccountingDocumentType IN ('RV', 'DR', 'DG', 'RE', 'KR', 'KG')`)
            .limit(2000);

        try {
            let res = await gstapi.run(qry);

            // Log the fetched data for debugging
            console.log('Fetched Data:', res);

            res = res.map(entry => ({
                ID: uuidv4(), // Ensure UUID is generated
                ...entry
            }));

            if (res.length > 0) {
                await cds.run(UPSERT.into(gstlocal).entries(res));
                console.log("Data upserted successfully");
            } else {
                console.log("No data to upsert.");
            }
        } catch (error) {
            console.error("Error while fetching and upserting data from gstapi to gstlocal:", error);
            throw new Error("Data fetching or upserting failed");
        }
    });

    this.before('READ', 'gstItems', async req => {
        const { gstItems, remote } = this.entities;
        const qry = SELECT.from(remote)
            .columns([
                'AccountingDocumentItem',
                'GLAccount',
                'TaxCode',
                'CompanyCode',  // Add this line
                'AccountingDocument'  // Add this line if necessary
            ])
            .where(`AccountingDocumentType IN ('RV', 'DR', 'DG', 'RE', 'KR', 'KG')`) // Adjust if needed
            .limit(2000);
    
        try {
            let res = await gstapi.run(qry);
    
            // Log the fetched data for debugging
            console.log('Fetched Data for gstItems:', res);
    
            // Ensure UUID is generated and map the result
            res = res.map(entry => ({
                ID: uuidv4(), // Ensure UUID is generated
                ...entry
            }));
    
            if (res.length > 0) {
                await cds.run(UPSERT.into(gstItems).entries(res));
                console.log("Data upserted successfully into gstItems");
            } else {
                console.log("No data to upsert into gstItems.");
            }
        } catch (error) {
            console.error("Error while fetching and upserting data from gstapi to gstItems:", error);
            throw new Error("Data fetching or upserting failed");
        }
    });
    
});