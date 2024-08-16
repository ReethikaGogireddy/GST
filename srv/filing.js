//const { indexof } = require('@cap-js/postgres/lib/func');
const cds = require('@sap/cds');

module.exports = cds.service.impl(async function(){
    const gstapi = await cds.connect.to('API_OPLACCTGDOCITEMCUBE_SRV');

    this.on('READ','remote', async req => {
        // Define the accepted AccountingDocumentType values
        const acceptedTypes = ['DR', 'DG', 'RV', 'KR', 'KG', 'RE'];

        // Create a WHERE clause that matches the accepted types using an OR condition
        req.query.where({ AccountingDocumentType: { in: acceptedTypes } });

        // Execute the query against the external service
        return await gstapi.run(req.query);
        //console.log(res);
        //return await gstapi.run(req.query.where(`AccountingDocumentType='RV'`));
    });

    this.on('READ','tv', async req => {
        
        //console.log(res);
        return await gstapi.run(req.query.where(`AccountingDocumentType='RV'`));
    });

    })