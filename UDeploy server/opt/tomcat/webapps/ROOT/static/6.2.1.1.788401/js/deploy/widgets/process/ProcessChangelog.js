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
        "js/webext/widgets/Table"
        ],
function(
        _TemplatedMixin,
        _Widget,
        declare,
        Table
) {
    /**
     *
     */
    return declare('deploy.widgets.process.ProcessChangelog',  [_Widget, _TemplatedMixin], {
        templateString: 
            '<div class="processChangelog">' +
                '<div data-dojo-attach-point="gridAttach"></div>' +
            '</div>',

        /**
         *
         */
        postCreate: function() {
            this.inherited(arguments);
            var self = this;
            
            var gridRestUrl = bootstrap.restUrl+"process/"+this.process.id+"/changelog";
            var gridLayout = [{
                name: i18n("Version"),
                field: "version",
                orderField: "version",
                getRawValue: function(item) {
                    return item.version;
                }
            },{
                name: i18n("User"),
                field: "committer",
                orderField: "committer",
                filterField: "committer",
                filterType: "text",
                getRawValue: function(item) {
                    return item.committer;
                }
            },{
                name: i18n("Date"),
                field: "commitTime",
                formatter: util.tableDateFormatter,
                orderField: "date",
                getRawValue: function(item) {
                    return new Date(item.commitTime);
                }
            },{
                name: i18n("Comment"),
                field: "comment"
            }];

            this.grid = new Table({
                url: gridRestUrl,
                serverSideProcessing: false,
                orderField: "version",
                sortType: "desc",
                columns: gridLayout
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