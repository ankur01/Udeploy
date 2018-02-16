/*global define, require */

define([
        "dojo/_base/declare",
        "deploy/widgets/workflow/activity/MultipleComponentsActivity"
        ],
function(
        declare,
        MultipleComponentsActivity
) {
    return declare('deploy.widgets.workflow.activity.RunOperationalProcessMultipleActivity',
            [MultipleComponentsActivity], {

        disableStatusSelect : true,

        /**
         * Get the label to be shown by the UI.
         */
        getLabel: function() {
            var result = "";

            if (!this.initialized) {
                result += i18n("Run Operational Process for Multiple Components");
            }
            else {
                var childChildData = this.getChildChildData();
                var childChildChildData;
                if (childChildData && childChildData.children) {
                    childChildChildData = childChildData.children[0];
                }

                result += childChildChildData.name + "\n" +
                    i18n("Run Operational Process for Multiple Components");
            }

            return result;
        },

        showComponentTagSelection: function(show, form, data) {
            var self = this;

            if (form.hasField("monitorTag")) {
                form.removeField("monitorTag");
                form.removeField("resourceSelectionMode");
            }

            if (show) {
                form.addField({
                    name: "monitorTag",
                    label: i18n("Limit Monitoring to Components with This Tag"),
                    description: i18n("If you select a tag, this step runs only if another " +
                        "step in the application process changes the inventory of components " +
                        "that contain the tag. If you do not select a tag, this step runs if " +
                        "another step in the application process changes the inventory " +
                        "of any component."),
                    multi: true,
                    type: "TagDropDown",
                    objectType : "Component",
                    value: data.monitorTag
                });

                form.addField({
                    name: "resourceSelectionMode",
                    label: i18n("Resources to Run On"),
                    type: "Radio",
                    allowedValues: [{
                        label: i18n("Run this step only on resources where component inventory changes"),
                        value: "ONLY_WHERE_COMPONENTS_CHANGED"
                    },{
                        label: i18n("Run this step on all possible resources"),
                        value: "ALL_MAPPED_RESOURCES"
                    }],
                    value: data.resourceSelectionMode || "ONLY_WHERE_COMPONENTS_CHANGED"
                });

            }
        },

        addExtraFields: function(form, insertLocation, data) {
            var self = this;
            // The data passed in by default is the childChildData. We want the childData.
            var childData = this.getChildData();
            var ifComponentTagChanges = (!!childData &&
                    childData.type === "changedResourceIterator");
            form.addField({
                name: "ifComponentTagChanges",
                label: i18n("Run Only If Component Inventory Changes"),
                type: "Checkbox",
                description: i18n("Select this option to run the component process only if " +
                        "inventory was changed elsewhere in the application process. You may limit " +
                        "inventory-change monitoring to components with a specific tag."),
                value: ifComponentTagChanges,
                onChange: function(value) {
                    self.showComponentTagSelection(value, form, childData);
                }
            });
            this.showComponentTagSelection(ifComponentTagChanges, form, childData);
        },

        /**
         * Get the child data for the runMultipleOperationalProcessesActivity object.
         */
        getSelfChildData: function(data, componentProcessProperties) {
            var type;
            if (data.ifComponentTagChanges === "true") {
                type = "changedResourceIterator";
            }
            else {
                type = "componentEnvironmentIterator";
            }
            return [{
                   "name": util.randomString(30),
                   "type": type,
                   "tagId": data.tagId,
                   "runOnlyOnFirst": data.runOnlyOnFirst,
                   "resourceSelectionMode": data.resourceSelectionMode,
                   "monitorTag": data.monitorTag,
                   "children": [{
                                    "name": util.randomString(30),
                                    "type": "operationalProcessFilter",
                                    "status": data.status,
                                    "children": [{
                                                    "name": data.name,
                                                    "type": "componentProcess",
                                                    "componentProcessName": data.componentProcessName,
                                                    "allowFailure": data.allowFailure,
                                                    "properties": componentProcessProperties
                                                }]
                               }]
                    }];
        }
    });
});
