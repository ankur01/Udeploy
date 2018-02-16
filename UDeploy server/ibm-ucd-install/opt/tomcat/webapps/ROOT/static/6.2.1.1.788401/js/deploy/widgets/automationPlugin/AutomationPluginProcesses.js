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
        "dojo/_base/array",
        "dojo/_base/declare",
        "deploy/widgets/Formatters",
        "js/webext/widgets/Table"
        ],
function(
        _TemplatedMixin,
        _Widget,
        array,
        declare,
        Formatters,
        Table
) {
    /**
     *
     */
    return declare('deploy.widgets.automationPlugin.AutomationPluginProcesses',  [_Widget, _TemplatedMixin], {
        templateString: 
            '<div class="automationPluginProcesses">' +
                '<div data-dojo-attach-point="gridAttach"></div>' +
            '</div>',

        /**
         *
         */
        postCreate: function() {
            this.inherited(arguments);
            var self = this;
            
            var gridRestUrl = bootstrap.restUrl+"plugin/automationPlugin/"+this.automationPlugin.id+"/processes";
            var gridLayout = [{
                name: i18n("Component"),
                formatter: function(item) {
                    return Formatters.componentLinkFormatter(item.component);
                },
                orderField: "component",
                filterField: "component",
                filterType: "text",
                getRawValue: function(item) {
                    return item.component ? item.component.name : "";
                }
            },{
                name: i18n("Process"),
                formatter: function(item) {
                    var result;
                    if (item.component) {
                        result = Formatters.componentProcessLinkFormatter(item);
                    }
                    else if (item.componentTemplate) {
                        result = Formatters.componentTemplateProcessLinkFormatter(item);
                    }
                    else { // generic process
                        result = Formatters.genericProcessLinkFormatter(item);
                    }
                    return result;
                },
                orderField: "process",
                filterField: "process",
                filterType: "text",
                getRawValue: function(item) {
                    return item.name;
                }
            },{
                name: i18n("Commands Used"),
                formatter: function(item) {
                    var result = "";
                    array.forEach(item.commandNames, function(commandName) {
                        if (result.length > 0) {
                            result = result+", ";
                        }
                        result += i18n(commandName);
                    });
                    return result;
                },
                field: "commandNames",
                filterField: "commandNames",
                filterType: "text",
                getRawValue: function(item) {
                    var result = "";
                    array.forEach(item.commandNames, function(commandName) {
                        if (result.length > 0) {
                            result = result+", ";
                        }
                        result += i18n(commandName);
                    });
                    return result;
                }
            }];

            this.grid = new Table({
                url: gridRestUrl,
                serverSideProcessing: false,
                columns: gridLayout,
                tableConfigKey: "pluginProcessList",
                noDataMessage: i18n("This plugin is not used in any processes.")
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