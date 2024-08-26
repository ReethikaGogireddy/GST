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
                Value: LastChangeDate
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
                Value: LastChangeDate
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
            { Label: 'Company Code', Value: CompanyCode },
            { Label: 'Fiscal Year', Value: FiscalYear },
            { Label: 'Accounting Document', Value: AccountingDocument },
            { Label: 'Accounting Document Item', Value: AccountingDocumentItem },
            { Label: 'GL Account', Value: GLAccount },
            { Label: 'Tax Code', Value: TaxCode },
            { Label: 'GST Amount in INR', Value: AmountInTransactionCurrency }
    ],
    UI.FieldGroup #gstItemsInformation : {
        $Type : 'UI.FieldGroupType',
        Data : [
            { Label: 'Company Code', Value: CompanyCode },
            { Label: 'Fiscal Year', Value: FiscalYear },
            { Label: 'Accounting Document', Value: AccountingDocument },
            { Label: 'Accounting Document Item', Value: AccountingDocumentItem },
            { Label: 'GL Account', Value: GLAccount },
            { Label: 'Tax Code', Value: TaxCode },
            { Label: 'GST Amount in INR', Value: AmountInTransactionCurrency }
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