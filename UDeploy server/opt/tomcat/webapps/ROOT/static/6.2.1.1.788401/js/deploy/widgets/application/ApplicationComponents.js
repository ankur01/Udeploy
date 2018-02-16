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
        "dojo/_base/declare",
        "dojo/_base/xhr",
        "dojo/dom-construct",
        "dojo/json",
        "dojo/on",
        "deploy/widgets/component/RunComponentProcess",
        "deploy/widgets/component/ComponentImportFailureIcon",
        "js/webext/widgets/Dialog",
        "js/webext/widgets/GenericConfirm",
        "js/webext/widgets/table/TreeTable"
        ],
function(
        _TemplatedMixin,
        _Widget,
        declare,
        xhr,
        domConstruct,
        JSON,
        on,
        RunComponentProcess,
        ComponentImportFailureIcon,
        Dialog,
        GenericConfirm,
        TreeTable
) {
    /**
     *
     */
    return declare('deploy.widgets.application.ApplicationComponents',  [_Widget, _TemplatedMixin], {
        templateString:
            '<div class="applicationComponents">' +
                '<div data-dojo-attach-point="gridAttach"></div>' +
            '</div>',

        /**
         *
         */
        postCreate: function() {
            this.inherited(arguments);

            var gridRestUrl = bootstrap.restUrl+'deploy/component';
            var gridLayout = [{
                name: i18n("Component"),
                formatter: this.componentLinkFormatter,
                orderField: "name"
            },{
                name: i18n("Description"),
                field: "description"
            },{
                name: i18n("Actions"),
                formatter: this.actionsFormatter,
                parentWidget: this
            }];

            this.grid = new TreeTable({
                serverSideProcessing: true,
                url: gridRestUrl,
                tableConfigKey: "applicationComponentsList",
                noDataMessage: i18n("No components have been added to this application."),
                columns: gridLayout,
                hidePagination: false,
                hideExpandCollapse: true,
                orderField: "name",
                sortType: "asc",
                baseFilters: [{
                    name: "applications.id",
                    type: "eq",
                    className: "UUID",
                    values: [appState.application.id]
                }]
            });
            this.grid.placeAt(this.gridAttach);
        },

        /**
         *
         */
        componentLinkFormatter: function(item, value, cell) {
            var result = document.createElement("div");

            if (item.integrationFailed) {
                var importFailureIcon = new ComponentImportFailureIcon({
                    label: i18n("A version import failed. Check the component's configuration for more details or use the Actions menu on the Components page to dismiss this error.")
                });
                domConstruct.place(importFailureIcon.domNode, result);
            }

            var link = document.createElement("a");
            link.href = "#component/"+item.id;
            link.innerHTML = item.name.escape();
            domConstruct.place(link, result);

            return result;
        },

        /**
         *
         */
        actionsFormatter: function(item) {
            var self = this.parentWidget;
            var result = document.createElement("span");

            if (appState.application.extendedSecurity[security.application.runComponentProcesses]) {
                var deployLink = domConstruct.create("a", {
                    "innerHTML": i18n("Run Process"),
                    "class": "actionsLink linkPointer"
                }, result);
                on(deployLink, "click", function() {
                    self.showComponentDeploymentDialog(item);
                });
            }

            if (appState.application.security["Manage Components"]) {
                var removeLink = domConstruct.create("a", {
                    "innerHTML": i18n("Remove"),
                    "class": "actionsLink linkPointer"
                }, result);
                on(removeLink, "click", function() {
                    self.confirmRemoval(item);
                });
            }

            return result;
        },

        /**
         *
         */
        confirmRemoval: function(component) {
            var self = this;

            var submitData = {};
            submitData.components = [];
            submitData.components.push(component.id);

            var confirm = new GenericConfirm({
                message: i18n("Are you sure you want to remove component '%s' from this application?", component.name.escape()),
                action: function() {
                    xhr.put({
                        url: bootstrap.restUrl+"deploy/application/"+appState.application.id+"/removeComponents",
                        putData: JSON.stringify(submitData),
                        load: function() {
                            self.grid.refresh();
                        }
                    });
                }
            });
        },

        /**
         *
         */
        showComponentDeploymentDialog: function(component) {
            var deployDialog = new Dialog({
                closable: true,
                draggable: true
            });

            var deployForm = new RunComponentProcess({
                application: appState.application,
                component: component,
                callback: function() {
                    deployDialog.hide();
                    deployDialog.destroy();
                }
            });
            deployForm.placeAt(deployDialog.containerNode);
            deployDialog.show();
        }
    });
});