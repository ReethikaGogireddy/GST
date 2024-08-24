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
            // Show a message or busy indicator before the AJAX call
            BusyIndicator.show(0); // Show busy indicator
            
            $.ajax({
                url: "/odata/v4/satinfotech/ListReporter", // Update with the correct URL
                type: "POST", // Use GET or POST depending on the action
                contentType: "application/json", // Ensure correct content type
                success: function (response) {
                    // Handle successful response
                    BusyIndicator.hide(); // Hide busy indicator
                    //MessageToast.show("Action executed successfully.");

                    // Construct the message based on the response
                    let messageText = "";
                    if (response.batchResults && response.batchResults.length > 0) {
                        response.batchResults.forEach(batch => {
                            messageText += `Count = ${batch.count},\n Next batch uploaded = ${batch.batch + 5000},\n`;
                        });
                    } else {
                        messageText = "All records fetched.";
                    }

                    // Create the dialog if it doesn't already exist
                    if (!this.ListReporter) {
                        this.ListReporter = new Dialog({
                            type: 'Standard',
                            title: "Fetch Results",
                            content: new Text({ text: messageText }),
                            beginButton: new Button({
                                type: ButtonType.Emphasized,
                                text: "OK",
                                press: function () {
                                    this.ListReporter.close();
                                }.bind(this)
                            })
                        });
                    } else {
                        // Update dialog content if it already exists
                        this.ListReporter.getContent()[0].setText(messageText);
                    }

                    // Open the dialog
                    this.ListReporter.open();
                }.bind(this), // Ensure 'this' refers to the correct context
                error: function (error) {
                    BusyIndicator.hide(); // Hide busy indicator
                    // Handle errors
                    MessageBox.error("Failed to execute action.");
                }
            });
        }
    };
});
