using { satinfotech } from './filing';

annotate satinfotech.gstlocal with @(
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
                Value: AmountInTransactionCurrency
            },
        ],
        UI.FieldGroup #gstInformation : {
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
                Value: AmountInTransactionCurrency
            },
        ]
    },
    UI.Facets: [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'gstFacet',
            Label : 'gst Information',
            Target : '@UI.FieldGroup#gstInformation',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'gstItemsFacet',
            Label : 'gst Items',
            Target:'AccountingDocumentItems/@UI.LineItem',
        },
    ],
);

annotate satinfotech.gstItems with @(
    UI.LineItem: [
            { Label: 'Accounting Document Item', Value: AccountingDocumentItem },
            { Label: 'GL Account', Value: GLAccount },
            { Label: 'Tax Code', Value: TaxCode },
            { Label: 'Company Code', Value: CompanyCode }
    ],
    UI.FieldGroup #gstItemsInformation : {
        $Type : 'UI.FieldGroupType',
        Data : [
            { Label: 'Accounting Document Item', Value: AccountingDocumentItem },
            { Label: 'GL Account', Value: GLAccount },
            { Label: 'Tax Code', Value: TaxCode },
            { Label: 'Company Code', Value: CompanyCode },
        ]
    },
    UI.Facets: [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'gstItemsFacet',
            Label : 'gst Items',
            Target : '@UI.FieldGroup#gstItemsInformation',
        },
    ],
);