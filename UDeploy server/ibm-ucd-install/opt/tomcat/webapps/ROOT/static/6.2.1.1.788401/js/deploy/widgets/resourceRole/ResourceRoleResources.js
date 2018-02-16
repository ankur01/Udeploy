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
        "dojo/_base/xhr",
        "dojo/dom-construct",
        "dojo/on",
        "deploy/widgets/Formatters",
        "js/webext/widgets/GenericConfirm",
        "js/webext/widgets/Table"
        ],
function(
        _TemplatedMixin,
        _Widget,
        declare,
        xhr,
        domConstruct,
        on,
        Formatters,
        GenericConfirm,
        Table
) {
    /**
     *
     */
    return declare('deploy.widgets.resourceRole.ResourceRoleResources',  [_Widget, _TemplatedMixin], {
        templateString:
            '<div class="resourceList">'+
                '<div data-dojo-attach-point="buttonTopAttach"></div>' +
                '<div data-dojo-attach-point="resourcesGrid"></div>'+
                '<div data-dojo-attach-point="activeBoxAttach" style="margin: 2px;"></div>' +
                '<div data-dojo-attach-point="buttonBottomAttach"></div>' +
            '</div>',

        /**
         *
         */
        postCreate: function() {
            this.inherited(arguments);
            var self = this;

            var gridRestUrl = bootstrap.restUrl+"resource/resourceRole/"+this.resourceRole.id+"/resources";
            var gridLayout = [{
                    name: i18n("Name"),
                    formatter: Formatters.resourcePathFormatter,
                    orderField: "name",
                    filterField: "name",
                    filterType: "text",
                    getRawValue: function(item) {
                        return item.name;
                    }
                },{
                    name: i18n("Type"),
                    field: "type",
                    orderField: "type",
                    filterField: "type",
                    filterType: "select",
                    filterOptions: [{
                        label: i18n("Agent"),
                        value: "agent"
                    },{
                        label: i18n("Subresource"),
                        value: "subresource"
                    }],
                    formatter: function(item, value, cell) {
                        return value.cap();
                    },
                    getRawValue: function(item) {
                        return item.type;
                    }
                },{
                    name: i18n("Description"),
                    field: "description"
                },{
                    name: i18n("Status"),
                    formatter: Formatters.resourceStatusFormatter
                },{
                    name: i18n("Version"),
                    field: "version"
                },{
                    name: i18n("Actions"),
                    formatter: this.actionsFormatter,
                    parentWidget: this
                }];

            this.grid = new Table({
                url: gridRestUrl,
                serverSideProcessing: false,
                noDataMessage: i18n("No resources found using this role."),
                tableConfigKey: "resourceRoleResources",
                columns: gridLayout
            });
            this.grid.placeAt(this.resourcesGrid);
        },

        /**
         *
         */
        actionsFormatter: function(item) {
            var self = this.parentWidget;

            var result = document.createElement("div");

            if (item.security["Edit Basic Settings"]) {
                var editLink = document.createElement("a");
                editLink.innerHTML = i18n("Edit");
                editLink.className = "actionsLink";
                editLink.href = "#resource/"+item.id+"/edit";
                result.appendChild(editLink);

                if (item.connected && item.type === "agent") {
                    var restartLink = domConstruct.create("a", {
                        "class": "actionsLink linkPointer",
                        "innerHtml": i18n("Restart")
                    }, result);

                    on(editLink, "click", function() {
                        self.confirmRestart(item);
                    });

                    var upgradeLink = domConstruct.create("a", {
                        "class": "actionsLink linkPointer",
                        "innerHtml": i18n("Upgrade")
                    }, result);

                    on(editLink, "click", function() {
                        self.confirmUpgrade(item);
                    });
                }
            }

            return result;
        },

        /**
         *
         */
        confirmRestart: function(item) {
            var self = this;

            var confirm = new GenericConfirm({
                message: i18n("Are you sure you want to restart '%s'?", item.name.escape()),
                action: function() {
                    xhr.get({
                        url: bootstrap.restUrl + "resource/resource/" + item.id + "/restart",
                        load: function() {
                            self.grid.block();
                            setTimeout(function() {
                                self.grid.unblock();
                                self.grid.refresh();
                            }, 1000);
                        }
                    });
                }
            });
        },

        /**
         *
         */
        confirmUpgrade: function(item) {
            var self = this;

            var confirm = new GenericConfirm({
                message: i18n("Are you sure you want to upgrade '%s'?", item.name.escape()),
                action: function() {
                    xhr.get({
                        url: bootstrap.restUrl + "resource/resource/" + item.id + "/upgrade",
                        load: function() {
                            self.grid.block();
                            setTimeout(function() {
                                self.grid.unblock();
                                self.grid.refresh();
                            }, 1000);
                        }
                    });
                }
            });
        }
    });
});