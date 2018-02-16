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
    return declare('deploy.widgets.workflow.activity.FinishActivity',  [BaseActivity], {
        postCreate: function() {
            this.inherited(arguments);
            
            if (!this.initialized) {
                this.data.name = util.randomString(30);
                this.initialized = true;
            }
        },

        getLabel: function() {
            return i18n("Finish");
        },
        
        getStyle: function() {
            return "utilityStyle";
        },
        
        canEdit: function() {
            return false;
        },
        
        canDelete: function() {
            return true;
        },

        canCopy: function() {
            return false;
        }
    });
});