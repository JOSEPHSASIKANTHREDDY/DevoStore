sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],

    function (Controller, MessageBox) {
        "use strict";

        return Controller.extend("sap.btp.sapui5.controller.Detail", {
            onInit: function () {
                this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this._oRouter.getRoute("TargetDetail").attachMatched(this._onRouteMatched, this);

                // editable model 
                var oEditableModel = new sap.ui.model.json.JSONModel({
                    editable: false
                });
                this.getView().setModel(oEditableModel,"editmode");
            },
            _onRouteMatched: function (oEvent) {
                var oArgs, oView;
                oArgs = oEvent.getParameter("arguments");
                oView = this.getView();
                var demoId = oArgs.demoId;
                this.getDemoDetails(demoId);
            },
            handleNavButtonPress: function (evt) {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("TargetView1");
            },
            getDemoDetails: function (demoId) {
                var oData = this.getData("/catalog/Demo_Details?$expand=diagramLink", "GET", demoId);
                var oModel = new sap.ui.model.json.JSONModel(oData[0]);
                oModel.setData(oData[0]);
                this.getView().setModel(oModel);
            },
            getData: function (url, type, demoId) {
                var result;
                $.ajax({
                    url: url,
                    type: type,
                    async: false,
                    success: function (data) {
                        var oData = data.value;
                        var data = oData.filter(function (obj) {
                            return obj.demoId === demoId;
                        });
                        result = data;
                    },
                    error: function (error) {
                        console.log(`Error ${error}`);
                    }
                });
                return result;
            },

            handleEditApplication: function (oEvent) {
                debugger;
                var oEditModel = this.getView().getModel("editmode");
                oEditModel.setData({
                    editable: true
                });
            },

            handleDeleteApplication: function (oEvent) {
                var oData = this.getView().getModel().getData();
                var sConfirmationText = `Are you sure you want to delete the demo details of ${oData.applicationName}`;
                var oController = this;
                MessageBox.confirm(sConfirmationText, {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (action) {
                        if (action === MessageBox.Action.YES) {
                            oController.deleteDemoDetail();
                        }
                    }
                });
            },

            deleteDemoDetail: function () {
                // get the id of the demo application, delete the record and navigate back to 
                // main page. 
                var oData = this.getView().getModel().getData();
                var oDataModel = this.getOwnerComponent().getModel();
                var sDeletePath = `/catalog/Demo_Details('${oData.demoId}')`;
                var settings = {
                    "url": sDeletePath,
                    "method": "DELETE",
                    "timeout": 0,
                    "headers": {
                      "Content-Type": "application/json"
                    }
                  };
                  $.ajax(settings).done(function (response) {
                    MessageBox.success("Delete successful");
                  });
            }

        });
    });
