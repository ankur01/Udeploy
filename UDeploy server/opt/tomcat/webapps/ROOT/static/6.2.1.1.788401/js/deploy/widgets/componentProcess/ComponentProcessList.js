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
        "dijit/form/CheckBox",
        "dojo/_base/array",
        "dojo/_base/declare",
        "dojo/_base/xhr",
        "dojo/dom-class",
        "dojo/dom-construct",
        "dojo/json",
        "dojo/on",
        "deploy/widgets/Formatters",
        "deploy/widgets/componentProcess/EditComponentProcess",
        "js/webext/widgets/Alert",
        "js/webext/widgets/Dialog",
        "js/webext/widgets/GenericConfirm",
        "js/webext/widgets/table/TreeTable"
        ],
function(
        _TemplatedMixin,
        _Widget,
        Button,
        CheckBox,
        array,
        declare,
        xhr,
        domClass,
        domConstruct,
        JSON,
        on,
        Formatters,
        EditComponentProcess,
        Alert,
        Dialog,
        GenericConfirm,
        TreeTable
) {
    /**
     *
     */
    return declare('deploy.widgets.componentProcess.ComponentProcessList',  [_Widget, _TemplatedMixin], {
        templateString:
            '<div class="componentProcessList">' +
                '<div class="listTopButtons" data-dojo-attach-point="buttonAttach"></div>' +
                '<div data-dojo-attach-point="gridAttach"></div>' +
                '<div data-dojo-attach-point="activeBoxAttach" style="margin: 2px;"></div>' +
                '<div data-dojo-attach-point="copyContainer" class="hidden">' +
                    '<div data-dojo-attach-point="copyLabel" style="margin-top: 15px;"></div>' +
                    '<div class="innerContainer">' +
                        '<div data-dojo-attach-point="copyAttach"></div>' +
                        '<div data-dojo-attach-point="copyButtonAttach"></div>' +
                    '</div>' +
                '</div>' +
            '</div>',

        processListHash: null,
        baseGridUrl: null,
        basePasteUrl: null,
        readOnly: false,

        /**
         *
         */
        postCreate: function() {
            this.inherited(arguments);
            var self = this;
            var t = this;

            if (this.component) {
                this.processListHash = "component/"+this.component.id+"/processes";
                this.basePasteUrl = bootstrap.restUrl+"deploy/component/"+this.component.id+
                        "/pasteProcess";
                this.baseGridUrl = bootstrap.restUrl+"deploy/component/"+this.component.id+
                        "/processes";

                this.readOnly = !this.component.security["Manage Processes"];
            }
            else if (this.componentTemplate) {
                this.processListHash = "componentTemplate/"+this.componentTemplate.id+"/"+
                        this.componentTemplate.version+"/processes";
                this.basePasteUrl = bootstrap.restUrl+"deploy/componentTemplate/"+
                        this.componentTemplate.id+"/pasteProcess";
                this.baseGridUrl = bootstrap.restUrl+"deploy/componentTemplate/"+
                        this.componentTemplate.id+"/"+this.componentTemplate.version+"/processes";

                this.readOnly =
                        ((this.componentTemplate.version !== this.componentTemplate.versionCount)
                        || !this.componentTemplate.security["Manage Processes"]);
            }

            if (util.getCookie("copiedComponentProcesses") !== undefined) {
                this.copyContainer.className = "";

                this.copyLabel.innerHTML = i18n("Process Clipboard");
                this.copyLabel.className = "containerLabel";

                var copyGridLayout = [{
                    name: i18n("Process"),
                    formatter: function(item) {
                        var result = "";
                        if (self.component) {
                            result = Formatters.componentProcessLinkFormatter(item);
                        }
                        else if (self.componentTemplate) {
                            result = Formatters.componentTemplateProcessLinkFormatter(item);
                        }
                        return result;
                    }
                },{
                    name: i18n("From"),
                    formatter: function(item) {
                        var result = "";
                        if (item.component) {
                            result = Formatters.componentLinkFormatter(item.component);
                        }
                        else if (item.componentTemplate) {
                            result = Formatters.componentTemplateLinkFormatter(item.componentTemplate);
                        }
                        return result;
                    }
                },{
                    name: i18n("Description"),
                    field: "description"
                },{
                    name: i18n("Actions"),
                    parentWidget: self,
                    formatter: this.copyActionsFormatter
                }];

                this.copyGrid = new TreeTable({
                    serverSideProcessing: false,
                    columns: copyGridLayout,
                    getData: function() {
                        var copiedComponentProcessesCookie = util.getCookie("copiedComponentProcesses");
                        var copiedComponentProcesses = JSON.parse(copiedComponentProcessesCookie);
                        return copiedComponentProcesses;
                    },
                    hidePagination: true,
                    rowsPerPage: 1000,
                    hideExpandCollapse: true
                });
                this.copyGrid.placeAt(this.copyAttach);

                var clearCopiedProcessesButton = new Button({
                    label: i18n("Clear Copied Processes"),
                    showTitle: false,
                    onClick: function() {
                        util.clearCookie("copiedComponentProcesses");
                        navBar.setHash(t.processListHash, false, true);
                    }
                });
                clearCopiedProcessesButton.placeAt(this.copyButtonAttach);

                if (!this.readOnly) {
                    var pasteAllButton = new Button({
                        label: i18n("Paste All"),
                        showTitle: false,
                        onClick: function() {
                            var copiedComponentProcessesCookie = util.getCookie("copiedComponentProcesses");
                            var copiedComponentProcesses = JSON.parse(copiedComponentProcessesCookie);

                            var index = 0;
                            var pasteProcess = function(index) {
                                var process = copiedComponentProcesses[index];

                                xhr.get({
                                    url: self.basePasteUrl+"/"+process.id,
                                    handleAs: "json",
                                    load: function(data) {
                                        index++;
                                        if (index === copiedComponentProcesses.length) {
                                            self.grid.refresh();
                                            if (self.componentTemplate) {
                                                navBar.setHash("componentTemplate/"+self.componentTemplate.id+"/-1/processes");
                                            }
                                        }
                                        else {
                                            pasteProcess(index);
                                        }
                                    },
                                    error: function(error) {
                                        var alert = new Alert({
                                            messages: [i18n("Error pasting processes:"),
                                                       "",
                                                       util.escape(error.responseText)]
                                        });
                                    }
                                });
                            };
                            pasteProcess(index);
                        }
                    });
                    pasteAllButton.placeAt(this.copyButtonAttach);
                }
            }

            var gridRestUrl = this.baseGridUrl+"/false";
            var gridLayout = [{
                name: i18n("Process"),
                formatter: function(item) {
                    var result = "";
                    if (self.component) {
                        result = Formatters.componentProcessLinkFormatter(item);
                    }
                    else if (self.componentTemplate) {
                        result = Formatters.componentTemplateProcessLinkFormatter(item);
                    }
                    return result;
                }
            },{
                name: i18n("Description"),
                field: "description"
            },{
                name: i18n("Actions"),
                parentWidget: self,
                formatter: this.actionsFormatter
            }];

            this.grid = new TreeTable({
                url: gridRestUrl,
                serverSideProcessing: false,
                columns: gridLayout,
                tableConfigKey:"componentProcessListKey",
                noDataMessage: i18n("No processes have been added to this component."),
                hidePagination: false,
                hideExpandCollapse: true
            });
            this.grid.placeAt(this.gridAttach);

            if (config.data.systemConfiguration.enableInactiveLinks) {
                var activeBox = new CheckBox({
                    checked: false,
                    value: 'true',
                    onChange: function(value) {
                        self.grid.url = self.baseGridUrl+"/"+value;
                        self.grid.refresh();
                    }
                });
                activeBox.placeAt(this.activeBoxAttach);

                var activeLabel = document.createElement("div");
                domClass.add(activeLabel, "inlineBlock");
                activeLabel.style.position = "relative";
                activeLabel.style.top = "2px";
                activeLabel.style.left = "2px";
                activeLabel.innerHTML = i18n("Show Inactive Processes");
                this.activeBoxAttach.appendChild(activeLabel);
            }

            if (!this.readOnly) {
                var newComponentProcessButton = new Button({
                    label: i18n("Create Process"),
                    showTitle: false,
                    onClick: function() {
                        self.showNewComponentProcessDialog();
                    }
                });
                domClass.add(newComponentProcessButton.domNode, "idxButtonSpecial");
                newComponentProcessButton.placeAt(this.buttonAttach);
            }
        },

        /**
         *
         */
        destroy: function() {
            this.inherited(arguments);
            this.grid.destroy();

            if (this.copyGrid !== undefined) {
                this.copyGrid.destroy();
            }
        },

        /**
         *
         */
        actionsFormatter: function(item) {
            var self = this.parentWidget;
            var result = document.createElement("div");

            if (!self.readOnly) {
                var editLink = document.createElement("a");
                editLink.className = "actionsLink";
                editLink.innerHTML = i18n("Edit");
                editLink.href = "#componentProcess/"+item.id+"/-1";
                result.appendChild(editLink);
            }

            var copyLink = domConstruct.create("a", {
                "class": "actionsLink linkPointer",
                "innerHTML": i18n("Copy")
            }, result);
            on(copyLink, "click", function() {
                var distilledItem = {
                    id: item.id,
                    name: item.name,
                    description: item.description
                };

                if (item.component) {
                    distilledItem.component = {
                        id: item.component.id,
                        name: item.component.name
                    };
                }
                else if (item.componentTemplate) {
                    distilledItem.componentTemplate = {
                        id: item.componentTemplate.id,
                        name: item.componentTemplate.name
                    };
                }

                var copiedComponentProcessesCookie = util.getCookie("copiedComponentProcesses");
                var copiedComponentProcesses = [];
                if (copiedComponentProcessesCookie !== undefined) {
                    copiedComponentProcesses = JSON.parse(copiedComponentProcessesCookie);
                }
                if (copiedComponentProcesses.length > 0) {
                    array.forEach(copiedComponentProcesses, function(process) {
                        if (process !== undefined && process.id === distilledItem.id) {
                            util.removeFromArray(copiedComponentProcesses, process);
                        }
                    });
                }
                copiedComponentProcesses.push(distilledItem);
                util.setCookie("copiedComponentProcesses", JSON.stringify(copiedComponentProcesses));

                if (copiedComponentProcessesCookie === undefined) {
                    navBar.setHash(self.processListHash, false, true);
                }
                else {
                    self.copyGrid.refresh();
                }
            });

            if (!self.readOnly) {
                var deleteLink = domConstruct.create("a", {
                    "class": "actionsLink linkPointer",
                    "innerHTML": i18n("Delete")
                }, result);
                on(deleteLink, "click", function() {
                    self.confirmDelete(item);
                });
            }

            return result;
        },

        /**
         *
         */
        copyActionsFormatter: function(item) {
            var self = this.parentWidget;
            var result = document.createElement("div");

            if (!self.readOnly) {
                var pasteLink = domConstruct.create("a", {
                    "class": "actionsLink linkPointer",
                    "innerHTML": i18n("Paste")
                }, result);
                on(pasteLink, "click", function() {
                    xhr.get({
                        url: self.basePasteUrl+"/"+item.id,
                        handleAs: "json",
                        load: function(data) {
                            if (self.componentTemplate) {
                                navBar.setHash("componentTemplate/"+self.componentTemplate.id+"/-1/processes", false, true);
                            }
                            else {
                                self.copyGrid.refresh();
                                self.grid.refresh();
                                if (self.componentTemplate) {
                                    navBar.setHash("componentTemplate/"+self.componentTemplate.id+"/-1/processes");
                                }
                            }
                        },
                        error: function(error) {
                            var alert = new Alert({
                                messages: [i18n("Error pasting processes:"),
                                           "",
                                           util.escape(error.responseText)]
                            });
                            alert.startup();
                        }
                    });
                });
            }

            var clearLink = domConstruct.create("a", {
                "class": "actionsLink linkPointer",
                "innerHTML": i18n("Remove")
            }, result);
            on(clearLink, "click", function() {
                var copiedComponentProcessesCookie = util.getCookie("copiedComponentProcesses");
                var copiedComponentProcesses = JSON.parse(copiedComponentProcessesCookie);

                array.forEach(copiedComponentProcesses, function(process) {
                    if (process !== undefined && process.id === item.id) {
                        util.removeFromArray(copiedComponentProcesses, process);
                    }
                });

                if (copiedComponentProcesses.length > 0) {
                    util.setCookie("copiedComponentProcesses", JSON.stringify(copiedComponentProcesses));
                    self.copyGrid.refresh();
                }
                else {
                    util.clearCookie("copiedComponentProcesses");
                    navBar.setHash(self.processListHash, false, true);
                }
            });

            return result;
        },

        /**
         *
         */
        confirmDelete: function(target, affectedProcesses) {
            var self = this;
            var targetName = target.name.escape();
            var confirm = new GenericConfirm({
                message: i18n("Are you sure you want to delete %1?  Note that any application processes that " +
                        "currently use %1 will continue to use it.", targetName),
                action: function() {
                    self.grid.block();
                    xhr.del({
                        url: bootstrap.restUrl+"deploy/componentProcess/"+target.id,
                        handleAs: "json",
                        load: function(data) {
                            self.grid.unblock();
                            self.grid.refresh();
                            if (self.componentTemplate) {
                                navBar.setHash("componentTemplate/"+self.componentTemplate.id+"/-1/processes", false, true);
                            }
                        },
                        error: function(error) {
                            if (error.responseText) {
                                var wrongNameAlert = new Alert({
                                    messages: [i18n("Error deleting component process:"),
                                                       "",
                                                       util.escape(error.responseText)]
                                });
                            }
                            self.grid.refresh();
                            self.grid.unblock();
                        }
                    });
                }
            });
        },

        /**
         *
         */
        showNewComponentProcessDialog: function() {
            var self = this;

            var newComponentProcessDialog = new Dialog({
                title: i18n("Create Process"),
                closable: true,
                draggable: true
            });

            var newComponentProcessForm = new EditComponentProcess({
                component: this.component,
                componentTemplate: this.componentTemplate,
                callback: function() {
                    newComponentProcessDialog.hide();
                    newComponentProcessDialog.destroy();
                }
            });
            newComponentProcessForm.placeAt(newComponentProcessDialog.containerNode);
            newComponentProcessDialog.show();
        }
    });
});