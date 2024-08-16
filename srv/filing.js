//const { indexof } = require('@cap-js/postgres/lib/func');
const cds = require('@sap/cds');

module.exports = cds.service.impl(async function(){
    const gstapi = await cds.connect.to('API_OPLACCTGDOCITEMCUBE_SRV');

    this.on('READ','remote', async req => {
        
        //console.log(res);
        return await gstapi.run(req.query.where(`AccountingDocumentType='RV'`));
    });

    })