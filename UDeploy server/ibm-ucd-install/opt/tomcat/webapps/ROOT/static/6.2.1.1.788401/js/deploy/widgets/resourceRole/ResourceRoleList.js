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
        "dijit/form/Button",
        "dojo/_base/declare",
        "dojo/_base/xhr",
        "dojo/dom-construct",
        "dojo/on",
        "deploy/widgets/Formatters",
        "deploy/widgets/resourceRole/EditResourceRole",
        "js/webext/widgets/Alert",
        "js/webext/widgets/Dialog",
        "js/webext/widgets/GenericConfirm",
        "js/webext/widgets/Table"
        ],
function(
        _TemplatedMixin,
        _Widget,
        Button,
        declare,
        xhr,
        domConstruct,
        on,
        Formatters,
        EditResourceRole,
        Alert,
        Dialog,
        GenericConfirm,
        Table
) {
    /**
     *
     */
    return declare('deploy.widgets.resourceRole.ResourceRoleList',  [_Widget, _TemplatedMixin], {
        templateString: 
            '<div class="componentList">' +
                '<div data-dojo-attach-point="buttonAttach"></div>' +
                '<div data-dojo-attach-point="gridAttach"></div>' +
            '</div>',

        /**
         *
         */
        postCreate: function() {
            this.inherited(arguments);
            var self = this;
            
            var gridRestUrl = bootstrap.restUrl+"resource/resourceRole/userDefinedRoles";
            var gridLayout = [{
                    name: i18n("Name"),
                    formatter: Formatters.resourceRoleLinkFormatter,
                    orderField: "name",
                    filterField: "name",
                    filterType: "text"
                },{
                    name: i18n("Description"),
                    field: "description"
                },{
                    name: i18n("Actions"),
                    formatter: this.actionsFormatter,
                    parentWidget: this
                }];

            this.grid = new Table({
                url: gridRestUrl,
                serverSideProcessing: false,
                noDataMessage: i18n("No resources roles have been created yet."),
                tableConfigKey: "resourceRoleList",
                columns: gridLayout
            });
            this.grid.placeAt(this.gridAttach);
            
            if (config.data.permissions[security.system.createManageResourceRoles]) {
                var newRoleButton = new Button({
                    label: i18n("Create Role"),
                    showTitle: false,
                    onClick: function() {
                        self.showCreateResourceRole();
                    }
                });
                newRoleButton.placeAt(this.buttonAttach);
            }
        },

        /**
         *
         */
        destroy: function() {
            this.inherited(arguments);
            this.grid.destroy();
        },

        /**
         *
         */
        actionsFormatter: function(item) {
            var self = this.parentWidget;

            var result = document.createElement("div");

            if (config.data.permissions[security.system.createManageResourceRoles]) {
                domConstruct.create("a", {
                    "innerHTML": i18n("Edit"),
                    "class": "actionsLink",
                    "href": "#resourceRole/"+item.id+"/edit"
                }, result);
                
                var deleteLink = domConstruct.create("a", {
                    "innerHTML": i18n("Delete"),
                    "class": "actionsLink linkPointer"
                }, result);
                on(deleteLink, "click", function() {
                    self.showDeleteConfirm(item);
                });
            }
            
            return result;
        },

        /**
         * 
         */
        showDeleteConfirm: function(item) {
            var self = this;
            
            var confirm = new GenericConfirm({
                message: i18n("Are you sure you want to delete \"%s\"?", item.name.escape()),
                action: function() {
                    xhr.del({
                        url: bootstrap.restUrl + "resource/resourceRole/" + item.id,
                        load: function() {
                            self.grid.refresh();
                        },
                        error: function(error) {
                            var alert = new Alert({
                                messages: [i18n("Error deleting resource role:"),
                                           "",
                                           util.escape(error.responseText)]
                            });
                            alert.startup();
                        }
                    });
                }
            });
        },

        /**
         * 
         */
        showCreateResourceRole: function(resourceRole) {
            var self = this;
            
            var title = i18n("Create a Role");

            var formDialog = new Dialog({
                title: title,
                closable: true,
                draggable: true
            });
            
            var editForm = new EditResourceRole({
                callback: function() {
                    formDialog.hide();
                    formDialog.destroy();
                    self.grid.refresh();
                }
            });
            editForm.placeAt(formDialog.containerNode);
            formDialog.show();
        }
    });
});