sap.ui.define([
    "sap/m/MessageBox",
    "sap/ui/core/library",
    'sap/ui/core/BusyIndicator',
    "sap/m/MessageToast"
],
function (MessageBox, coreLibrary, BusyIndicator, MessageToast) {
    "use strict";
    return {
        ListReporter: function (oBindingContext, aSelectedContexts) {
            // Show a message or busy indicator before the AJAX call
            $.ajax({
                url: "/odata/v4/satinfotech/ListReporter", // Update with the correct URL
                type: "POST", // Use GET or POST depending on the action
                contentType: "application/json", // Ensure correct content type
                success: function (response) {
                    // Handle successful response
                    MessageToast.show("Action executed successfully.");
                },
                error: function (error) {
                    // Handle errors
                    MessageBox.error("Failed to execute action.");
                }
            });
        }
    };
});