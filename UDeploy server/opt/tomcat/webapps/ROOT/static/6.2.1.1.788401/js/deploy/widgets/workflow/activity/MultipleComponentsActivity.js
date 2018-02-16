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
        "dojo/store/Memory",
        "dojo/on",
        "deploy/widgets/workflow/activity/BaseActivity",
        "js/webext/widgets/RestSelect",
        "deploy/widgets/property/PropertyTextareaBox"
        ],
function(
        array,
        declare,
        xhr,
        Memory,
        on,
        BaseActivity,
        RestSelect,
        PropertyTextareaBox
) {
    return declare('deploy.widgets.workflow.activity.MultipleComponentsActivity',  [BaseActivity], {

        disableStatusSelect : false,

        /**
         *
         */
        postCreate: function() {
            this.inherited(arguments);

            if (!this.initialized) {
                this.data.name = util.randomString(30);
                this.editProperties();
            }
        },

        /**
         * Show the edit properties dialog for this step.
         */
        editProperties: function(callback) {
            var self = this;

            var childData = this.getChildData();
            var childChildData = this.getChildChildData();
            var childChildChildData;
            if (childChildData && childChildData.children) {
                childChildChildData = childChildData.children[0];
            }

            var tagSelect;

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

                    self.data = self.getSelfData();

                    self.data.componentTagId = data.componentTagId;

                    /* Resource Tagging */
                    if (data.resourceTagId && data.resourceTagId !== "") {
                        self.data.resourceTagId = data.resourceTagId;
                    }
                    else if (self.data.resourceTagId) {
                        self.data.resourceTagId = undefined;
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

                    self.data.componentProcessName = data.componentProcessName;

                    self.data.children = self.getSelfChildData(data, componentProcessProperties);

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
                value: !!childChildChildData ? childChildChildData.name : ""
            });

            // -- Component Tag
            var compTagValue = self.data.componentTagId;
            if (self.data.componentTag) {
                compTagValue = self.data.componentTag.id;
            }

            propertyForm.addField({
                name: "componentTagId",
                label: i18n("Component Tag"),
                type: "TagDropDown",
                objectType: "Component",
                value: compTagValue,
                readOnly: self.readOnly,
                noneLabel: i18n("All Components"),
                onChange: function(item) {
                    self.showFieldsForComponent(propertyForm, this.get("value"));
                }
            });

            // -- Resource Tag
            propertyForm.addField({
                name: "tagId",
                label: i18n("Limit to Resource Tag"),
                type: "TagDropDown",
                objectType: "Resource",
                value: childData.tagId,
                readOnly: self.readOnly
            });

            if (!self.disableStatusSelect) {
                var statusSelect = new RestSelect({
                    restUrl: bootstrap.restUrl+"deploy/status/inventoryStatuses",
                    getLabel: function(item) {
                        return item.name.escape();
                    },
                    getValue: function(item) {
                        return item.name;
                    },
                    getStyle: function(item) {
                        var result = {
                            backgroundColor: item.color
                        };
                        return result;
                    },
                    value: childChildData.status,
                    allowNone: false
                });

                propertyForm.addField({
                    name: "status",
                    label: self.statusLabel,
                    required: true,
                    widget: statusSelect
                });
            }

            propertyForm.addField({
                name: "maxIteration",
                label: i18n("Max. # of Concurrent Jobs."),
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

            // Uninstall and Rollback require an extra field
            var insertField = "_typeSelectionInsert";
            propertyForm.addField({
                name: "_typeSelectionInsert",
                type: "hidden"
            });
            self.addExtraFields(propertyForm, insertField, childChildData);

            self.showFieldsForComponent(propertyForm, compTagValue);

            propertyForm.placeAt(propertyDialog.containerNode);
            propertyDialog.show();
        },

        /**
         * Show the component fields and any extra property fields for components if this is
         * in an applicationProcess with an application as the parent.
         */
        showFieldsForComponent: function(propertyForm, componentTag) {
            var self = this;

            var childData = this.getChildData();
            var childChildData = this.getChildChildData();

            array.forEach(this.extraPropertyNames, function(name) {
                self.removePropertyField(propertyForm, name);
            });
            this.extraPropertyNames = [];

            var selectedProcess;
            if (self.data.children) {
                selectedProcess = self.data.children[0].children[0].children[0].componentProcessName;   //FIXME
            }

            if (!propertyForm.hasField("componentProcessName")) {
                propertyForm.addField({
                    name: "componentProcessName",
                    label: i18n("Component Process"),
                    type: "Text",
                    value: selectedProcess,
                    required: true,
                    description: i18n("The precise name of the process to run.")
                }, "tagId");

                if (config.data.systemConfiguration.enableAllowFailure || childChildData.allowFailure) {
                    propertyForm.addField({
                        name: "allowFailure",
                        label: i18n("Ignore Failure"),
                        description: i18n("When checked, this step will always be considered successful."),
                        type: "Checkbox",
                        value: childChildData.allowFailure
                    }, "resourceTagId");
                }
            }
        },

        /**
         * Get the top level data for the object.
         */
        getSelfData: function() {
            var self = this;
            return {
                       "name": self.data.name,
                       "type": "multiComponentEnvironmentIterator"
                   };
        },

        /**
         * Function for adding any extra fields for subclasses of this widget.
         * By default no extra fields should be added.
         */
        addExtraFields: function(form, insertLocation, data) {
            // No-op by default
        }
    });
});
