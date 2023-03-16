sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("aarinidemoapps.aarinidemoapps.controller.View1", {
            onInit: function () {
                this.getArea();
                this.getSubArea();
                this.getDemoDetails();
            },
            getArea: function () {
                var oData = this.ajaxCall("/catalog/Application_Area", "GET", {});
                var oModel = new sap.ui.model.json.JSONModel(oData);
                oModel.setData(oData);
                this.getView().byId("idAreaList").setModel(oModel);
            },
            getSubArea: function () {
                var oData = this.ajaxCall("/catalog/Sub_Area", "GET", {});
                var oModel = new sap.ui.model.json.JSONModel(oData);
                oModel.setData(oData);
                this.getView().byId("idSubAreaList").setModel(oModel);
            },
            getDemoDetails: function () {
                var oData = this.ajaxCall("/catalog/Demo_Details?$expand=diagramLink", "GET", {});
                var oModel = new sap.ui.model.json.JSONModel(oData);
                oModel.setData(oData);
                this.getView().byId("idTileContainer").setModel(oModel);
            },
            ajaxCall: function (url, type, payload) {
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
                if (sQuery && sQuery.length > 0) {
                    var filter = new Filter("applicationName", FilterOperator.Contains, sQuery);
                    aFilters.push(filter);
                }

                // update list binding
                var oList = this.byId("idDemoDetailsTable");
                var oBinding = oList.getBinding("items");
                oBinding.filter(aFilters, "Application");
            },
            onSearchDemo: function (oEvent) {
                debugger;
                var aFilters = [];
                var sQuery = oEvent.getSource().getValue();
                if (sQuery && sQuery.length > 0) {
                    var filter = new Filter("applicationName", FilterOperator.Contains, sQuery);
                    aFilters.push(filter);
                }
                // if (sQuery && sQuery.length > 0) {
                //     var filter1 = new Filter("applicationName", FilterOperator.Contains, sQuery);
                //     var filter2 = new Filter("applicationAreaName", FilterOperator.Contains, sQuery);
                //     var filter3 = new Filter("subAreaName", FilterOperator.Contains, sQuery);
                //     var filter4 = new Filter("industry", FilterOperator.Contains, sQuery);
                //     var filter = new Filter({
                //         filters: [
                //             filter1,
                //             filter2,
                //             filter3,
                //             filter4
                //         ],
                //         and: false
                //     })
                //     aFilters.push(filter);
                // }

                // update list binding
                var oList = this.byId("idTileContainer");
                var oBinding = oList.getBinding("items");
                oBinding.filter(aFilters, "Application");

                // var sValue = oEvent.getSource().getValue();
                //     var oFilter = new Filter("applicationAreaName", FilterOperator.Contains, sValue);
                //     var oBinding = this.getView().byId("idTileContainer").getBinding("items");
                //     oBinding.filter([oFilter]);    
            },
            selectArea: function (oEvent) {
                // var sQuery = oEvent.getSource().getSelectedItem().getTitle();
                // var tData = this.getView().byId("idTileContainer").getModel().getData();
                // var oSelectedAreaNames = oEvent.getSource().getSelectedItems().map(function(obj){
                //     return obj.getTitle();
                // });
                // var res = tData.filter(function(obj){
                //     tData.applicationAreaName === obj;
                // });
                // this.setTileData(res);
                // debugger;
                // if(oEvent.getSource().getSelectedItem()>1){
                //     var sValue = oEvent.getSource().getSelectedItem().getTitle();
                //     var oFilter = new Filter("applicationAreaName", FilterOperator.Contains, sValue);
                //     var oBinding = this.getView().byId("idTileContainer").getBinding("items");
                //     oBinding.filter([oFilter]);
                // }else{
                //     var sValue="";
                //     if(oEvent.getSource().getSelectedItem()){
                //         sValue = oEvent.getSource().getSelectedItem().getTitle();
                //     }
                //     var oFilter = new Filter("applicationAreaName", FilterOperator.Contains, sValue);
                //     var oBinding = this.getView().byId("idTileContainer").getBinding("items");
                //     oBinding.filter([oFilter]);   
                // }
                this.filterData();
            },

            selectSubArea: function (oEvent) {
                this.filterData();
            },

            filterData: function () {
                var aFilter = [];
                var oApplicationArea = this.getView().byId("idAreaList");
                let aAppAreaItems = oApplicationArea.getSelectedItems();
                $.each(aAppAreaItems, (index, oAppArea) => {
                    var oData = oAppArea.getBindingContext().getObject();
                    var oFilter = new Filter("applicationAreaName", FilterOperator.Contains, oData.applicationAreaName);
                    aFilter.push(oFilter);
                });

                var oApplicationSubArea = this.getView().byId("idSubAreaList");
                let aSubAreaItems = oApplicationSubArea.getSelectedItems();
                $.each(aSubAreaItems, (index, oSubArea) => {
                    var oData = oSubArea.getBindingContext().getObject();
                    var oFilter = new Filter("subAreaName", FilterOperator.Contains, oData.subAreaName);
                    aFilter.push(oFilter);
                });


                var oBinding = this.getView().byId("idTileContainer").getBinding("items");
                oBinding.filter(aFilter);
            },

            setTileData: function (oData) {
                var oModel = new sap.ui.model.json.JSONModel(oData);
                oModel.setData(oData);
                this.getView().byId("idTileContainer").setModel(oModel);
                this.getView().byId("idTileContainer").getModel().refresh();
            },

            toHome: function () {
                this.getSplitAppObj().backDetail();
            },
            getSplitAppObj: function () {
                var result = this.byId("SplitAppDemo");
                if (!result) {
                    Log.info("SplitApp object can't be found");
                }
                return result;
            },
            toDetail: function (oEvent) {
                var oPath = oEvent.getSource().getParent().getBindingContext().getPath();
                var oData = oEvent.getSource().getModel().getProperty(oPath);
                oData.videoLink = this.addVideo(oData.videoLink);
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData(oData);
                this.getView().byId("detail2").setModel(oModel);
                this.getSplitAppObj().to(this.createId("detail2"));
                this.addImagesToCarousel(oData.diagramLink);
            },
            addImagesToCarousel: function (links) {
                var oData = [];
                links = links.split(',');
                oData = [];
                links.forEach(function (link) {
                    oData.push({ "url": link });
                });
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData(oData);
                this.getView().byId("idCarousel").setModel(oModel);
            },
            addVideo: function (url) {

                var _that = this;
                setTimeout(function () {
                    var res;
                    if (url.search('.be') !== -1) {
                        res = "https://www.youtube.com/embed" + url.split(".be")[1];
                    } else {
                        res = url;
                    }
                    _that.getView().byId("videoId").getDomRef().src = res;
                }, 1000);

            }
        });
    });
