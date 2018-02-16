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
        "deploy/widgets/Formatters",
        "js/webext/widgets/Table"
        ],
function(
        _TemplatedMixin,
        _Widget,
        declare,
        Formatters,
        Table
) {
    return declare('deploy.widgets.component.ComponentResources',  [_Widget, _TemplatedMixin], {
        templateString: 
            '<div class="componentResources">' + 
                '<div data-dojo-attach-point="gridAttach"></div>' +
            '</div>',

        /**
         * 
         */
        postCreate: function() {
            this.inherited(arguments);

            var gridLayout = [{
                name: i18n("Resource"),
                formatter: function(item) {
                    return Formatters.resourcePathFormatter(item.resource);
                }
            },{
                name: i18n("Version"),
                formatter: function(item) {
                    return Formatters.versionLinkFormatter(item.version);
                }
            },{
                name: i18n("Date"),
                field: "date",
                formatter: util.tableDateFormatter,
                orderField: "dateCreated"
            },{
                name: i18n("Status"),
                formatter: function(item, value, cell) {
                    return Formatters.statusFormatter(item.status, value, cell);
                }
            },{
                name: i18n("Actions")
            }];

            var gridRestUrl = bootstrap.restUrl+"inventory/resourceInventory/table";
            this.grid = new Table({
                url: gridRestUrl,
                columns: gridLayout,
                baseFilters: [{
                    name: "componentId",
                    type: "eq",
                    values: [this.componentId]
                },
                {
                    name: "ghostedDate",
                    className: "Long",
                    type: "eq",
                    values: [0]
                }],
                orderField: "dateCreated",
                sortType: "desc",
                tableConfigKey: "componentResources"+appState.component.id,
                noDataMessage: i18n("This component has not been installed to any resources.")
            });
            this.grid.placeAt(this.gridAttach);
        },

        /**
         * 
         */
        destroy: function() {
            this.inherited(arguments);
            this.grid.destroy();
        }
    });
});