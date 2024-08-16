using {team} from './account';

annotate team.gst with @(
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
    ],
    UI.FieldGroup #details : {
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
            Target : '@UI.FieldGroup#details',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'DocumentItemsFacet',
            Label : 'DocumentItems Details',
            Target : 'item/@UI.LineItem',
        },
    ],
);

annotate team.docitem with @(
    UI.LineItem: [
        {
            $Type: 'UI.DataField',
            Value: lineno
        },
        {
            $Type: 'UI.DataField',
            Value: AccountingDocumentItem
        },
        {
            $Type: 'UI.DataField',
            Value: HSN
        },
        {
            $Type: 'UI.DataField',
            Value: GLAccount
        },
        {
            $Type: 'UI.DataField',
            Value: TaxCode
        },
        {
            $Type: 'UI.DataField',
            Value:Account_ID_ID
        }
    ],
    UI.FieldGroup #DocumentItems : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: lineno
            },
            {
                $Type: 'UI.DataField',
                Value: AccountingDocumentItem
            },
            {
                $Type: 'UI.DataField',
                Value: HSN
            },
            {
                $Type: 'UI.DataField',
                Value: GLAccount
            },
            {
                $Type: 'UI.DataField',
                Value: TaxCode
            },
            {
                $Type: 'UI.DataField',
                Value:Account_ID_ID
            }
        ]
    },
    UI.Facets: [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'DocumentItemsFacet',
            Label : 'DocumentItems Details',
            Target : '@UI.FieldGroup#DocumentItems',
        },
    ],
);
