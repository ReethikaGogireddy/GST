using { satinfotech.gstlocal as gst } from './filing';

annotate gst with @(
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
            Target:'Items/@UI.LineItem',
        },
    ],
);

annotate satinfotech.gstItems with @(
    UI.LineItem: [
            { Label: 'Line No', Value: lineno },
            { Label: 'Accounting Document Item', Value: AccountingDocumentItem },
            { Label: 'HSN', Value: HSN },
            { Label: 'GL Account', Value: GLAccount },
            { Label: 'Tax Code', Value: TaxCode },
            { Label: 'GST Items ID', Value: gstItems_ID_ID },
            { Label: 'AccountingDocumentID',Value: AccountingDocumentID},
    ],
    UI.FieldGroup #gstItemsInformation : {
        $Type : 'UI.FieldGroupType',
        Data : [
            { Label: 'Line No', Value: lineno },
            { Label: 'Accounting Document Item', Value: AccountingDocumentItem },
            { Label: 'HSN', Value: HSN },
            { Label: 'GL Account', Value: GLAccount },
            { Label: 'Tax Code', Value: TaxCode },
            { Label: 'GST Items ID', Value: gstItems_ID_ID },
            { Label: 'AccountingDocumentID',Value: AccountingDocumentID},
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
