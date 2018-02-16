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
        "deploy/widgets/process/RequiredCommentForm",
        "js/webext/widgets/Alert",
        "js/webext/widgets/GenericConfirm",
        "js/webext/widgets/Dialog",
        "js/webext/widgets/table/TreeTable"
        ],
function(
        declare,
        xhr,
        domClass,
        domConstruct,
        JSON,
        BaseGraph,
        RequiredCommentForm,
        Alert,
        GenericConfirm,
        Dialog,
        TreeTable
) {
    return declare('deploy.widgets.applicationProcess.ApplicationProcessActivities',  [BaseGraph], {
        /**
         *
         */
        postCreate: function() {
            this.inherited(arguments);
            var self = this;

            if (!mxClient.isBrowserSupported()) {
                mxUtils.error(i18n("This browser is not compatible with the rich workflow editor."), 200, false);
            }
            else {
                this.toolBarContainer.className = "mx-graph-pane mx-graph-top-pane";
                this.processStepContainer.className = "mx-graph-pane mx-graph-bottom-pane";
                this.mxgraphAttach.className = "";

                if (this.applicationProcess !== undefined) {
                    this.applicationProcessId = this.applicationProcess.id;
                }

                // Always load the graph using IDs to support sending either objects or IDs as arguments.
                xhr(bootstrap.restUrl+"deploy/applicationProcess/"+this.applicationProcessId+"/"+this.applicationProcessVersion, {
                    handleAs: "json"
                }).then(function(data){
                    self.application = data.application;
                    self.applicationProcess = data;

                    if (!self.hasManageProcessesPermission() || data.versionCount !== data.version) {
                        self.readOnly = true;
                    }
                    else {
                        self.readOnly = false;
                    }

                    if (self.applicationProcess.rootActivity !== undefined) {
                        self.graphStartup(self.applicationProcess.rootActivity);
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

            if (!this.readOnly) {
                // Create the "add new component process" window.
                var addWindowContent = document.createElement('div');
                addWindowContent.className = "fileTree";

                // -- Component process source tree table.
                self.stepTreeTable = new TreeTable({
                    rowPadding: 15,
                    allowHeaderLocking: false, // Does not work well inside another div
                    hideFooterLinks: true,
                    hidePagination: true,
                    floatCollapseSpace: true,
                    tableConfigKey: "applicationProcessTreeTable",
                    url: bootstrap.restUrl +"deploy/applicationProcess/"+self.applicationProcess.id+"/activityTree",
                    orderField: "name",
                    draggable: false,
                    idAttribute: "path",
                    serverSideProcessing: false,
                    columns: [{
                        name: i18n("Step Palette"),
                        "class": "activityTreeCell",
                        styleHeading: {"display": "none"},
                        filterField: "name",
                        filterType: "text",
                        orderField: "name",
                        getRawValue: function(item) {
                            var result = i18n(item.name);
                            // Finish is special so it should go first
                            if (item.name === i18n("Finish")) {
                                result = " 1 "+i18n("Finish");
                            }
                            // Top Level Steps ( Install, Uninstall, Rollback, etc...)
                            else if (!item.children && !item.hasChildren) {
                                result = " 2 " + item.name;
                            }
                            // Special folders created by us
                            else if (item.name === i18n("Utility Steps")
                                    || item.name === i18n("Clipboard")
                                    || item.name === i18n("Configuration Discovery")) {
                                result = " 3 " + item.name;
                            }
                            // Component folders
                            else {
                                result = " 4 " + item.name;
                            }
                            return result;
                        },
                        formatter: function (item, value, cellDomNode) {
                            return self.stepTreeFormatter(item, cellDomNode, self.applicationProcess);
                        }
                    }],
                    hasChildren: function(item) {
                        var result = false;
                        if (item.children !== undefined || item.hasChildren) {
                            result = true;
                        }
                        return result;
                    },
                    getChildUrl: function(item) {
                        // Lazy-load entries underneath components. We assume anything we're calling
                        // getChildUrl on is a component.
                        return bootstrap.restUrl+"deploy/component/"+item.id+"/processesForStepPalette";
                    },
                    noDataMessage: i18n("No steps found")
                });
                self.stepTreeTable.placeAt(addWindowContent);
                domClass.add(self.stepTreeTable.expandCollapseAttach, "centered-expand-collapse");

                // -- Set up window object.
                var addWindow = new mxWindow(i18n("Step Palette"), addWindowContent, 0, 0, 240, 500, false, false, this.addAttach);
                addWindow.setMaximizable(false);
                addWindow.setScrollable(true);
                addWindow.setResizable(true);
                addWindow.setVisible(true);
            }
        },
        destroy : function() {
           domConstruct.empty(this.toolbarAttach);
        },

        saveProcessDesign: function(comment) {
            var self = this;
            var json = self.getWorkflowJson();
            if (comment) {
                json.comment = comment;
            }

            xhr.put(bootstrap.restUrl+"deploy/applicationProcess/"+self.applicationProcess.id+"/saveActivities", {
                data: JSON.stringify(json),
                handleAs: "json",
                headers: {
                    'applicationProcessVersion': self.applicationProcess.version,
                    'Content-Type': 'application/json'
                }
            }).then(function(data){
                self.showSavePopup(i18n("Process design saved successfully."));
                document.hasChanges = false;
                self.clearChangedActivities();
                navBar.setHash("applicationProcess/"+self.applicationProcess.id+"/-1", false, true);
            }, function(error) {
                self.showSaveErrorPopup(error);
            });
        },

        hasManageProcessesPermission: function() {
            var self = this;
            var result = false;

            if (self.application) {
                result = self.application.security["Manage Processes"];
            }
            else if (self.applicationTemplate) {
                result = self.applicationTemplate.security["Manage Processes"];
            }

            return result;
        }
    });
});

