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
        "dojo/_base/xhr",
        "dojo/_base/declare",
        "dojo/on",
        "deploy/widgets/workflow/activity/BaseActivity",
        "deploy/widgets/property/PropDefs",
        "js/webext/widgets/RestSelect",
        "./TaskApprovalSelector"
        ],
function(
        array,
        xhr,
        declare,
        on,
        BaseActivity,
        PropDefs,
        RestSelect,
        TaskApprovalSelector
) {
    return declare('deploy.widgets.workflow.activity.ApplicationManualTaskActivity',  [BaseActivity], {
        postCreate: function() {
            var self = this;
            this.inherited(arguments);

            config.data.extraFormDelegates.push({
                name: "TaskApprovalSelector",
                delegateFunction: function(entry) {
                    var preloading = false;
                    if (entry.selector !== null) {
                        entry.form.initialized = true;
                        preloading = true;
                    }
                    var taskSelect = new TaskApprovalSelector({
                        noneLabel: entry.noneLabel,
                        name: entry.name,
                        addRow: self.addRow,
                        form: entry.form,
                        number: entry.number,
                        restUrl: entry.restUrl,
                        preloading: preloading,
                        selector: entry.selector,
                        approvalType: entry.approvalType
                    });

                    return taskSelect;
                }
            });

            if (!this.initialized) {
                this.editProperties();
            }
        },

        getLabel: function() {
            var result = i18n("Manual Task");
            if (this.initialized) {
                result += "\n" + this.data.name;
            }

            return result;
        },

        /**
         *
         */
        editProperties: function(callback) {
            var self = this;

            self.selectors = [];
            if (self.data.roleRestrictionData) {
                array.forEach(self.data.roleRestrictionData.roleRestrictions, function(entry) {
                    self.selectors.push(entry);
                });
                self.approvalType = self.data.roleRestrictionData.contextType;
            }
            else {
                self.data.roleRestrictionData = {"roleRestrictions": []};
            }

            if (!self.approvalType) {
                    self.approvalType = "ANY";
            }

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
                    self.data.templateName = data.templateName;
                    self.updateLabel();

                    self.data.taskDefinitionId = data.taskDefinitionId;

                    self.data.roleRestrictionData.roleRestrictions = [];
                    array.forEach(self.form.selectors, function(selector) {
                        if (selector.roleId) {
                            self.data.roleRestrictionData.roleRestrictions.push(selector);
                        }
                    });
                    self.selectors = self.data.roleRestrictionData.roleRestrictions;
                    self.data.roleRestrictionData.contextType = data.approvalType;
                    if (self.data.roleRestrictionData.contextType === "ANY") {
                        self.data.roleRestrictionData.contextType = null;
                    }
                    self.approvalType = self.data.roleRestrictionData.contextType;

                    self.data.propDefs = data.propDefs;
                    array.forEach(self.data.propDefs, function(propDef) {
                        propDef.resolveHttpValuesUrl = "rest/process/" + appState.applicationProcess.id + "/" + data.name + "/propDefs/resolveHttpValues/" + propDef.name;
                    });

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

            var notificationTemplateSelect = new RestSelect({
                restUrl: bootstrap.restUrl+"notification/notificationEntry/templateNames",
                getLabel: function(item) {
                    return i18n(item);
                },
                getValue: function(item) {
                    return item;
                },
                allowNone: false,
                value: self.data.templateName || "TaskCreated",
                disabled: self.readOnly
            });
            propertyForm.addField({
                name: "templateName",
                label: i18n("Notification Template"),
                required: true,
                widget: notificationTemplateSelect
            });

            var propDefs = new PropDefs({
                propDefs: self.data.propDefs || [],
                propSheetDef: {resolveHttpValuesUrl: "rest/process/" + appState.applicationProcess.id + "/" + self.data.name + "/propDefs/resolveHttpValues"}
            });
            propertyForm.addField({
                widget: propDefs,
                label: i18n("Properties"),
                name: "propDefs"
            });

            propertyForm.addField({
                name: "approvalType",
                label: i18n("Who can approve this task"),
                type: "Select",
                value: self.approvalType,
                allowedValues: [{"label":i18n("Any User"), "value":"ANY"},
                                {"label":i18n("Role Member By Environment"), "value":"ENVIRONMENT"},
                                {"label":i18n("Role Member By Application"), "value":"APPLICATION"}],
                onChange: function(choice) {
                    self.populateForm(choice);
                }
            });

            self.form = propertyForm;
            self.form.selectors = self.selectors;

            self.populateForm(self.approvalType);

            propertyForm.placeAt(propertyDialog.containerNode);
            propertyDialog.show();
        },

        populateForm: function(value) {
            var self = this;
            self.removeAllSelectors();
            if (self.approvalType === value) {
                self.form.selectors = self.selectors;
            }
            if (value !== "ANY") {
                if (value === "ENVIRONMENT") {
                    self.addSelectorData("/security/resourceType/Environment/resourceRoles", i18n("Environment"));
                }
                else if (value === "APPLICATION") {
                    self.addSelectorData("/security/resourceType/Application/resourceRoles", i18n("Application"));
                }

            }
        },

        /**
         *
         */
        addRow: function(form, number, selector, restUrl, type) {
            form.addField({
                name: "selector",
                label: "",
                type: "TaskApprovalSelector",
                form: form,
                number: number,
                selector: selector,
                restUrl: restUrl,
                approvalType: type
            });
        },

        /**
         *
         */
        removeAllSelectors: function() {
            var self = this;
            while (self.form.hasField("selector") ){
                self.form.removeField("selector");
            }
            self.form.selectors = [];
        },

        /**
         *
         */
        addSelectorData: function(restUrl, type) {
            var self = this;
            var index = 0;

            array.forEach(self.form.selectors, function(selector) {
                self.addRow(self.form, index, selector, restUrl, type);
                index++;
            });
            self.addRow(self.form, index, null, restUrl, type);
        }
    });
});
