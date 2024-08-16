namespace com.sap.satinfotech;

using { managed, cuid } from '@sap/cds/common';

entity gst : managed, cuid {

@title : 'company code'
    CompanyCode: String(10);
    @title: 'FiscalYear'
    FiscalYear: String(4);
    @title:  'PostingDate'
    PostingDate: DateTime;
    @title: 'AccountingDocument'
    AccountingDocument: String(10);
    @title: 'AccountingDocumentType'
    AccountingDocumentType: String(5);
    @title : 'DocumentReferenceID'
    DocumentReferenceID: String(20);
    @title: 'GST Amount in INR'
    AmountInTransactionCurrency : Decimal(15,2);
    Items : Composition of many gstItems on Items.id=$self;
}

entity gstItems : cuid, managed {
    key ID : UUID;
    id:Association to gst;
    @title: 'Line No'
    lineno: Integer;
    @title: 'Accounting Document Item'
    AccountingDocumentItem: String(4);
    @title: 'HSN'
    HSN: String(10);
    @title: 'GL Account'
    GLAccount: String(10);
    @title: 'Tax Code'
    TaxCode: String(5);
    AccountingDocumentID: String(50);
    gstItems_ID : Association to one gst;
}

