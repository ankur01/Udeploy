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
        "dojo/_base/xhr",
        "dojo/on",
        "deploy/widgets/workflow/activity/BaseActivity",
        "js/webext/widgets/RestSelect",
        "js/webext/widgets/Alert",
        "deploy/widgets/property/PropertyTextareaBox"
        ],
function(
        array,
        declare,
        xhr,
        on,
        BaseActivity,
        RestSelect,
        Alert,
        PropertyArea
) {
    return declare('deploy.widgets.workflow.activity.RunProcessActivity',  [BaseActivity], {
        postCreate: function() {
            this.inherited(arguments);

            if (!this.initialized) {
                this.editProperties();
            }
        },

        getLabel: function() {
            var result = "";

            if (!this.initialized) {
                result += i18n("Run Another Process");
            }
            else {
                if (this.data.processName) {
                    result += this.data.name+"\n"+i18n("Run \"%s\"", this.data.processName);
                }
                else {
                    result += this.data.name+"\n("+i18n("Process Deleted")+")";
                }
            }

            return result;
        },

        /**
         *
         */
        editProperties: function(callback) {
            var self = this;

            self.extraPropertyNames = [];
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

                    self.data.name = data.name;
                    self.data.processName = data.processName;
                    self.data.resourcePath = data.resourcePath;
                    self.data.properties = {};

                    array.forEach(self.extraPropertyNames, function(propertyName) {
                        var realPropertyName = propertyName.substring(2);
                        self.data.properties[realPropertyName] = data[propertyName];
                    });

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
                value: self.data.name
            });

            var processSelect = new RestSelect({
                restUrl: bootstrap.restUrl+"process",
                getValue: function(item) {
                    return item.name;
                },
                autoSelectFirst: false,
                onChange: function(value, item) {
                    array.forEach(self.extraPropertyNames, function(name) {
                        propertyForm.removeField(name);
                    });
                    self.extraPropertyNames = [];
                    
                    if (value) {
                        if (self.graphEditor.process && value===self.graphEditor.process.name) {
                            var recursiveAlert = new Alert({
                                message: i18n("This will call the current process and risk the creation of an" +
                                              " infinite loop. Are you sure you want this process to run itself?")
                            });
                        }
                        
                        xhr.get({
                            url: bootstrap.restUrl+"process/"+item.id+"/-1",
                            handleAs: "json",
                            load: function(data) {
                                self.showProcessFields(propertyForm, data);
                            }
                        });
                    }
                },
                allowNone: false,
                value: self.data.processName,
                disabled: self.readOnly
            });
            propertyForm.addField({
                name: "processName",
                label: i18n("Process"),
                required: true,
                description: i18n("The process to run."),
                widget: processSelect
            });

            var resName = self.data.resourcePath || "";
            if (!this.initialized) {
                resName = "${p:resource.path}";
            }

            propertyForm.addField({
                name: "resourcePath",
                label: i18n("Resource Path"),
                type: "PropertyBox",
                required: false,
                description: i18n("The path to the resource to execute this process on. Leave " +
                                  "this blank to use the process's default resource."),
                value: resName,
                cache: self.graphEditor.cache
            });

            propertyForm.placeAt(propertyDialog.containerNode);
            propertyDialog.show();
        },

        /**
         *
         */
        showProcessFields: function(form, process) {
            var self = this;

            array.forEach(process.propDefs, function(propDef) {
                var existingValue = null;
                if (self.data.properties) {
                    existingValue = self.data.properties[propDef.name];
                }

                if (existingValue) {
                    propDef.value = existingValue;
                }

                if (propDef.type && propDef.type.toLowerCase() === "text") {
                    propDef.type = "PropertyBox";
                }
                else if (propDef.type && propDef.type.toLowerCase() === "text area") {
                    propDef.type = "PropertyArea";
                }
                propDef.cache = self.graphEditor.cache;
                propDef.name = "p_"+propDef.name;
                form.addField(propDef);
                self.extraPropertyNames.push(propDef.name);
            });
        }
    });
});