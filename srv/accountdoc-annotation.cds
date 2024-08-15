using {team.accountdoc as accountdoc} from './account';

annotate accountdoc with @(
    UI.LineItem: [
            {
                $Type: 'UI.DataField',
                Value: CompanyCode
            },
            {
                $Type: 'UI.DataField',
                Value: FiscalYear
            },
            {
                $Type: 'UI.DataField',
                Value: AccountingDocument
            },
            {
                $Type: 'UI.DataField',
                Value: AccountingDocumentItem
            },
            {
                $Type: 'UI.DataField',
                Value: CompanyCodeName
            },
            {
                $Type: 'UI.DataField',
                Value: ChartOfAccounts
            },
            {
                $Type: 'UI.DataField',
                Value: AccountingDocumentItemType
            },
            {
                $Type: 'UI.DataField',
                Value: PostingKey
            },
            {
                $Type: 'UI.DataField',
                Value: FinancialAccountType
            },
            {
                $Type: 'UI.DataField',
                Value: TransactionTypeDetermination
            },
            {
                $Type: 'UI.DataField',
                Value: SalesDocument
            },
            {
                $Type: 'UI.DataField',
                Value: SalesDocumentItem
            },
        
    ]
);

annotate accountdoc with @(
    UI.FieldGroup #accountdoc : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: CompanyCode
            },
            {
                $Type: 'UI.DataField',
                Value: FiscalYear
            },
            {
                $Type: 'UI.DataField',
                Value: AccountingDocument
            },
            {
                $Type: 'UI.DataField',
                Value: AccountingDocumentItem
            },
            {
                $Type: 'UI.DataField',
                Value: CompanyCodeName
            },
            {
                $Type: 'UI.DataField',
                Value: ChartOfAccounts
            },
            {
                $Type: 'UI.DataField',
                Value: AccountingDocumentItemType
            },
            {
                $Type: 'UI.DataField',
                Value: PostingKey
            },
            {
                $Type: 'UI.DataField',
                Value: FinancialAccountType
            },
            {
                $Type: 'UI.DataField',
                Value: TransactionTypeDetermination
            },
            {
                $Type: 'UI.DataField',
                Value: SalesDocument
            },
            {
                $Type: 'UI.DataField',
                Value: SalesDocumentItem
            },
        ]
    },
    UI.Facets: [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'accountdocFacet',
            Label : 'accountdoc Details',
            Target : '@UI.FieldGroup#accountdoc',
        },
    ],
);
