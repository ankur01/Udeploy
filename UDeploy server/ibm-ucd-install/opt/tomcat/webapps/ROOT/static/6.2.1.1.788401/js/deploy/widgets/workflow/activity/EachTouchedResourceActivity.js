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
        "js/webext/widgets/DialogMultiSelect",
        "js/webext/widgets/RestSelect",
        "deploy/widgets/property/PropertyTextareaBox"
        ],
function(
        array,
        declare,
        xhr,
        on,
        BaseActivity,
        DialogMultiSelect,
        RestSelect,
        PropertyArea
) {
    return declare('deploy.widgets.workflow.activity.EachTouchedResourceActivity',  [BaseActivity], {
        postCreate: function() {
            this.inherited(arguments);

            if (!this.initialized) {
                this.data.name = util.randomString(30);
                this.editProperties();
            }
        },

        getLabel: function() {
            var result = "";

            if (this.initialized) {
                var childData = this.getChildData();
                if (childData) {
                    result += childData.name+"\n";
                }
            }
            result += i18n("Run Generic Process For Each Affected Resource");

            return result;
        },

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

                propDef.name = "p_"+propDef.name;
                form.addField(propDef);
                self.extraPropertyNames.push(propDef.name);
            });
        },

        /**
         *
         */
        editProperties: function(callback) {
            var self = this;

            var childData = this.getChildData();

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

                    self.data.name = util.randomString(30);
                    self.data.type = "touchedResourceIterator";

                    self.data.maxIteration = data.maxIteration;
                    self.data.failFast = data.failFast;
                    self.data.preconditionScript = data.preconditionScript;

                    self.data.children = [{
                        "name": data.name,
                        "type": "runProcess",
                        "processName": data.processName,
                        "allowFailure": data.allowFailure
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
                value: childData.name
            });

            var processSelect = new RestSelect({
                restUrl: bootstrap.restUrl+"process",
                getValue: function(item) {
                    return item.name;
                },
                onChange: function(value, item) {
                    array.forEach(self.extraPropertyNames, function(name) {
                        propertyForm.removeField(name);
                    });
                    self.extraPropertyNames = [];

                    // When no generic processes, item is null
                    if (!!item) {
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
                value: childData.processName,
                disabled: self.readOnly
            });
            propertyForm.addField({
                name: "processName",
                label: i18n("Process"),
                required: true,
                description: i18n("The process to run."),
                widget: processSelect
            });

            if (config.data.systemConfiguration.enableAllowFailure || childData.allowFailure) {
                propertyForm.addField({
                    name: "allowFailure",
                    label: i18n("Ignore Failure"),
                    description: i18n("When checked, this step will always be considered successful."),
                    type: "Checkbox",
                    value: childData.allowFailure
                }, "tagId");
            }

            propertyForm.addField({
                name: "maxIteration",
                label: i18n("Max # of concurrent jobs."),
                type: "Text",
                required: true,
                textDir: "ltr",
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
                name: "preconditionScript",
                label: i18n("Precondition"),
                type: "PropertyArea",
                description: i18n("A script to determine whether this step should run. Must evaluate to true or false if not left blank."),
                value: self.data.preconditionScript,
                cache: self.graphEditor.cache
            });

            propertyForm.placeAt(propertyDialog.containerNode);
            propertyDialog.show();
        }
    });
});
