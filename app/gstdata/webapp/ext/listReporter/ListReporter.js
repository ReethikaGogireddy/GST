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
            // Show a busy indicator before the AJAX call
            BusyIndicator.show(0); // Show busy indicator

            // Initialize dialog for displaying messages
            this.ListReporter = new Dialog({
                type: 'Standard',
                title: "Fetch Status",
                content: new Text({ text: "Fetching batches..." }),
                beginButton: new Button({
                    type: ButtonType.Emphasized,
                    text: "Close",
                    press: function () {
                        this.ListReporter.close();
                    }.bind(this)
                })
            });

            this.ListReporter.open(); // Open dialog to show fetching status

            const totalRecords = 13126; // Replace with actual total record count
            const batchSize = 5000; // Define batch size
            const totalBatches = Math.ceil(totalRecords / batchSize); // Calculate total batches

            const fetchBatch = async (batchNumber) => {
                const batchMessage = `Batch ${batchNumber} fetching...`;
                this.ListReporter.getContent()[0].setText(batchMessage); // Update dialog text

                return $.ajax({
                    url: `/odata/v4/satinfotech/ListReporter?batch=${batchNumber}`, // Update with the correct URL and parameters
                    type: "POST",
                    contentType: "application/json",
                    success: function (response) {
                        // Handle successful response
                        //MessageToast.show("Batch executed successfully.");
                    },
                    error: function (error) {
                        // Handle errors
                        MessageBox.error("Failed to execute batch action.");
                    }
                });
            };

            const fetchAllBatches = async () => {
                for (let i = 1; i <= totalBatches; i++) {
                    await fetchBatch(i);
                }

                // After all batches are processed
                this.ListReporter.getContent()[0].setText("All records fetched."); // Update dialog text
                BusyIndicator.hide(); // Hide busy indicator
            };

            // Start fetching all batches
            fetchAllBatches().catch(error => {
                console.error('Error during batch fetching:', error);
                MessageBox.error("An error occurred during batch fetching.");
                BusyIndicator.hide(); // Hide busy indicator
                this.ListReporter.close(); // Close dialog on error
            });
        }
    };
});
