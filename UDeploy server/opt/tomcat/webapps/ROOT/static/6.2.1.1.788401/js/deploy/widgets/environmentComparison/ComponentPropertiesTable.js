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
    return declare('deploy.widgets.environmentComparison.ComponentPropertiesTable',  [_Widget, _TemplatedMixin], {
        templateString:
            '<div>'+
              '<div class="containerLabel" data-dojo-attach-point="labelAttach"></div>'+
              '<div class="innerContainer">'+
                '<div data-dojo-attach-point="gridAttach"></div>'+
              '</div>'+
            '</div>',

        /**
         * 
         */
        postCreate: function() {
            this.inherited(arguments);
            
            this.labelAttach.innerHTML = i18n("Active Property Report for %s", this.component.name.escape());
            
            var gridLayout = [{
                name: i18n("Name"),
                field: "name"
            },{
                name: this.environment1.name,
                field: "environment1Value",
                formatter: function(item, value) {
                    var result = i18n("Not deployed");
                    if (value) {
                        result = value;
                    }
                    return result;
                }
            },{
                name: this.environment2.name,
                field: "environment2Value",
                formatter: function(item, value) {
                    var result = i18n("Not deployed");
                    if (value) {
                        result = value;
                    }
                    return result;
                }
            }];

            var gridRestUrl = bootstrap.restUrl+"deploy/environment/"+this.environment1.id+"/compareProperties/"+this.environment2.id+"/"+this.component.id;
            this.grid = new Table({
                url: gridRestUrl,
                serverSideProcessing: false,
                columns: gridLayout,
                tableConfigKey: "componentPropertiesList",
                noDataMessage: i18n("No properties found.")
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