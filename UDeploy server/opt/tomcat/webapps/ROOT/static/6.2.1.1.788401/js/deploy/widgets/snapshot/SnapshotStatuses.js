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
        "dojo/dom-class",
        "dojo/dom-construct",
        "dojo/on",
        "deploy/widgets/Formatters",
        "js/webext/widgets/ColumnForm",
        "js/webext/widgets/Dialog",
        "js/webext/widgets/GenericConfirm",
        "js/webext/widgets/RestSelect",
        "js/webext/widgets/table/TreeTable"
        ],
function(
        _TemplatedMixin,
        _Widget,
        Button,
        declare,
        xhr,
        domClass,
        domConstruct,
        on,
        Formatters,
        ColumnForm,
        Dialog,
        GenericConfirm,
        RestSelect,
        TreeTable
) {
    /**
     *
     */
    return declare('deploy.widgets.snapshot.SnapshotStatuses',  [_Widget, _TemplatedMixin], {
        templateString: 
            '<div class="snapshotStatuses">' +
                '<div class="listTopButtons" data-dojo-attach-point="buttonAttach"></div>' +
                '<div data-dojo-attach-point="gridAttach"></div>' +
            '</div>',

        /**
         *
         */
        postCreate: function() {
            this.inherited(arguments);
            var self = this;
            
            var gridLayout = [{
                name: i18n("Status"),
                formatter: Formatters.statusFormatter
            },{
                name: i18n("Description"),
                field: "description"
            },{
                name: i18n("Created"),
                field: "created",
                formatter: util.tableDateFormatter,
                orderField: "created",
                getRawValue: function(item) {
                    return new Date(item.created);
                }
            },{
                name: i18n("By"),
                field: "user",
                orderField: "user",
                getRawValue: function(item) {
                    return item.user;
                }
            },{
                name: i18n("Actions"),
                formatter: this.actionsFormatter,
                parentWidget: this
            }];

            var gridRestUrl = bootstrap.restUrl+"deploy/snapshot/"+this.snapshot.id+"/status";
            this.grid = new TreeTable({
                url: gridRestUrl,
                serverSideProcessing: false,
                hideExpandCollapse: true,
                hidePagination: false,
                columns: gridLayout,
                tableConfigKey: "snapshotStatusList",
                noDataMessage: i18n("No statuses have been assigned to this snapshot.")
            });
            this.grid.placeAt(this.gridAttach);
            
            if (appState.application.extendedSecurity[security.application.manageSnapshots]) {
                var newStatusButton = new Button({
                    label: i18n("Add a Status"),
                    showTitle: false,
                    onClick: function() {
                        self.showAddStatus();
                    }
                });
                domClass.add(newStatusButton.domNode, "idxButtonSpecial");
                newStatusButton.placeAt(this.buttonAttach);
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
        actionsFormatter: function(item, value, cell) {
            var self = this.parentWidget;
            var result = document.createElement("div");
            
            if (appState.application.extendedSecurity[security.application.manageSnapshots]) {
                var removeLink = domConstruct.create("a", {
                    "innerHTML": i18n("Remove"),
                    "class": "actionsLink linkPointer"
                }, result);
                on(removeLink, "click", function() {
                    self.confirmRemoval(item);
                });
            }
            
            return result;
        },
        
        /**
         * 
         */
        confirmRemoval: function(status) {
            var self = this;
            
            var confirm = new GenericConfirm({
                message: i18n("Are you sure you want to remove %s?", status.name.escape()),
                action: function() {
                    xhr.del({
                        url: bootstrap.restUrl+"deploy/snapshot/"+self.snapshot.id+"/status/"+util.encodeIgnoringSlash(status.name),
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
        showAddStatus: function() {
            var self = this;
            
            var formDialog = new Dialog({
                title: i18n("Add a Status"),
                closable: true,
                draggable: true
            });
            
            var addForm = new ColumnForm({
                submitUrl: bootstrap.restUrl, // Overridden later depending on the status selected.
                postSubmit: function(data) {
                    formDialog.hide();
                    formDialog.destroy();
                    self.grid.refresh();
                },
                onCancel: function() {
                    formDialog.hide();
                    formDialog.destroy();
                    self.grid.refresh();
                }
            });
            
            var submitUrl = null;
            var statusSelect = new RestSelect({
                restUrl: bootstrap.restUrl+"deploy/snapshot/" + self.snapshot.id + "/possibleStatuses",
                getValue: function(item) {
                    return item.name;
                },
                getStyle: function(item) {
                    return Formatters.conditionFormatter(item);
                },
                allowNone: false,
                onChange: function(value, item) {
                    if (item && item.name) {
                        addForm.submitUrl = bootstrap.restUrl+"deploy/snapshot/"+self.snapshot.id+"/status/"+util.encodeIgnoringSlash(item.name);
                    }
                }
            });
            addForm.addField({
                name: "status",
                label: i18n("Status"),
                required: true,
                widget: statusSelect
            });

            addForm.placeAt(formDialog.containerNode);
            formDialog.show();
        }
    });
});