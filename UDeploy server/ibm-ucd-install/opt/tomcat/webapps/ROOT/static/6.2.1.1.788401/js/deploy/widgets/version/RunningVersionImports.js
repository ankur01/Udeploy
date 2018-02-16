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
        "dijit/_TemplatedMixin",
        "dijit/_Widget",
        "dojo/_base/declare",
        "deploy/widgets/component/ComponentSourceConfigHistory"
        ],
function(
        _TemplatedMixin,
        _Widget,
        declare,
        ComponentSourceConfigHistory
) {
    /**
     *
     */
    return declare('deploy.widgets.version.RunningVersionImports',  [_Widget, _TemplatedMixin], {
        templateString:
            '<div class="runningVerisonImports">'+
            '    <div data-dojo-attach-point="runningIntegrationAttach"></div>' +
            '</div>',

        /**
         *
         */
        postCreate: function() {
            this.showRunningIntegrations();
        },

        /**
         *
         */
        showRunningIntegrations: function() {
            this.compSourceHistory = ComponentSourceConfigHistory({
                gridRestUrl: bootstrap.restUrl+"sourceConfigExecutionRecord/table/all",
                tableConfigKey: "allRunningSourceConfigs",
                showComponentField: true,
                oldestFirst: true
            });
            this.compSourceHistory.placeAt(this.runningIntegrationAttach);
        }
    });
});
