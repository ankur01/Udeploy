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
        "js/webext/widgets/Alert",
        "js/webext/widgets/ColumnForm",
        "js/webext/widgets/RestSelect"
        ],
function(
        _TemplatedMixin,
        _Widget,
        declare,
        Alert,
        ColumnForm,
        RestSelect
) {
    return declare('deploy.widgets.componentProcess.EditComponentProcess',  [_Widget, _TemplatedMixin], {
        templateString:
            '<div class="editComponentProcess">'+
            '  <div data-dojo-attach-point="formAttach"></div>'+
            '</div>',

        /**
         *
         */
        postCreate: function() {
            this.inherited(arguments);
            var self = this;

            this.existingValues = {};
            if (this.componentProcess) {
                this.existingValues = this.componentProcess;
            }
            else {
                this.existingValues.takesVersion = true;
                this.existingValues.inventoryActionType = "ADD";
                this.existingValues.defaultWorkingDir = "${p:resource/work.dir}/${p:component.name}";
            }

            this.form = new ColumnForm({
                submitUrl: bootstrap.restUrl+"deploy/componentProcess",
                readOnly: self.readOnly,
                showButtons: !self.readOnly,
                postSubmit: function(data) {
                    if (self.component) {
                        navBar.setHash("component/"+self.component.id+"/processes", false, true);
                    }
                    else if (self.componentTemplate) {
                        navBar.setHash("componentTemplate/"+self.componentTemplate.id+"/-1/processes", false, true);
                    }

                    if (self.callback !== undefined) {
                        self.callback();
                    }
                },
                onError: function(error) {
                    if (error.responseText) {
                        var wrongVersionAlert = new Alert({
                            message: util.escape(error.responseText)
                        });
                    }
                    if (self.componentProcess) {
                        //set hash such that unsaved changes are visible, and refresh will update to latest version
                        navBar.setHash("componentProcess/"+self.componentProcess.id + "/-1/configuration", true, false);
                    }
                },
                addData: function(data) {
                    if (self.component) {
                        data.componentId = self.component.id;
                    }
                    else if (self.componentTemplate) {
                        data.componentTemplateId = self.componentTemplate.id;
                    }

                    if (self.componentProcess) {
                        data.existingId = self.componentProcess.id;
                        data.componentProcessVersion = self.componentProcess.version;
                    }
                    
                    // Translate from user-facing process type into server-consumable properties
                    var processType = data.processType;
                    delete data.processType;
                    
                    if (processType === "deploy") {
                        data.inventoryActionType = "ADD";
                        data.configActionType = "ADD";
                        data.takesVersion = true;
                    }
                    else if (processType === "config_deploy") {
                        data.configActionType = "ADD";
                        data.takesVersion = false;
                    }
                    else if (processType === "uninstall") {
                        data.inventoryActionType = "REMOVE";
                        data.takesVersion = true;
                    }
                    else if (processType === "operational_version") {
                        data.takesVersion = true;
                    }
                    else if (processType === "operational") {
                        data.takesVersion = false;
                    }
                },
                onCancel: function() {
                    if (self.callback !== undefined) {
                        self.callback();
                    }
                }
            });

            this.form.addField({
                name: "name",
                label: i18n("Name"),
                required: true,
                type: "Text",
                value: this.existingValues.name,
                textDir: util.getBaseTextDir()
            });

            this.form.addField({
                name: "description",
                label: i18n("Description"),
                type: "Text",
                value: this.existingValues.description
            });
            
            this.form.addField({
                name: "_type",
                type: "Invisible"
            });

            // Figure out the user-facing typed based on the value of certain properties from the
            // back-end
            var initialType = null;
            if (this.existingValues.takesVersion) {
                if (this.existingValues.inventoryActionType === "ADD") {
                    initialType = "deploy";
                }
                else if (this.existingValues.inventoryActionType === "REMOVE") {
                    initialType = "uninstall";
                }
                else {
                    initialType = "operational_version";
                }
            }
            else if (this.existingValues.configActionType === "ADD") {
                initialType = "config_deploy";
            }
            else {
                initialType = "operational";
            }
            
            this.form.addField({
                name: "processType",
                label: i18n("Process Type"),
                type: "Select",
                allowedValues: [{
                    label: i18n("Deployment"),
                    value: "deploy"
                },{
                    label: i18n("Configuration Deployment"),
                    value: "config_deploy"
                },{
                    label: i18n("Uninstall"),
                    value: "uninstall"
                },{
                    label: i18n("Operational (With Version)"),
                    value: "operational_version"
                },{
                    label: i18n("Operational (No Version Needed)"),
                    value: "operational"
                }],
                required: true,
                value: initialType,
                description: i18n("The type of action this process is performing. " +
                "Specify \"Deployment\" to install a component or \"Uninstall\" to " +
                "remove a component. Specify \"Configuration Deployment\" to apply " +
                "new configuration settings to a component without installing files. " +
                "Specify an operational process to make changes to an installed component " +
                "without changing its status in the inventory. "),
                onChange: function(value) {
                    if (value === "deploy"
                            || value === "uninstall") {
                        if (!self.form.hasField("status")) {
                            self.showStatusSelect();
                        }
                    }
                    else {
                        if (self.form.hasField("status")) {
                            self.form.removeField("status");
                        }
                    }
                }
            }, "_type");
            if (initialType === "deploy"
                    || initialType === "uninstall") {
                self.showStatusSelect();
            }

            this.form.addField({
                name: "defaultWorkingDir",
                label: i18n("Default Working Directory"),
                type: "Text",
                bidiDynamicSTT: "FILE_PATH",
                required: true,
                value: this.existingValues.defaultWorkingDir
            });

            // -- Required role
            var requiredRoleSelect = new RestSelect({
                restUrl: bootstrap.baseUrl+"security/role",
                value: this.existingValues.requiredRoleId
            });
            this.form.addField({
                name: "requiredRoleId",
                label: i18n("Required Role"),
                description: i18n("The role on the component which a user must have to execute this process"),
                widget: requiredRoleSelect
            });

            this.form.placeAt(this.formAttach);
        },

        /**
         *
         */
        showStatusSelect: function() {
            var statusSelect = new RestSelect({
                disabled: this.readOnly,
                restUrl: bootstrap.restUrl+"deploy/status/inventoryStatuses",
                getValue: function(item) {
                    return item.name;
                },
                getStyle: function(item) {
                    var result = {
                        backgroundColor: item.color
                    };
                    return result;
                },
                allowNone: false,
                value: this.existingValues.status
            });
            this.form.addField({
                name: "status",
                label: i18n("Inventory Status"),
                required: true,
                widget: statusSelect,
                description: i18n("The inventory status to add or remove.")
            }, "_type");
        }
    });
});
