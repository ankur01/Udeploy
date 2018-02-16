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
        "dojo/_base/declare",
        "deploy/widgets/workflow/activity/MultipleComponentsActivity"
        ],
function(
        declare,
        MultipleComponentsActivity
) {
    return declare('deploy.widgets.workflow.activity.RollbackMultipleComponentsActivity',  [MultipleComponentsActivity], {

        statusLabel: i18n("Remove Versions With Status"),

        /**
         * Get the label to be shown by the UI.
         */
        getLabel: function() {
            var result = "";

            if (!this.initialized) {
                result += i18n("Rollback Multiple Components");
            }
            else {
                var childChildData = this.getChildChildData();
                var childChildChildData;
                if (childChildData && childChildData.children) {
                    childChildChildData = childChildData.children[0];
                }

                result += childChildChildData.name+"\n"+i18n("Rollback Multiple Components");
            }

            return result;
        },

        /**
         * Get the child data for the installMultipleComponentActivity object.
         */
        getSelfChildData: function(data, componentProcessProperties) {
            return [{
                       "name": util.randomString(30),
                       "type": "componentEnvironmentIterator",
                       "tagId": data.tagId,
                       "runOnlyOnFirst": data.runOnlyOnFirst,
                       "children": [
                       {
                           "name": util.randomString(30),
                           "type": "uninstallVersionDiff",
                           "selectionType": data.selectionType,
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
        },

        /**
         * Add any fields not common to all multiple component activities.
         */
        addExtraFields: function(form, insertLocation, data) {
            form.addField({
                name: "selectionType",
                label: i18n("Rollback Type"),
                type: "Select",
                required: true,
                value: data.selectionType,
                allowedValues: [{
                    label: i18n("Remove Undesired Incremental Versions"),
                    value: "UNDESIRED"
                },{
                    label: i18n("Replace with Last Deployed"),
                    value: "LAST_DEPLOYED"
                }]
            }, insertLocation);
        },

        getStatusLabel: function() {
            return i18n("Remove Versions With Status");
        }
    });
});
