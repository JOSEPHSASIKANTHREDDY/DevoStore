sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
    'sap/ui/core/Fragment'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, Fragment) {
        "use strict";

        return Controller.extend("aarinidemodetails.aarinidemodetails.controller.View1", {
            onInit: function () {
               this.getDemoDetails();
            },
            pressItem: function (oEvent) {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                // var selectedProductId = oEvent.getSource().getBindingContext().getProperty("ProductID");
                // var index =parseInt(oEvent.getSource()._aSelectedPaths[0].split("/")[1]);
                // var selectedProductId = this.getView().byId("idDemoDetailsTable").getModel().getData()[index].demoId;
                // var selectedProductId = oEvent.getSource()._aSelectedPaths[0].split("/")[1];
                var oSelectedData = oEvent.getSource().getBindingContext().getObject();
                var selectedProductId = oSelectedData.demoId;
                oRouter.navTo("TargetDetail", {
                    demoId: selectedProductId
                });
            },
            getDemoDetails : function(){
              var oData = this.ajaxCall("/catalog/Demo_Details","GET",{});
              var oModel = new sap.ui.model.json.JSONModel(oData);
              oModel.setData(oData);
              this.getView().byId("idDemoDetailsTable").setModel(oModel);
            },
            ajaxCall: function(url,type,payload){
                var result;
                    $.ajax({
                        url: url,
                        type: type,
                        data: payload,
                        async: false,                   
                        success: function (data) {
                            // var x = JSON.stringify(data.value);
                            console.log(data.value);  
                            result = data.value;                         
                        },
                        error: function (error) {
                            console.log(`Error ${error}`);
                        }
                    });
                return result;
            },
            onSearch: function (oEvent) {
                // add filter for search
                var aFilters = [];
                var sQuery = oEvent.getSource().getValue();
                // if (sQuery && sQuery.length > 0) {
                //     var filter = new Filter("applicationName", FilterOperator.Contains, sQuery);
                //     aFilters.push(filter);
                // }
                if (sQuery && sQuery.length > 0) {
                    var filter1 = new Filter("applicationName", FilterOperator.Contains, sQuery);
                    var filter2 = new Filter("applicationAreaName", FilterOperator.Contains, sQuery);
                    var filter3 = new Filter("subAreaName", FilterOperator.Contains, sQuery);
                    var filter4 = new Filter("industry", FilterOperator.Contains, sQuery);
                    var filter5 = new Filter("pointOfContact", FilterOperator.Contains,sQuery);
                    var filter = new Filter({
                        filters: [
                            filter1,
                            filter2,
                            filter3,
                            filter4,
                            filter5
                        ],
                        and: false
                    })
                    aFilters.push(filter);
                }
    
                // update list binding
                var oList = this.byId("idDemoDetailsTable");
                var oBinding = oList.getBinding("items");
                oBinding.filter(aFilters, "Application");
            },
            handleOpen: function () {
                // create dialog lazily
                var that = this;
                    if (!this.pDialog) {
                        this.pDialog = this.loadFragment({
                            name: "aarinidemodetails.aarinidemodetails.view.applicationDetails"
                        });
                    } 
                    this.pDialog.then(function(oDialog) {
                        oDialog.open();
                        that.setModelToDialog(oDialog);
                    });
                    
            },
            pressCancel : function(){
                this.pDialog.then(function(oDialog) {
                    oDialog.close();
                });
            },
            setModelToDialog: function(oDialog){
                var Application_Area = this.ajaxCall("/catalog/Application_Area","GET",{});
                var Sub_Area = this.ajaxCall("/catalog/Sub_Area","GET",{});
                var Industry = [{"key": 'Aerospace and Defense', "name": 'Aerospace and Defense'} ,
                {"key": 'Agribusiness', "name": 'Agribusiness'} ,
                {"key": 'Automotive', "name": 'Automotive'} ,
                {"key": 'Banking', "name": 'Banking'} ,
                {"key": 'Building Materials', "name": 'Building Materials'} ,
                {"key": 'Cargo, Transportation, and Logistics', "name": 'Cargo, Transportation, and Logistics'} ,
                {"key": 'Chemicals', "name": 'Chemicals'} ,
                {"key": 'Consumer Products', "name": 'Consumer Products'} ,
                {"key": 'Defense and Security', "name": 'Defense and Security'} ,
                {"key": 'Engineering, Construction, and Operations', "name": 'Engineering, Construction, and Operations'} ,
                {"key": 'Fashion', "name": 'Fashion'} ,
                {"key": 'Federal, National, and Central Government', "name": 'Federal, National, and Central Government'} ,
                {"key": 'Healthcare', "name": 'Healthcare'} ,
                {"key": 'High Tech', "name": 'High Tech'} ,
                {"key": 'Higher Education and Research', "name": 'Higher Education and Research'} ,
                {"key": 'Industrial Manufacturing', "name": 'Industrial Manufacturing'} ,
                {"key": 'Insurance', "name": 'Insurance'},
                {"key": 'Life Sciences', "name": 'Life Sciences'},
                {"key": 'Media', "name": 'Media'},
                {"key": 'Mill Products', "name": 'Mill Products'},
                {"key": 'Mining', "name": 'Mining'},
                {"key": 'Oil, Gas, and Energy', "name": 'Oil, Gas, and Energy'}];

                var oData = {
                    "demoId": "",
                    "applicationAreaName": Application_Area,
                    "subAreaName": Sub_Area,
                    "industry": Industry,
                    "applicationName": "",
                    "description": "",
                    "videoLink": "",
                    "diagramLink": [],
                    "demoCreationDate": "",
                    "demoCreatedBy": "",
                    "pointOfContact": ""
                    };
                    var oModel = new sap.ui.model.json.JSONModel(oData);
                    oModel.setData(oData);
                    oDialog.setModel(oModel);
            },

            pressSubmit: function(oEvent){
                var payload = oEvent.getSource().getParent().getModel().getData();
                payload.demoId= Math.random().toString(16).slice(2);
                payload.demoCreationDate = new Date(payload.demcatalogoCreationDate);
                payload.applicationAreaName = this.getView().byId("applicationAreaName")._getSelectedItemText();
                payload.subAreaName = this.getView().byId("subAreaName")._getSelectedItemText();
                payload.industry = this.getView().byId("industry")._getSelectedItemText();
                payload = JSON.stringify(payload);
               
                var settings = {
                    "url": "/catalog/Demo_Details",
                    "method": "POST",
                    "timeout": 0,
                    "headers": {
                      "Content-Type": "application/json"
                    },
                    "data": payload
                  };
                  var that = this;
                  $.ajax(settings).done(function (response) {
                    console.log(response);
                    $.each(that._oFiles,(index,file)=>{
                        var imageData = { "fileName": file.name }
                        that.createImageEntity(response.demoId, imageData, file);
                    });
                    that.getDemoDetails();
                    that.pressCancel();
                  }).fail(function(error){
                    console.log(error);
                  });
            },

            createImageEntity: function(demoId,payload,file){
                var that = this;
                var settings = {
                    "url": `/catalog/Demo_Details('${demoId}')/diagramLink`,
                    "method": "POST",
                    "timeout": 0,
                    "headers": {
                      "Content-Type": "application/json"
                    },
                    "data": JSON.stringify(payload)
                  };
                  $.ajax(settings).done(function (response) {
                    that.updateImageEntity(response.parent_demoid,response.ID,file);
                  });
            },

            updateImageEntity: function(demoId,imageId,file){
                const formData = new FormData();    
                formData.append("file", file);
                fetch(`/catalog/Demo_Details('${demoId}')/diagramLink(${imageId})/image`, {
                    method: "PUT", 
                    body: file
                  });  
            },

            handleFilePathChange: function(oEvent){
                this._oFiles = oEvent.getParameter("files");
            }

        });
    });
