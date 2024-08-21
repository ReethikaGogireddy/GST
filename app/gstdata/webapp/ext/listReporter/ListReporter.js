sap.ui.define([
    "sap/m/MessageBox",
    "sap/ui/core/library",
    'sap/ui/core/BusyIndicator',
    "sap/m/Dialog",
    "sap/m/library",
    "sap/m/Label",
    "sap/m/Text",
    "sap/m/Input",
    "sap/m/InputType",
    "sap/m/Button",
    "sap/m/MessageToast",
    "sap/m/ButtonType",
    "sap/ui/core/Element"
    
],
function (MessageBox, coreLibrary,BusyIndicator){
    "use strict";
    return {
     
        FetchData: function(oBindingContext,) {
            // console.log("fetch")
            //     let mParameters = {
            //         contexts: aSelectedContexts[0],
            //         label: 'Confirm',	
            //         invocationGrouping: true 	
            //     };
            this.editFlow.invokeAction('satinfotech/ListReporter').then(function (result) {
                console.log("fetch13")
                BusyIndicator.show();
               // console.log(result.value);
                BusyIndicator.hide(); 
                aSelectedContexts[0].getModel().refresh();
                
            })
           
        },
        
    }
});