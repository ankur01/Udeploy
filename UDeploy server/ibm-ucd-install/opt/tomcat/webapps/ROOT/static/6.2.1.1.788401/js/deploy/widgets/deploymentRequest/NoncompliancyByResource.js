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
        "js/webext/widgets/table/TreeTable",
        "deploy/widgets/Formatters"
        ],
function(
        _TemplatedMixin,
        _Widget,
        declare,
        TreeTable,
        formatters
) {
    return declare('deploy.widgets.deploymentRequest.NoncompliancyByResource',  [_Widget, _TemplatedMixin], {
        templateString: 
            '<div class="noncompliancyByResource">' + 
                '<div data-dojo-attach-point="treeAttach"></div>' +
            '</div>',

        /**
         * 
         */
        postCreate: function() {
            this.inherited(arguments);
            
            var gridLayout = [{
                name: i18n("Resource/Component"),
                formatter: function(item, result, cellDom) {
                    var name;
                    if (item.version) {
                        name = formatters.componentLinkFormatter(item.version.component);
                    }
                    else {
                        if (item.security.read) {
                            name = util.getOnClickLink("resource/"+item.id, item.name);
                        }
                        else {
                            name = item.name.escape();
                        }
                    }
                    return name;
                },
                getRawValue: function(item) {
                    return item.name;
                },
                field: "name"
            },{
                name: i18n("Version"),
                formatter: function(item, result, cellDom) {
                    if (item.version) {
                        return formatters.versionLinkFormatter(item.version);
                    }
                }
            },{
                name: i18n("# Versions Missing"),
                formatter: function(item, result,cellDom) {
                    var finalResult;
                    if(item.version === undefined) {
                        finalResult = item.children.length;
                    }
                    return finalResult;
                }
            }];
            
            this.tree = new TreeTable({
                url: bootstrap.restUrl+"deploy/environment/"+appState.environment.id+"/noncompliantResources",
                columns: gridLayout,
                serverSideProcessing: false,
                orderField: "name",
                tableConfigKey: "resourceNoncompliancyList"
            });

            this.tree.placeAt(this.treeAttach);
        },

        /**
         * 
         */
        destroy: function() {
            this.inherited(arguments);
            this.tree.destroy();
        }
    });
});