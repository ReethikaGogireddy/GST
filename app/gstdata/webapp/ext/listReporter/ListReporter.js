sap.ui.define([
    "sap/m/MessageBox",
    "sap/ui/core/library",
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/ButtonType",
    "sap/m/Text"
], function (MessageBox, coreLibrary, BusyIndicator, MessageToast, Dialog, Button, ButtonType, Text) {
    "use strict";

    return {
        ListReporter: function (oBindingContext, aSelectedContexts) {
            BusyIndicator.show(0); // Show busy indicator before the AJAX call

            // Initialize dialog for displaying messages
            this.ListReporter = new Dialog({
                type: 'Standard',
                title: "ListReporter Status",
                content: new Text({ text: "ListReportering total records..." }),
                beginButton: new Button({
                    type: ButtonType.Emphasized,
                    text: "Close",
                    press: function () {
                        this.ListReporter.close();
                    }.bind(this)
                })
            });

            this.ListReporter.open(); // Open dialog to show ListReportering status

            const batchSize = 5000; // Define batch size

            const ListReporterTotalRecords = async () => {
                const serviceUrl = "https://my401292-api.s4hana.cloud.sap/sap/opu/odata/sap/API_OPLACCTGDOCITEMCUBE_SRV/A_OperationalAcctgDocItemCube/$count";
                const username = "USER_NNRG";  // Replace with your username
                const password = "FMesUvVB}JhYD9nVbDfRoVcdEffwmVNJJScMzuzx";  // Replace with your password
                const authHeader = "Basic " + btoa(username + ":" + password);  // Encode credentials in Base64
                
                console.log("ListReportering total records from:", serviceUrl); // Log the service URL

                return $.ajax({
                    url: serviceUrl,
                    type: "GET",
                    headers: {
                        "Authorization": authHeader // Set the Authorization header
                    },
                    success: function (totalRecords) {
                        console.log("Total records ListReportered:", totalRecords); // Log the number of records
                        return totalRecords;
                    },
                    error: function (error) {
                        console.error("Error ListReportering total records:", error); // Log error details
                        MessageBox.error("Failed to ListReporter total records.");
                        BusyIndicator.hide();
                        this.ListReporter.close();
                        throw new Error("Failed to ListReporter total records.");
                    }.bind(this)
                });
            };

            const ListReporterBatch = async (batchNumber, totalRecords) => {
                const batchMessage = `Processing Batch ${batchNumber} of ${totalRecords} records...`;
                this.ListReporter.getContent()[0].setText(batchMessage); // Update dialog text

                return $.ajax({
                    url: `/odata/v4/satinfotech/ListReporter?batch=${batchNumber}`,
                    type: "POST",
                    contentType: "application/json",
                    success: function (response) {
                        MessageToast.show(`Batch ${batchNumber} executed successfully.`);
                    },
                    error: function (error) {
                        MessageBox.error(`Failed to execute batch ${batchNumber}.`);
                        throw new Error(`Failed to execute batch ${batchNumber}.`);
                    }
                });
            };

            const ListReporterAllBatches = async (totalRecords) => {
                const totalBatches = Math.ceil(totalRecords / batchSize); // Calculate total batches

                for (let i = 1; i <= totalBatches; i++) {
                    const currentRecord = (i - 1) * batchSize + 1;
                    await ListReporterBatch(currentRecord, totalRecords);
                }

                // After all batches are processed
                this.ListReporter.getContent()[0].setText("All records ListReportered."); // Update dialog text
                // this.ListReporter.getContent()[0].setText(`Total records: ${totalRecords}`);
                BusyIndicator.hide(); // Hide busy indicator
            };

            ListReporterTotalRecords().then((totalRecords) => {
                this.ListReporter.getContent()[0].setText(`Total records: ${totalRecords}. Starting batch ListReportering...`);
                MessageToast.show(`Total records to process: ${totalRecords}`);  // Display message toast
                return ListReporterAllBatches(totalRecords);
            }).catch(error => {
                console.error('Error during batch ListReportering:', error);
                MessageBox.error("An error occurred during batch ListReportering.");
                BusyIndicator.hide(); // Hide busy indicator
                this.ListReporter.close(); // Close dialog on error
            });
        }
    };
});