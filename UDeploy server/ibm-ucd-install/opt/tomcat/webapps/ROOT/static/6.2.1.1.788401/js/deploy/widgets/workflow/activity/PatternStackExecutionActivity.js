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
        "deploy/widgets/workflow/activity/BaseActivity"
        ],
function(
        declare,
        BaseActivity
) {
    return declare('deploy.widgets.workflow.activity.PatternResourceActivity',  [BaseActivity], {
        postCreate: function() {
            this.inherited(arguments);
        },

        getLabel: function() {
            if (this.data.resourceType === "configurationResourceGroup"
                    || this.data.resourceType === "serverResourceGroup"
                        || this.data.resourceType === "server"){
                return this.data.name;
            }
            return this.data.name + "\n[" + this.data.resourceType + "]";
        },

        canEdit: function() {
            return false;
        }
    });
});