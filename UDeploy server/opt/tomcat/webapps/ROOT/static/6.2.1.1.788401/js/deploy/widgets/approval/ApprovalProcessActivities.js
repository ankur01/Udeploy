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
        "dojo/_base/declare",
        "dojo/request/xhr",
        "dojo/dom-class",
        "dojo/dom-construct",
        "dojo/json",
        "deploy/widgets/workflow/BaseGraph",
        "js/webext/widgets/Alert",
        "js/webext/widgets/GenericConfirm",
        "js/webext/widgets/table/TreeTable"
        ],
function(
        declare,
        xhr,
        domClass,
        domConstruct,
        JSON,
        BaseGraph,
        Alert,
        GenericConfirm,
        TreeTable
) {
    /*globals mxClient, mxUtils, mxToolbar, mxPrintPreview, mxWindow, mxCellOverlay, mxCellOverlay, mxImage, mxPoint,
     mxConstants, mxEvent
     */
    return declare('deploy.widgets.approval.ApprovalProcessActivities',  [BaseGraph], {
        /**
         * Requires that this object has an "approvalProcessId" property set.
         */
        postCreate: function() {
            this.inherited(arguments);
            var self = this;

            if (appState.environment) {
                self.approvalParent = appState.environment;
            }
            if (appState.environmentTemplate) {
                self.approvalParent = appState.environmentTemplate;
            }

            if (!mxClient.isBrowserSupported()) {
                mxUtils.error(i18n("This browser is not compatible with the rich workflow editor."), 200, false);
            }
            else {
                this.toolBarContainer.className = "mx-graph-pane mx-graph-top-pane";
                this.processStepContainer.className = "mx-graph-pane mx-graph-bottom-pane";
                this.mxgraphAttach.className = "";

                // Always load the graph using IDs to support sending either objects or IDs as arguments.
                xhr.get(bootstrap.restUrl + "approval/approvalProcess/" + self.approvalParent.id, {
                    handleAs: "json"
                }).then(function(data) {
                    self.approvalProcess = data;

                    if (data.environment) {
                        self.environment = data.environment;
                        self.readOnly = (!self.environment.security["Manage Approval Processes"]);
                    }

                    if (data.environmentTemplate) {
                        self.environmentTemplate = data.environmentTemplate;
                        self.readOnly = (!self.environmentTemplate.security["Manage Approval Processes"]);
                    }

                    if (self.approvalProcess.rootActivity !== undefined) {
                        self.graphStartup(self.approvalProcess.rootActivity);
                    }
                    else {
                        self.graphStartup(null);
                    }
                });
            }
        },

        /**
         *
         */
        graphStartup: function(data) {
            this.inherited(arguments);

            var self = this;

            self.buildToolbar();

            if (!self.readOnly) {
                // Create the "add new component process" window.
                var addWindowContent = document.createElement('div');
                addWindowContent.className = "fileTree";

                // -- Approval process source tree table.
                self.stepTreeTable = new TreeTable({
                    rowPadding: 15,
                    hideFooterLinks: true,
                    hidePagination: true,
                    hideExpandCollapse: true,
                    tableConfigKey: "approvalProcessTreeTable",
                    columns: [{
                        name: i18n("Step Palette"),
                        "class": "activityTreeCell",
                        styleHeading: {"display": "none"},
                        formatter: function (item, value, cellDomNode) {
                            return self.stepTreeFormatter(item, cellDomNode, self.approvalProcess);
                        }
                    }],
                    url: bootstrap.restUrl+"approval/approvalProcess/approvalTypeTree",
                    orderField: "name",
                    getRawValue: function(item) {
                        var result = i18n(item.name);

                        if (item.name === i18n("Finish")) {
                            result = " 1 "+i18n("Finish");
                        }
                        if (item.name === i18n("Clipboard")) {
                            result = " 2 "+i18n("Clipboard");
                        }
                        return result;
                    },
                    lazyLoad: false,
                    draggable: false,
                    idAttribute: "path",
                    serverSideProcessing: false,
                    noDataMessage: i18n("No steps found")
                });

                self.stepTreeTable.placeAt(addWindowContent);
                domClass.add(self.stepTreeTable.expandCollapseAttach, "centered-expand-collapse");

                // -- Set up window object.
                var addWindow = new mxWindow(i18n("Step Palette"), addWindowContent, 0, 0, 240, 400, false, false, this.addAttach);
                addWindow.setMaximizable(false);
                addWindow.setScrollable(true);
                addWindow.setResizable(true);
                addWindow.setVisible(true);
            }
        },
        
        saveProcessDesign: function(comment) {
            var self = this;

            xhr.put(bootstrap.restUrl+"approval/approvalProcess/"+self.approvalParent.id+"/saveActivities", {
                data: JSON.stringify(self.getWorkflowJson())
            }).then(function(data){
                self.showSavePopup(i18n("Process design saved successfully."));
                self.clearHasChanges();
                self.clearChangedActivities();
            }, function(error) {
                self.showSaveErrorPopup(error);
            });
        }
    });
});

