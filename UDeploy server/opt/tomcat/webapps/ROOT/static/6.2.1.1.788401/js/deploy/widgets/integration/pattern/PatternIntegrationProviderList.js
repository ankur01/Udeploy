/*
 * Licensed Materials - Property of IBM Corp.
 * IBM UrbanCode Deploy
 * (c) Copyright IBM Corporation 2011, 2014. All Rights Reserved.
 *
 * U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
 * GSA ADP Schedule Contract with IBM Corp.
 */
/*global define, require */

define([
    "dijit/_TemplatedMixin",
    "dijit/_Widget",
    "dijit/form/Button",
    "dojo/_base/declare",
    "dojo/_base/xhr",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/on",
    "deploy/widgets/Formatters",
    "deploy/widgets/integration/pattern/EditPatternIntegrationProvider",
    "js/webext/widgets/Dialog",
    "js/webext/widgets/GenericConfirm",
    "js/webext/widgets/table/TreeTable"],

function (_TemplatedMixin,
          _Widget,
          Button,
          declare,
          xhr,
          domClass,
          domConstruct,
          on,
          Formatters,
          EditPatternIntegrationProvider,
          Dialog,
          GenericConfirm,
          TreeTable) {
    /**
     *
     */
    return declare('deploy.widgets.integration.pattern.PatternIntegrationProviderList', [_Widget, _TemplatedMixin], {
        templateString: '<div class="integrationProviderList">' + 
                            '<div class="listTopButtons" data-dojo-attach-point="buttonTopAttach"></div>' + 
                            '<div data-dojo-attach-point="integrationProviderList"></div>' + 
                        '</div>',
        /**
         *
         */
        postCreate: function () {
            this.inherited(arguments);
            var self = this;
            
            var gridRestUrl = bootstrap.restUrl + "integration/pattern";
            var gridLayout = [{
                name: i18n("Name"),
                field: "name",
                orderField: "name",
                filterField: "name",
                filterType: "text"
            },{
                name: i18n("Description"),
                field: "description"
            },{
                name: i18n("Actions"),
                formatter: function(item) {
                    return self.actionsFormatter(item);
                }
            }];

            this.grid = new TreeTable({
                url: gridRestUrl,
                serverSideProcessing: false,
                noDataMessage: i18n("No integration providers have been added yet."),
                tableConfigKey: "integrationProviderList",
                hidePagination: false,
                hideExpandCollapse: true,
                columns: gridLayout
            });
            this.grid.placeAt(this.integrationProviderList);

            var integrationProviderButton = new Button({
                label: i18n("New Blueprint Designer Integration"),
                showTitle: false,
                onClick: function () {
                    self.showEditIntegrationProviderDialog();
                }
            });
            domClass.add(integrationProviderButton.domNode, "idxButtonSpecial");
            integrationProviderButton.placeAt(this.buttonTopAttach);
        },

        /**
         *
         */
        actionsFormatter: function (item) {
            var self = this;

            var result = document.createElement("div");

            var editLink = domConstruct.create("a", {
                "innerHTML": i18n("Edit"),
                "class": "actionsLink linkPointer"
            }, result);
            on(editLink, "click", function () {
                self.showEditIntegrationProviderDialog(item);
            });

            var deleteLink = domConstruct.create("a", {
                "innerHTML": i18n("Delete"),
                "class": "actionsLink linkPointer"
            }, result);
            on(deleteLink, "click", function () {
                self.showDeleteConfirm(item);
            });

            return result;
        },

        /**
         *
         */
        showEditIntegrationProviderDialog: function (item) {
            var self = this;

            var newIntegrationProviderDialog = new Dialog({
                title: (item ? i18n("Edit Blueprint Designer Integration") : i18n("New Blueprint Designer Integration")),
                closable: true,
                draggable: true
            });

            var newIntegrationProviderForm = new EditPatternIntegrationProvider({
                integrationProvider: item,
                callback: function () {
                    newIntegrationProviderDialog.hide();
                    newIntegrationProviderDialog.destroy();
                    self.grid.refresh();
                }
            });

            newIntegrationProviderForm.placeAt(newIntegrationProviderDialog.containerNode);
            newIntegrationProviderDialog.show();
        },

        showDeleteConfirm: function (item) {
            var self = this;
            var confirm = new GenericConfirm({
                message: i18n("Are you sure you want to delete this Blueprint Designer Integration?"),
                action: function () {
                    xhr.del({
                        url: bootstrap.restUrl + "integration/pattern/" + item.id,
                        load: function () {
                            self.grid.refresh();
                        }
                    });
                }
            });
        }
    });
});
