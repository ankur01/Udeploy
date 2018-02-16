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
        "dojo/_base/array",
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/on",
        "deploy/widgets/workflow/activity/BaseActivity",
        "js/webext/widgets/RestSelect",
        "deploy/widgets/property/PropertyTextareaBox"
        ],
function(
        array,
        declare,
        lang,
        on,
        BaseActivity,
        RestSelect,
        PropertyArea
) {
    return declare('deploy.widgets.workflow.activity.InstallComponentActivity',  [BaseActivity], {
        postCreate: function() {
            this.inherited(arguments);

            if (!this.initialized) {
                this.data.name = util.randomString(30);
                this.editProperties();
            }
        },

        getLabel: function() {
            var result = "";

            if (!this.initialized) {
                result += i18n("Install Component");
            }
            else {
                var childChildData = this.getChildChildData();
                if (childChildData.component && childChildData.component.deleted) {
                    result += childChildData.name+"\n"+i18n("(Deleted Component)");
                }
                else {
                    var defaultLabel = i18n("Install %s", childChildData.componentName);
                    result += childChildData.name;
                    if (result !== defaultLabel) {
                        if (childChildData.componentName) {
                            result += "\n"+defaultLabel;
                        }
                        else {
                            result += "\n"+i18n("Process Deleted");
                        }

                    }
                }
            }

            return result;
        },

        /**
         *
         */
        editProperties: function(callback) {
            var self = this;

            var childData = this.getChildData();
            var childChildData = this.getChildChildData();

            // component select used by submit
            var componentSelect;

            var propertyDialog = self.createPropertyDialog();
            var propertyForm = self.createPropertyForm({
                dialog: propertyDialog,
                validateFields: function(data) {
                    return self.validateName(data.name);
                },
                onSubmit: function(data) {
                    if (callback) {
                        callback();
                    }
                    self.initialized = true;

                    // Preserve some IDs to assist in persistence.
                    var componentEnvironmentIteratorId, inventoryVersionDiffId, componentProcessId;
                    var iteratorId = self.data.id;
                    if (iteratorId) {
                        // If iteratorId exists, these values will exist as well
                        inventoryVersionDiffId = self.data.children[0].id;
                        componentProcessId = self.data.children[0].children[0].id;
                    }

                    self.data = {
                        "id": iteratorId,
                        "name": self.data.name,
                        "type": "componentEnvironmentIterator"
                    };

                    self.data.component = componentSelect.get("item");
                    self.data.componentName = self.data.component.name;
                    if (data.tagId && data.tagId !== "") {
                        self.data.tagId = data.tagId;
                    }
                    else if (self.data.tagId) {
                        self.data.tagId = undefined;
                    }

                    self.data.runOnlyOnFirst = data.runOnlyOnFirst;
                    self.data.maxIteration = data.maxIteration;
                    self.data.failFast = data.failFast;
                    self.data.preconditionScript = data.preconditionScript;

                    var componentProcessProperties = {};
                    array.forEach(self.extraPropertyNames, function(propertyName) {
                        var realPropertyName = propertyName.substring(2);
                        componentProcessProperties[realPropertyName] = data[propertyName];
                    });

                    self.data.children = [{
                        "id": inventoryVersionDiffId,
                        "name": util.randomString(30),
                        "type": "inventoryVersionDiff",
                        "componentName": self.data.component.name,
                        "status": data.status,
                        "children": [{
                            "id": componentProcessId,
                            "name": data.name,
                            "type": "componentProcess",
                            "componentName": self.data.component.name,
                            "componentProcessName": data.componentProcessName,
                            "allowFailure": data.allowFailure,
                            "properties": componentProcessProperties
                        }]
                    }];

                    self.updateLabel();

                    propertyDialog.hide();
                    propertyForm.destroy();
                    propertyDialog.destroy();
                },
                readOnly: self.readOnly
            });

            propertyForm.addField({
                name: "name",
                label: i18n("Name"),
                type: "Text",
                required: true,
                value: childChildData.name
            });

            // -- Component
            var componentSelectField = propertyForm.addField({
                name: "component",
                label: i18n("Component"),
                required: true,
                autoSelectFirst: true,
                type: "ApplicationComponentSelect",
                applicationId: self.graphEditor.application.id,
                value: !self.data.component ? undefined : self.data.component.id,
                disabled: self.readOnly,
                onSetItem: function(value, item) {
                    self.showFieldsForComponent(propertyForm, item);
                }
            });
            componentSelect = componentSelectField.widget;

            // -- Resource tag
            propertyForm.addField({
                name: "tagId",
                label: i18n("Limit to Resource Tag"),
                type: "TagDropDown",
                objectType: "Resource",
                value: self.data.tagId,
                readOnly: self.readOnly
            });
            propertyForm.addField({
                name: "maxIteration",
                label: i18n("Max # of concurrent jobs."),
                type: "Text",
                textDir: "ltr",
                required: true,
                value: self.data.maxIteration || -1 ,
                description: i18n("The max number of concurrent component processes to run at any time. Use -1 for unlimited.")
            });
            
            propertyForm.addField({
                name: "failFast",
                label: i18n("Fail Fast"),
                type: "Checkbox",
                description: i18n("When this is checked, this step will not start any more component processes if one fails."),
                value: self.data.failFast
            });

            propertyForm.addField({
                name: "runOnlyOnFirst",
                label: i18n("Run on First Online Resource Only"),
                type: "Checkbox",
                description: i18n("When this is checked, this step will only use one resource. It will not run on all resources."),
                value: self.data.runOnlyOnFirst
            });

            propertyForm.addField({
                name: "preconditionScript",
                label: i18n("Precondition"),
                type: "PropertyArea",
                description: i18n("A script to determine whether this step should run. Must evaluate to true or false if not left blank."),
                value: self.data.preconditionScript,
                cache: self.graphEditor.cache
            });

            propertyForm.placeAt(propertyDialog.containerNode);
            propertyDialog.show();
        },

        showFieldsForComponent: function(propertyForm, component) {
            var self = this;

            propertyForm.removeField("status");
            propertyForm.removeField("componentProcessName");
            propertyForm.removeField("allowFailure");

            if (component) {
                var childData = this.getChildData();
                var childChildData = this.getChildChildData();

                var existingName = propertyForm.getValue("name");
                if (!existingName || (this.selectedComponent &&
                                existingName === i18n("Install %s", this.selectedComponent.name))) {
                    propertyForm.setValue("name", i18n("Install %s", component.name));
                }
                this.selectedComponent = component;

                var statusSelect = new RestSelect({
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
                    value: childData.status,
                    allowNone: false
                });

                propertyForm.addField({
                    name: "status",
                    label: i18n("Use Versions Without Status"),
                    required: true,
                    widget: statusSelect
                }, "tagId");

                array.forEach(this.extraPropertyNames, function(name) {
                    self.removePropertyField(propertyForm, name);
                });
                this.extraPropertyNames = [];

                var initialComponentProcess;
                if (!!self.data.component && (self.data.component.id === component.id)) {
                    initialComponentProcess = childChildData.componentProcessName;
                }

                var componentProcessSelect = new RestSelect({
                    restUrl: bootstrap.restUrl+"deploy/component/"+component.id+"/fullProcesses/false",
                    getLabel: function(item) {
                        var result = item.name;
                        if (item.componentTemplate) {
                            result += i18n(" (Template)");
                        }
                        return result;
                    },
                    getValue: function(item) {
                        return item.name;
                    },
                    onChange: function(value, item) {
                        array.forEach(self.extraPropertyNames, function(name) {
                            self.removePropertyField(propertyForm, name);
                        });
                        self.extraPropertyNames = [];

                        if (item) {
                            // Add all properties which are set to take a value at runtime.
                            array.forEach(item.unfilledProperties, function(unfilledProperty) {
                                var propertyName = "p_"+unfilledProperty.name;
                                var propValue = unfilledProperty.value;
                                var configModeOn = false;

                                if (childChildData.properties && childChildData.properties[unfilledProperty.name]) {
                                    propValue = childChildData.properties[unfilledProperty.name];
                                    configModeOn = true;
                                }

                                /*
                                 * The variable propertyFieldData needs to contain all of the relevant information for
                                 * an unfilledProperty and some properties require different information (eg. HttpProperties
                                 * require 6 additional values). So lang.clone was used to ensure that all required values are
                                 * put into propertyFieldData. The clone function is safe here because unfilledProperty is a flat
                                 * object containing only property values and therefore clone will not explode. 
                                 */
                                var propertyFieldData = lang.clone(unfilledProperty);
                                propertyFieldData.name = propertyName;
                                propertyFieldData.value = propValue;
                                if (unfilledProperty.description) {
                                    propertyFieldData.description = unfilledProperty.description.escape();
                                }

                                self.extraPropertyNames.push(propertyName);
                                self.addPropertyField(propertyForm, propertyFieldData, configModeOn, "allowFailure");
                            });
                        }
                    },
                    allowNone: false,
                    value: initialComponentProcess,
                    disabled: self.readOnly
                });
                propertyForm.addField({
                    name: "componentProcessName",
                    label: i18n("Component Process"),
                    required: true,
                    description: i18n("The process to run."),
                    widget: componentProcessSelect
                }, "tagId");
    
                if (config.data.systemConfiguration.enableAllowFailure || childChildData.allowFailure) {
                    propertyForm.addField({
                        name: "allowFailure",
                        label: i18n("Ignore Failure"),
                        description: i18n("When checked, this step will always be considered successful."),
                        type: "Checkbox",
                        value: childChildData.allowFailure
                    }, "tagId");
                }
            }
        }
    });
});
