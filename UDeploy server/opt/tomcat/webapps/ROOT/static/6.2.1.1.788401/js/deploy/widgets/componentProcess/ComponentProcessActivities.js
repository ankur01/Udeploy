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
    return declare('deploy.widgets.componentProcess.ComponentProcessActivities',  [BaseGraph], {
        componentId: null,
        componentTemplateId: null,
        componentProcessId: null,
        componentProcessVersion: null,
        readOnly: false,

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

                if (this.componentProcess !== undefined) {
                    this.componentProcessId = this.componentProcess.id;
                    this.componentProcessVersion = this.componentProcess.version;
                }

                // Always load the graph using IDs to support sending either objects or IDs as arguments.
                xhr(bootstrap.restUrl+"deploy/componentProcess/"+this.componentProcessId+"/"+this.componentProcessVersion, {
                    handleAs: "json"
                }).then(function(data){
                    self.component = data.component;
                    self.componentTemplate = data.componentTemplate;
                    self.componentProcess = data;

                    self.readOnly = false;
                    if (data.versionCount !== data.version) {
                        self.readOnly = true;
                    }
                    else if (self.componentTemplate && !self.componentTemplate.security["Manage Processes"]) {
                        self.readOnly = true;
                    }
                    else if (self.component && !self.component.security["Manage Processes"]) {
                        self.readOnly = true;
                    }

                    if (self.componentProcess.rootActivity !== undefined) {
                        self.graphStartup(self.componentProcess.rootActivity);
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
                // Create the "add new plugin step" window.
                var addWindowContent = document.createElement('div');
                addWindowContent.className = "fileTree";

                domConstruct.create("div", {}, addWindowContent);
                self.stepTreeTable = new TreeTable({
                    floatCollapseSpace: true,
                    rowPadding: 15,
                    allowHeaderLocking: false, // Does not work well inside another div
                    hideFooterLinks: true,
                    hidePagination: true,
                    tableConfigKey: "componentProcessTreeTable",
                    columns: [{
                        name: i18n("Step Palette"),
                        "class": "activityTreeCell",
                        styleHeading: {"display": "none"},
                        formatter: function (item, value, cellDomNode) {
                            return self.stepTreeFormatter(item, cellDomNode, self.componentProcess);
                        },
                        orderField: "name",
                        filterField: "name",
                        filterType: "text",
                        getRawValue: function(item) {
                            var result = i18n(item.name);
                            if (item.name === i18n("Finish")) {
                                result = " 1 "+i18n("Finish");
                            }
                            if (item.name === i18n("Clipboard")) {
                                result = " 2 "+i18n("Clipboard");
                            }
                            if (item.name === i18n("Utility Steps")) {
                                result = " 3 "+i18n("Utility Steps");
                            }
                            return result;
                        }
                    }],
                    url: bootstrap.restUrl + "deploy/componentProcess/"+this.componentProcess.id+"/activityTree",
                    orderField: 'name',
                    lazyLoad: false,
                    draggable: false,
                    idAttribute: 'path',
                    serverSideProcessing: false,
                    alwaysShowFilters: true,
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

            xhr.put(bootstrap.restUrl+"deploy/componentProcess/"+self.componentProcess.id+"/saveActivities", {
                data: JSON.stringify(json),
                headers: {
                    'componentProcessVersion': self.componentProcess.version,
                    'Content-Type': 'application/json'
                }
            }).then(function(data){
                self.showSavePopup(i18n("Process design saved successfully."));
                document.hasChanges = false;
                self.clearChangedActivities();
                navBar.setHash("componentProcess/"+self.componentProcess.id+"/-1", false, true);
            }, function(error) {
                self.showSaveErrorPopup(error);
            });
        }
    });
});
