using { com.sap.satinfotech as db } from '../db/schema';
using { API_OPLACCTGDOCITEMCUBE_SRV as gstapi } from './external/API_OPLACCTGDOCITEMCUBE_SRV';

service satinfotech @(requires: 'authenticated-user') {
    entity remote as projection on gstapi.A_OperationalAcctgDocItemCube {
    CompanyCode,
    FiscalYear,
    AccountingDocument,
    AccountingDocumentItem,
    PostingDate,
    AccountingDocumentType,
    DocumentReferenceID,
    AmountInTransactionCurrency,
    }
    entity tv as projection on gstapi.A_OperationalAcctgDocItemCube {
        CompanyCode,
        FiscalYear,
        AccountingDocument,
        AccountingDocumentItem,
        GLAccount,
        TaxCode
    }

    entity gstlocal as projection on db.gst;
}

annotate satinfotech.gstlocal with @odata.draft.enabled;