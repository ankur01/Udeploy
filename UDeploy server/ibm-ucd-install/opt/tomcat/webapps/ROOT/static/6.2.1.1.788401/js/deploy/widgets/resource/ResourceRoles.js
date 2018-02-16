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
        "dojo/window",
        "deploy/widgets/Formatters",
        "deploy/widgets/resource/ResourceRolePropertyEditor",
        "js/webext/widgets/ColumnForm",
        "js/webext/widgets/Dialog",
        "js/webext/widgets/GenericConfirm",
        "js/webext/widgets/RestSelect",
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
        win,
        Formatters,
        ResourceRolePropertyEditor,
        ColumnForm,
        Dialog,
        GenericConfirm,
        RestSelect,
        Table
) {
    /**
     *
     */
    return declare('deploy.widgets.resource.ResourceRoles',  [_Widget, _TemplatedMixin], {
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
            
            var gridRestUrl = bootstrap.restUrl+"resource/resource/"+this.resource.id+"/roles";
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
                tableConfigKey: "resourceResourceRoleList",
                noDataMessage: i18n("No roles have been added to this resource."),
                columns: gridLayout
            });
            this.grid.placeAt(this.gridAttach);
            
            var newRoleButton = new Button({
                label: i18n("Add a Role"),
                showTitle: false,
                onClick: function() {
                    self.showAddResourceRole();
                }
            });
            newRoleButton.placeAt(this.buttonAttach);
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

            if (self.resource.security["Manage Properties"]) {
                var editLink = domConstruct.create("a", {
                    "innerHTML": i18n("Edit"),
                    "class": "actionsLink linkPointer"
                }, result);
                on(editLink, "click", function() {
                    self.showEditRoleProperties(item);
                });

                var removeLink = domConstruct.create("a", {
                    "innerHTML": i18n("Remove"),
                    "class": "actionsLink linkPointer"
                }, result);
                on(removeLink, "click", function() {
                    self.showRemoveConfirm(item);
                });
            }
            
            return result;
        },

        /**
         * 
         */
        showRemoveConfirm: function(item) {
            var self = this;
            
            var confirm = new GenericConfirm({
                message: i18n("Are you sure you want to remove \"%s\"?", item.name.escape()),
                action: function() {
                    xhr.put({
                        url: bootstrap.restUrl + "resource/resource/"+self.resource.id+"/removeRole/"+item.id,
                        load: function() {
                            self.grid.refresh();
                        }
                    });
                }
            });
        },

        /**
         * 
         */
        showAddResourceRole: function() {
            var self = this;
            
            var selectedRole = null;
            var submitUrl = null;
            var propertyNames = [];
            
            var formDialog = new Dialog({
                title: i18n("Add a Role"),
                closable: true,
                draggable: true
            });
            
            var addForm = new ColumnForm({
                submitUrl: bootstrap.restUrl, // Overridden later depending on the role selected.
                postSubmit: function(data) {
                    formDialog.hide();
                    formDialog.destroy();
                    self.grid.refresh();
                    
                    if (selectedRole.propDefs !== null && selectedRole.propDefs !== undefined
                            && selectedRole.propDefs.length > 0) {
                        self.showEditRoleProperties(selectedRole);
                    }
                },
                onCancel: function() {
                    formDialog.hide();
                    formDialog.destroy();
                    self.grid.refresh();
                }
            });
            
            var roleSelect = new RestSelect({
                restUrl: bootstrap.restUrl+"resource/resourceRole",
                allowNone: false,
                onChange: function(value, item) {
                    selectedRole = item;
                    if (item) {
                        addForm.submitUrl = bootstrap.restUrl+"resource/resource/"+self.resource.id+"/addRole/"+item.id;
                    }
                }
            });
            addForm.addField({
                name: "resourceRoleId",
                label: i18n("Role"),
                required: true,
                widget: roleSelect
            });

            addForm.placeAt(formDialog.containerNode);
            formDialog.show();
        },
        
        /**
         * 
         */
        showEditRoleProperties: function(role) {
            var self = this;
            
            var formDialog = new Dialog({
                title: i18n("Edit Properties for Role"),
                closable: true,
                draggable: true
            });
            
            var editor = new ResourceRolePropertyEditor({
                role: role,
                resource: self.resource,
                onSave: function() {
                    formDialog.hide();
                    formDialog.destroy();
                },
                onCancel: function() {
                    formDialog.hide();
                    formDialog.destroy();
                }
            });
            editor.placeAt(formDialog.containerNode);

            var box = win.getBox();
            var maxHeight = box.h-100;
            
            formDialog.containerNode.style.maxHeight = maxHeight+"px";
            formDialog.containerNode.style.overflowY = "scroll";
            
            formDialog.show();
        }
    });
});