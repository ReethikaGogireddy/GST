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
                Value: AccountingDocumentType
            },
            {
                $Type: 'UI.DataField',
                Value: DocumentReferenceID
            },
            {
                $Type: 'UI.DataField',
                Value: CustomerGSTIN
            },
            {
                $Type: 'UI.DataField',
                Value: SupplierGSTIN
            },
            {
                $Type: 'UI.DataField',
                Value: AmountInTransactionCurrency
            },
        
    ]
);

annotate accountdoc with @(
    UI.FieldGroup #GeneralInformation : {
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
                Value: AccountingDocumentType
            },
            {
                $Type: 'UI.DataField',
                Value: DocumentReferenceID
            },
            {
                $Type: 'UI.DataField',
                Value: CustomerGSTIN
            },
            {
                $Type: 'UI.DataField',
                Value: SupplierGSTIN
            },
            {
                $Type: 'UI.DataField',
                Value: AmountInTransactionCurrency
            },
        ]
    },
    UI.Facets: [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'accountdocFacet',
            Label : 'accountdoc Details',
            Target : '@UI.FieldGroup#GeneralInformation',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'DocumentItemsInfoFacet',
            Label : 'Document Items',
            Target : 'di/@UI.LineItem',
        },
    ],
);


using {team.docitem as docitem} from './account';

annotate docitem with @(
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
        
    ]
);

annotate docitem with @(
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
