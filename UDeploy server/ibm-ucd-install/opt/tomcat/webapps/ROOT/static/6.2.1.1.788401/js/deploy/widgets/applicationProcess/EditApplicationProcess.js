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
        "dojo/_base/array",
        "dojo/_base/declare",
        "dojo/_base/xhr",
        "js/webext/widgets/Alert",
        "js/webext/widgets/ColumnForm"
        ],
function(
        _TemplatedMixin,
        _Widget,
        array,
        declare,
        xhr,
        Alert,
        ColumnForm
) {
    return declare('deploy.widgets.applicationProcess.EditApplicationProcess',  [_Widget, _TemplatedMixin], {
        templateString:
            '<div class="editApplicationProcess">'+
            '  <div data-dojo-attach-point="formAttach"></div>'+
            '</div>',

        /**
         *
         */
        postCreate: function() {
            this.inherited(arguments);
            var self = this;

            this.componentsForPresets = [];
            this.existingValues = {};
            if (this.applicationProcess) {
                this.existingValues = this.applicationProcess;
            }

            var navigationHash = "";
            if (self.application) {
                // set variables for application here
                navigationHash = "application/" + self.application.id + "/processes";
            }

            // If we have both an application and a template something is wrong,
            // template should take precedence though.
            if (self.applicationTemplate) {
                navigationHash = "applicationTemplate/" + self.applicationTemplate.id
                        + "/-1/processes";
            }

            this.form = new ColumnForm({
                submitUrl: bootstrap.restUrl+"deploy/applicationProcess",
                readOnly: self.readOnly,
                showButtons: !self.readOnly,
                postSubmit: function(data) {
                    navBar.setHash(navigationHash, false, true);
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
                    if (self.applicationProcess) {
                        //set hash such that unsaved changes are visible, and refresh will update to latest version
                        navBar.setHash("applicationProcess/"+self.applicationProcess.id + "/-1/configuration", true, false);
                    }
                },
                addData: function(data) {
                    if (self.application) {
                        data.applicationId = self.application.id;
                    }
                    else if (self.applicationTemplate) {
                        data.applicationTemplateId = self.applicationTemplate.id;
                        // Always make inventory management automatic for application template
                        // processes. Because application templates cannot have components,
                        // setting the management type to Advanced won't work.
                        data.inventoryManagementType = "AUTOMATIC";
                    }
                    if (self.applicationProcess) {
                        data.existingId = self.applicationProcess.id;
                        data.applicationProcessVersion = self.applicationProcess.version;
                    }
                    if (self.applicationProcess) {
                        data.applicationProcessVersion = self.applicationProcess.version;
                    }

                    // Assemble version preset fields.
                    data.versionPresets = [];
                    array.forEach(self.componentsForPresets, function(component) {
                        var presetValue = data["ver_"+component.id];

                        if (presetValue && presetValue !== "none/") {
                            data.versionPresets.push({
                                selector: presetValue,
                                component: component.id
                            });
                        }
                    });
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
                value: this.existingValues.name
            });

            this.form.addField({
                name: "description",
                label: i18n("Description"),
                type: "Text",
                value: this.existingValues.description
            });

            // -- Inventory management type
            // Disable for application templates due to UI bugs caused by selecting advanced inventory management.
            if (self.application) {
                this.form.addField({
                    name: "inventoryManagementType",
                    label: i18n("Inventory Management"),
                    description: i18n("How inventory updates will be managed for this process."),
                    type: "Select",
                    required: true,
                    allowedValues: [{
                        label: i18n("Automatic"),
                        value: "AUTOMATIC"
                    },{
                        label: i18n("Advanced"),
                        value: "ADVANCED"
                    }],
                    value: this.existingValues.inventoryManagementType
                });
            }

            // -- Offline agent handling
            this.form.addField({
                name: "offlineAgentHandling",
                label: i18n("Offline Agent Handling"),
                description: i18n("How this process will react when some of the agents it would use are offline."),
                type: "Select",
                required: true,
                allowedValues: [{
                    label: i18n("Check Before Execution"),
                    value: "PRE_EXECUTION_CHECK"
                },{
                    label: i18n("Use All Available; Report Failure"),
                    value: "FAIL_BUT_CONTINUE"
                },{
                    label: i18n("Always Report Success"),
                    value: "ALLOW_OFFLINE"
                }],
                value: this.existingValues.offlineAgentHandling
            });

            // -- Required role
            this.form.addField({
                name: "requiredRoleId",
                label: i18n("Required Role"),
                description: i18n("The role on the application which a user must have to execute this process"),
                url: bootstrap.baseUrl+"security/role",
                value: this.existingValues.requiredRoleId,
                allowNone: true,
                type: "TableFilterSelect"
            });

            if (this.existingValues.application) {
                xhr.get({
                    url: bootstrap.restUrl + "deploy/applicationProcess/" + self.applicationProcess.id +
                            "/componentsTakingVersions/" + self.application.id,
                    handleAs: "json",
                    load: function(data) {
                        // Now we have the components taking versions.
                        if (data.length > 0 || self.existingValues.versionPresets) {
                            self.form.addField({
                                type: "Label",
                                value: i18n("Version presets can be configured below. Whenever a value other than 'None' is given here, the user will not be able to provide a value at runtime, and any snapshot versions for that component will be ignored.")
                            });
                        }

                        // Alphabetize components here - merge both the list of components with no
                        // presets and those with presets, sort that list, and then show them all.
                        var componentNames = [];
                        var componentData = {};

                        array.forEach(data, function(component) {
                            componentNames.push(component.name);
                            componentData[component.name] = {
                                component: component
                            };
                        });
                        array.forEach(self.existingValues.versionPresets, function(preset) {
                            componentNames.push(preset.component.name);
                            componentData[preset.component.name] = {
                                component: preset.component,
                                value: preset.selector
                            };
                        });

                        componentNames.sort();
                        array.forEach(componentNames, function(componentName) {
                            self.addPresetField(componentData[componentName].component,
                                    componentData[componentName].value);
                        });
                    }
                });
            }

            this.form.placeAt(this.formAttach);
        },
        
        addPresetField: function(component, value) {
            var labelSpan = document.createElement("span");
            var componentSpan = document.createElement("span");
            componentSpan.innerHTML = i18n("Version for %s", component.name.escape());
            labelSpan.appendChild(componentSpan);
            
            this.componentsForPresets.push(component);
            var name = "ver_"+component.id;

            this.form.addField({
                label: labelSpan,
                name: name,
                type: "VersionSelector",
                context: {
                    component: component
                },
                value: value,
                required: false
            });
        }
    });
});