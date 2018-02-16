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
        "dijit/form/CheckBox",
        "dojo/_base/declare",
        "dojo/_base/xhr",
        "dojo/dom-class",
        "dojo/dom-construct",
        "dojo/on",
        "deploy/widgets/status/EditStatus",
        "js/webext/widgets/Dialog",
        "js/webext/widgets/GenericConfirm",
        "js/webext/widgets/Table"
        ],
function(
        _TemplatedMixin,
        _Widget,
        Button,
        CheckBox,
        declare,
        xhr,
        domClass,
        domConstruct,
        on,
        EditStatus,
        Dialog,
        GenericConfirm,
        Table
) {
    /**
     *
     */
    return declare('deploy.widgets.status.StatusList',  [_Widget, _TemplatedMixin], {
        templateString:
            '<div class="statusList">' +
                '<div class="listTopButtons" data-dojo-attach-point="buttonTopAttach"></div>' +
                '<div data-dojo-attach-point="gridAttach"></div>' +
            '</div>',

        /**
         *
         */
        postCreate: function() {
            this.inherited(arguments);
            var self = this;

            var gridRestUrl = bootstrap.restUrl+"deploy/status/"+this.type+"Statuses";
            var gridLayout = [{
                name: i18n("Name"),
                formatter: function(item, value, cell) {
                    domClass.add(cell, "statusBox");
                    cell.style.backgroundColor = item.color;
                    if (util.isDarkColor(item.color)){
                        cell.style.color ="#FFF";
                    }
                    return item.name;
                }
            },{
                name: i18n("Unique"),
                field: "unique"
            }];

            if (this.type === "version" || this.type === "snapshot") {
                gridLayout.push({
                    name: i18n("Required Role"),
                    field: "roleName"
                });
            }

            gridLayout.push({
                name: i18n("Description"),
                field: "description"
            });
            gridLayout.push({
                name: i18n("Actions"),
                formatter: this.actionsFormatter,
                parentWidget: this
            });

            this.grid = new Table({
                url: gridRestUrl,
                serverSideProcessing: false,
                columns: gridLayout,
                tableConfigKey: "statusList",
                noDataMessage: i18n("No statuses found.")
            });
            this.grid.placeAt(this.gridAttach);

            var addButton = new Button({
                label: i18n("Add Status"),
                showTitle: false,
                onClick: function() {
                    self.showEditStatusForm();
                }
            });
            domClass.add(addButton.domNode, "idxButtonSpecial");
            addButton.placeAt(this.buttonTopAttach);
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

            var result = domConstruct.create("div");

            var editLink = domConstruct.create("a", {
                "class": "actionsLink linkPointer",
                "innerHTML": i18n("Edit")
            }, result);
            on(editLink, "click", function() {
                self.showEditStatusForm(item);
            });

            var deleteLink = domConstruct.create("a", {
                "class": "actionsLink linkPointer",
                "innerHTML": i18n("Delete")
            }, result);
            on(deleteLink, "click", function() {
                self.confirmDelete(item);
            });


            return result;
        },

        /**
         *
         */
        confirmDelete: function(target) {
            var self = this;
            var confirm = new GenericConfirm({
                message: i18n("Are you sure you want to delete status %s?", target.name.escape()),
                action: function() {
                    self.grid.block();
                    xhr.del({
                        url: bootstrap.restUrl+"deploy/status/"+target.id,
                        handleAs: "json",
                        load: function(data) {
                            self.grid.unblock();
                            self.grid.refresh();
                        }
                    });
                }
            });
        },

        /**
         *
         */
        showEditStatusForm: function(status) {
            var self = this;

            var dialog = new Dialog({
                title: status ? i18n("Edit Status") : i18n("Add Status"),
                closable: true,
                draggable: true
            });

            var editStatus = new EditStatus({
                status: status,
                type: this.type,
                callback: function() {
                    dialog.hide();
                    dialog.destroy();
                    self.grid.refresh();
                }
            });

            editStatus.placeAt(dialog.containerNode);
            dialog.show();
        }
    });
});