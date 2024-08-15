namespace com.satinfotech.team;
using { managed, cuid } from '@sap/cds/common';

entity accountdoc:managed, cuid {
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
    DocumentReferenceID: String(15);
    @title: 'Customer GSTIN'
    CustomerGSTIN: String(15);
    @title: 'Supplier GSTIN'
    SupplierGSTIN: String(15);
    @title: 'GST Amount in INR'
    AmountInTransactionCurrency : Decimal(15,2);

    di: Composition of many docitem on di.Account=$self;
}

entity docitem:managed, cuid {
    @title : 'lineno'
    lineno: Integer;
    @title: 'AccountingDocumentItem'
    AccountingDocumentItem: String(4);
    @title:  'HSN'
    HSN: String(10);
    @title: 'GL Account'
    GLAccount: String(10);
    @title: 'TaxCode'
    TaxCode: String(5);

    Account : Association to accountdoc;
}

