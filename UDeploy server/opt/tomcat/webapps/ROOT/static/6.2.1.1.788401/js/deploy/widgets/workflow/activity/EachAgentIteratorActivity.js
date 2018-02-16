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
        "dojo/on",
        "deploy/widgets/workflow/activity/BaseActivity"
        ],
function(
        array,
        declare,
        on,
        BaseActivity
) {
    return declare([BaseActivity], {
        postCreate: function() {
            this.inherited(arguments);
            this.isContainer = true;
            
            if (!this.initialized) {
                this.data.name = util.randomString(30);
                
                this.initialized = true;
            }
        },

        getLabel: function() {
            return i18n("For Every Agent...");
        },
        
        getStyle: function() {
            return "parallelStyle";
        },
        
        canEdit: function() {
            return false;
        },
        
        canDelete: function() {
            return true;
        },

        canCopy: function() {
            //can't support copying for this step yet
            return false;
        }
    });
});