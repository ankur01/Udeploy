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
        "js/webext/widgets/table/TreeTable"
        ],
function(
        _TemplatedMixin,
        _Widget,
        declare,
        TreeTable
) {
    return declare('deploy.widgets.settings.Patches',  [_Widget, _TemplatedMixin], {
        templateString:
            '<div class="logging">'+
            '  <div data-dojo-attach-point="gridAttach"></div>'+
            '</div>',

        /**
         *
         */
        postCreate: function() {
            this.inherited(arguments);
            var self = this;

            this.existingValues = {};
            if (this.version) {
                this.existingValues = this.version;
            }

            var gridLayout = [{
               name: i18n("Name"),
               field: "name"
            },{
               name: i18n("Last Modified"),
               field: "time",
               formatter: util.tableDateFormatter
            }];
            this.grid = new TreeTable({
                url: bootstrap.restUrl+"system/configuration/patches",
                serverSideProcessing: false,
                noDataMessage: i18n("No patches have been installed on your server"),
                tableConfigKey: "patches",
                hidePagination:true,
                columns: gridLayout
            });

            this.grid.placeAt(this.gridAttach);
        }
    });
});