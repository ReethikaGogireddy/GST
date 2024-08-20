namespace com.sap.satinfotech;

using { managed, cuid } from '@sap/cds/common';

entity gst : managed, cuid {

    @title : 'CompanyCode'
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
    @title: 'Last Change Date'
    LastChangeDate: DateTime;
    
    @title: 'Accounting Document Item'
    AccountingDocumentItems:Composition of  many gstItems on AccountingDocumentItems.AccountingDocument=$self.AccountingDocument and AccountingDocumentItems.FiscalYear= $self.FiscalYear
}

entity gstItems : cuid, managed {
    key ID : UUID;
    @title : 'CompanyCode'
    CompanyCode: String(10);
    @title: 'FiscalYear'
    FiscalYear: String(4);
    @title: 'AccountingDocument'
    AccountingDocument: String(10);
    @title: 'Accounting Document Item'
    AccountingDocumentItem: String(4);
    @title: 'GL Account'
    GLAccount: String(10);
    @title: 'Tax Code'
    TaxCode: String(5);
    @title: 'GST Amount in INR'
    AmountInTransactionCurrency : Decimal(15,2);
}