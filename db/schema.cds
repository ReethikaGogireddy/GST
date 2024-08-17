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
    @title: 'Accounting Document Item'
    AccountingDocumentItems:Composition of  many gstItems on AccountingDocumentItems.AccountingDocument=$self.AccountingDocument and AccountingDocumentItems.CompanyCode = $self.CompanyCode 

}

entity gstItems : cuid, managed {
    key ID : UUID;
    @title: 'Accounting Document Item'
    AccountingDocumentItem: String(4);
    @title: 'GL Account'
    GLAccount: String(10);
    @title: 'Tax Code'
    TaxCode: String(5);
    @title : 'company code'
    CompanyCode: String(10);
    @title: 'AccountingDocument'
    AccountingDocument: String(10);
}