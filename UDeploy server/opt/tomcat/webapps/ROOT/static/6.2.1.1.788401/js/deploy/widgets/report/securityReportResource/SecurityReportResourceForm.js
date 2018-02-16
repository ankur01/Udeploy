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
        "dojo/_base/declare"
        ],
function(
        _TemplatedMixin,
        _Widget,
        declare
) {
    /**
     *
     */
    return declare('deploy.widgets.report.securityReportResource.SecurityReportResourceForm',  [_Widget, _TemplatedMixin], {
        templateString: '<div></div>',
        constructor: function() {
            var t = this;
        },

        buildRendering: function() {
            this.inherited(arguments);

            var t = this;

        },

        destroy: function() {
            var t = this;
            this.inherited(arguments);
        },

        setProperties: function(/* Array*/ properties) {
            var t = this;
        },

        getProperties: function() {
            var t = this;
            return [];
        }
    });
});