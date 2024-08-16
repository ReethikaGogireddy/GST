namespace com.satinfotech.team;

using { managed, cuid } from '@sap/cds/common';

entity gst:managed, cuid {
    @title : 'company code'
    CompanyCode: String(10);
    @title: 'FiscalYear'
    FiscalYear: String(4);
    @title: 'AccountingDocument'
    AccountingDocument: String(10);
    @title: 'AccountingDocumentItem'
    AccountingDocumentItem: String(10);
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

    item: Composition of many docitem on item.Account_ID = $self;
}

entity docitem : managed, cuid {
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
    Account_ID: Association to one gst;
}
