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
    @title: 'AccountingDocumentItem'
    AccountingDocumentItem: String(10);
    @title : 'DocumentReferenceID'
    DocumentReferenceID: String(15);
    @title: 'CompanyCodeName'
    CompanyCodeName: String(100);
    @title: 'ChartOfAccounts'
    ChartOfAccounts: String(10);
    @title: 'AccountingDocumentItemType'
    AccountingDocumentItemType: String(1);
    @title: 'PostingKey'
    PostingKey: String(2);
    @title: 'FinancialAccountType'
    FinancialAccountType: String(1);
    @title: 'TransactionTypeDetermination'
    TransactionTypeDetermination: String(3);
    @title: 'salesDocument'
    SalesDocument: String(10);
    @title: 'SalesDocumentItem'
    SalesDocumentItem: String(10);
    
}