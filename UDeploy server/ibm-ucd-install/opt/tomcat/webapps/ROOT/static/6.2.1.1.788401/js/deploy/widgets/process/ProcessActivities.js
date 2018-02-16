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
        "dojo/_base/array",
        "dojo/_base/lang",
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
        array,
        lang,
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
    return declare('deploy.widgets.process.ProcessActivities',  [BaseGraph], {
        processId: null,
        processVersion: null,
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

                if (this.process !== undefined) {
                    this.processId = this.process.id;
                    this.processVersion = this.process.version;
                }

                // Always load the graph using IDs to support sending either objects or IDs as arguments.
                xhr(bootstrap.restUrl+"process/"+this.processId+"/"+this.processVersion, {
                    handleAs: "json"
                }).then(function(data){
                    self.process = data;

                    self.readOnly = false;
                    if (data.versionCount !== data.version) {
                        self.readOnly = true;
                    }
                    else if (!self.process.security["Edit Basic Settings"]) {
                        self.readOnly = true;
                    }

                    if (self.process.rootActivity !== undefined) {
                        self.graphStartup(self.process.rootActivity);
                    }
                    else {
                        self.graphStartup(null);
                    }
                });
            }
        },

        /**`
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
                    tableConfigKey: "stepTreeTable",
                    columns: [{
                        name: i18n("Step Palette"),
                        "class": "activityTreeCell",
                        styleHeading: {"display": "none"},
                        formatter: function (item, value, cellDomNode) {
                            return self.stepTreeFormatter(item, cellDomNode, self.process);
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
                        },
                        field: "name"
                    }],
                    url: bootstrap.restUrl + "process/activityTree",
                    orderField: "name",
                    lazyLoad: false,
                    draggable: false,
                    idAttribute: "path",
                    serverSideProcessing: false,
                    alwaysShowFilters: true,
                    noDataMessage: i18n("No steps found")
                });
                self.stepTreeTable.placeAt(addWindowContent);
                domClass.add(self.stepTreeTable.tableAttach, "fixedLayout");
                domClass.add(self.stepTreeTable.expandCollapseAttach, "centered-expand-collapse");

                // -- Set up window object.
                var addWindow = new mxWindow(i18n("Step Palette"), addWindowContent, 0, 0, 240, 500, false, false, this.addAttach);
                addWindow.setMaximizable(false);
                addWindow.setScrollable(true);
                addWindow.setResizable(true);
                addWindow.setVisible(true);
            }
        },

        saveProcessDesign: function(comment) {
            var self = this;
            var json = self.getWorkflowJson();
            if (comment) {
                json.comment = comment;
            }

            xhr.put(bootstrap.restUrl+"process/"+self.process.id+"/activities", {
                data: JSON.stringify(json),
                headers: {
                    'processVersion': self.process.version,
                    'Content-Type': 'application/json'
                }
            }).then(function(data){
                self.showSavePopup(i18n("Process design saved successfully."));
                document.hasChanges = false;
                self.clearChangedActivities();
                navBar.setHash("process/"+self.process.id+"/-1/design", false, true);
            }, function(error) {
                self.showSaveErrorPopup(error);
            });
        }
    });
});

