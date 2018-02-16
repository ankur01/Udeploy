/*
* Licensed Materials - Property of IBM Corp.
* IBM UrbanCode Deploy
* (c) Copyright IBM Corporation 2011, 2014. All Rights Reserved.
*
* U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
* GSA ADP Schedule Contract with IBM Corp.
*/
define([
        "dojo/_base/declare",
        "dijit/_Widget",
        "dijit/_TemplatedMixin",
        "dijit/form/Button",
        "dijit/form/CheckBox",
        "dojo/dom-class",
        "dojo/dom-geometry",
        "dojo/dom-construct",
        "dojo/on",
        "dojo/topic",
        "dojo/_base/xhr",
        "dojo/io/iframe",
        "deploy/widgets/Formatters",
        "deploy/widgets/componentTemplate/EditComponentTemplate",
        "deploy/widgets/tag/Tagger",
        "deploy/widgets/tag/TagDisplay",
        "js/webext/widgets/Table",
        "js/webext/widgets/Dialog",
        "js/webext/widgets/GenericConfirm",
        "js/webext/widgets/Alert"
        ],
function(
        declare,
        _Widget,
        _TemplatedMixin,
        Button,
        CheckBox,
        domClass,
        domGeom,
        domConstruct,
        on,
        topic,
        xhr,
        ioIframe,
        Formatters,
        EditComponentTemplate,
        Tagger,
        TagDisplay,
        Table,
        Dialog,
        GenericConfirm,
        Alert
){
/**
 *
 */
    return declare(
        [_Widget, _TemplatedMixin],
        {
            templateString: 
                '<div class="componentTemplateList">' +
                    '<div class="listTopButtons" data-dojo-attach-point="buttonTopAttach"></div>' +
                    '<div data-dojo-attach-point="gridAttach"></div>' +
                    '<div data-dojo-attach-point="activeBoxAttach" style="margin: 2px;"></div>' +
                '</div>',
    
            /**
             *
             */
            postCreate: function() {
                this.inherited(arguments);
                var self = this;
                
                var gridRestUrl = bootstrap.restUrl+'deploy/componentTemplate';
                var gridLayout = [{
                    name: i18n("Name"),
                    formatter: function(item, value, cell) {
                        cell.style.position = "relative";

                        var result = domConstruct.create('div', {
                            'class': 'inlineBlock',
                            'style': 'margin-' + (domGeom.isBodyLtr()?"right":"left") + ":130px;"
                        });
                        var itemWrapper = domConstruct.create('div', {
                            'class': 'inlineBlock'
                        });

                        var link = Formatters.componentTemplateLinkFormatter(item);
                        domConstruct.place(link, itemWrapper);

                        domConstruct.place(itemWrapper, result);

                        self.tagger = new Tagger({
                            objectType: "ComponentTemplate",
                            item: item,
                            callback: function() {
                                self.grid.refresh();
                            }
                        });
                        self.tagger.placeAt(result);

                        return result;
                    },
                    orderField: "name",
                    filterField: "name",
                    filterType: "text",
                    getRawValue: function(item) {
                        return item.name;
                    }
                },{
                    name: i18n("Description"),
                    field: "description"
                },{
                    name: i18n("Created"),
                    field: "created",
                    formatter: util.tableDateFormatter,
                    orderField: "created",
                    getRawValue: function(item) {
                        return new Date(item.created);
                    }
                },{
                    name: i18n("By"),
                    field: "user",
                    orderField: "user",
                    getRawValue: function(item) {
                        return item.user;
                    }
                },{
                    name: i18n("Actions"),
                    formatter: this.actionsFormatter,
                    parentWidget: this
                }];
    
                this.grid = new Table({
                    url: gridRestUrl,
                    serverSideProcessing: false,
                    noDataMessage: i18n("No component templates found."),
                    tableConfigKey: "componentTemplateList",
                    columns: gridLayout
                });
                this.grid.placeAt(this.gridAttach);
    
                if (config.data.systemConfiguration.enableInactiveLinks) {
                    var activeBox = new CheckBox({
                        checked: false,
                        value: 'true',
                        onChange: function(value) {
                            if (value) {
                                self.grid.url = bootstrap.restUrl+"deploy/componentTemplate/all";
                            }
                            else {
                                self.grid.url = bootstrap.restUrl+"deploy/componentTemplate";
                            }
                            self.grid.refresh();
                        }
                    });
                    activeBox.placeAt(this.activeBoxAttach);
                    
                    var activeLabel = document.createElement("div");
                    domClass.add(activeLabel, "inlineBlock");
                    activeLabel.style.position = "relative";
                    activeLabel.style.top = "2px";
                    activeLabel.style.left = "2px";
                    activeLabel.innerHTML = i18n("Show Inactive Templates");
                    this.activeBoxAttach.appendChild(activeLabel);
                }
    
                if (config.data.permissions[security.system.createComponentTemplates]) {
                    var newComponentButton = {
                        label: i18n("Create Template"),
                        showTitle: false,
                        onClick: function() {
                            self.showNewComponentTemplateDialog();
                        }
                    };
                    
                    var importComponentButton = {
                        "label": i18n("Import Template"),
                        "showTitle": false,
                        "onClick": function() {
                            self.showImportTemplateDialog();
                        }
                    };

                    var componentButton = new Button(newComponentButton).placeAt(this.buttonTopAttach);
                    new Button(importComponentButton).placeAt(this.buttonTopAttach);
                    domClass.add(componentButton.domNode, "idxButtonSpecial");
                }
            },
    
            /**
             * 
             */
            destroy: function() {
                this.inherited(arguments);
                this.grid.destroy();
            },
    
            /**
             *
             */
            actionsFormatter: function(item) {
                var self = this.parentWidget;
                
                var result = document.createElement("div");
                
                if (item.security.Delete) {
                    var deleteLink = domConstruct.create("a", {
                        "class": "actionsLink linkPointer",
                        "innerHTML": i18n("Delete")
                    }, result);
                    on(deleteLink, "click", function() {
                        self.confirmDelete(item);
                    });
                }
            
                var exportLink = util.createDownloadAnchor({
                        "class":"actionsLink linkPointer",
                        "innerHTML": i18n("Export"),
                         "href": bootstrap.restUrl+"deploy/componentTemplate/"+item.id
                }, result);
    
                return result;
            },
            
            /**
             * 
             */
            confirmDelete: function(target) {
                var self = this;
                
                var confirm = new GenericConfirm({
                    message: i18n("Are you sure you want to delete %s? " +
                            "This will permanently delete it from the system.", target.name.escape()),
                    action: function() {
                        self.grid.block();
                        xhr.del({
                            url: bootstrap.restUrl+"deploy/componentTemplate/"+target.id,
                            handleAs: "json",
                            load: function(data) {
                                self.grid.unblock();
                                self.grid.refresh();
                            },
                            error: function(error) {
                                var errorDialog = new Dialog({
                                    title: i18n("Error deleting component template"),
                                    content: util.escape(error.responseText),
                                    closable: true,
                                    draggable: true
                                });
                                errorDialog.show();
                                self.grid.unblock();
                            }
                        });
                    }
                });
            },

            showImportTemplateDialog: function() {
                var self = this;
                
                var dialog = new Dialog({
                    "title": i18n("Import Template"),
                    "closable":true,
                    "draggable":true
                });
                
                self.processUpgradeType = "USE_EXISTING_IF_EXISTS";
                var form = document.createElement("form");
                form.target = "formTarget";
                form.method = "POST";
                form.enctype = "multipart/form-data";
                form.encoding = "multipart/form-data";
                
                var fileInput = document.createElement("input");
                fileInput.type = "file";
                fileInput.name = "file";
                
                var checkBoxDiv = document.createElement("div");
                var checkBoxLabel = document.createElement("div");
                checkBoxLabel.innerHTML = i18n("Upgrade Template");
                domClass.add(checkBoxLabel, "inlineBlock");
                var upgradeInput = document.createElement("input");
                upgradeInput.type = "checkbox" ;
                upgradeInput.name = i18n("Upgrade Template");

                //Add process upgrade type select
                var processSelectBoxDiv = document.createElement("div");
                var processSelectBoxLabel = document.createElement("div");
                processSelectBoxLabel.innerHTML = i18n("Generic Process Upgrade Type");
                domClass.add(processSelectBoxLabel, "inlineBlock");

                var processUpgradeTypeInput = document.createElement("select");

                var useExistingProcess = document.createElement("option");
                useExistingProcess.innerHTML= i18n("Use Existing Process");
                useExistingProcess.value="USE_EXISTING_IF_EXISTS";
                processUpgradeTypeInput.appendChild(useExistingProcess);

                var createNewProcess = document.createElement("option");
                createNewProcess.innerHTML= i18n("Create Process");
                createNewProcess.value="CREATE_NEW_IF_EXISTS";
                processUpgradeTypeInput.appendChild(createNewProcess);

                var failIfProcessExists = document.createElement("option");
                failIfProcessExists.innerHTML= i18n("Fail If Process Exists");
                failIfProcessExists.value="FAIL_IF_EXISTS";
                processUpgradeTypeInput.appendChild(failIfProcessExists);

                var failIfProcessDoesntExists = document.createElement("option");
                failIfProcessDoesntExists.innerHTML= i18n("Fail If Process Does Not Exist");
                failIfProcessDoesntExists.value="FAIL_IF_DOESNT_EXIST";
                processUpgradeTypeInput.appendChild(failIfProcessDoesntExists);

                var upgradeIfProcessExists = document.createElement("option");
                upgradeIfProcessExists.innerHTML= i18n("Upgrade If Exists");
                upgradeIfProcessExists.value="UPGRADE_IF_EXISTS";
                processUpgradeTypeInput.appendChild(upgradeIfProcessExists);

                on(processUpgradeTypeInput, "change", function(evt) {
                    self.processUpgradeType = evt.target.value;
                    self.setFormAction(form);
                });

                processSelectBoxDiv.appendChild(processSelectBoxLabel);
                processSelectBoxDiv.appendChild(processUpgradeTypeInput);

                var submitButton = document.createElement("input");
                submitButton.type = "submit";
                submitButton.value = i18n("Submit");
                submitButton.style.display = "block";
                
                checkBoxDiv.appendChild(checkBoxLabel);
                checkBoxDiv.appendChild(upgradeInput);
                form.appendChild(checkBoxDiv);
                form.appendChild(processSelectBoxDiv);
                form.appendChild(fileInput);
                form.appendChild(submitButton);
                dialog.containerNode.appendChild(form);
                
                form.onsubmit = function() {
                    var result = true;
                    if (!fileInput.value) {
                        var fileAlert = new Alert({
                            message: i18n("Please choose a template json file to import.")
                        });
                        result = false;
                    }
                    else {
                        var sessionValue = util.getCookie(bootstrap.expectedSessionCookieName);
                        form.action = bootstrap.restUrl + "deploy/componentTemplate/" +
                                (upgradeInput.checked === true ? "upgrade" : "import") + 
                                "?processUpgradeType=" + self.processUpgradeType + "&" +
                                bootstrap.expectedSessionCookieName+"="+sessionValue;

                        ioIframe.send({
                            form: form,
                            handleAs: "json",
                            load: function(response) {
                                if (response.status === "ok") {
                                    dialog.hide();
                                    dialog.destroy();
                                    self.grid.refresh();
                                }
                                else {
                                    var fileAlert = new Alert({
                                        message: i18n("Error importing component template: %s", response.error)
                                    });
                                    fileAlert.startup();
                                }
                            },
                            error: function(response) {
                                var fileAlert = new Alert({
                                    message: i18n("Error importing component template: %s", response.error)
                                });
                                fileAlert.startup();
                            }
                        });
                    }
                    return result;
                };
                dialog.show();
            },
            
            /**
             * 
             */
            showNewComponentTemplateDialog: function() {
                var self = this;
                
                var newComponentTemplateDialog = new Dialog({
                    title: i18n("Create Component Template"),
                    closable: true,
                    draggable: true
                });
                
                var newComponentTemplateForm = new EditComponentTemplate({
                    callback: function() {
                        newComponentTemplateDialog.hide();
                        newComponentTemplateDialog.destroy();
                    }
                });
                newComponentTemplateForm.placeAt(newComponentTemplateDialog.containerNode);
                newComponentTemplateDialog.show();
            }
        }
    );
});