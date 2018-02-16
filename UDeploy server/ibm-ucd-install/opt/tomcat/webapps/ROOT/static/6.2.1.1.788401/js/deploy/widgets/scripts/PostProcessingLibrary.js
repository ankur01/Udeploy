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
        "deploy/widgets/scripts/EditScript",
        "js/webext/widgets/Dialog",
        "js/webext/widgets/Alert",
        "js/webext/widgets/GenericConfirm",
        "js/webext/widgets/Table"
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
        EditScript,
        Dialog,
        Alert,
        GenericConfirm,
        Table
) {
    return declare('deploy.widgets.scripts.PostProcessingLibrary',  [_Widget, _TemplatedMixin], {
        templateString: 
            '<div class="scriptList">' +
                '<div class="listTopButtons" data-dojo-attach-point="buttonTopAttach"></div>' +
                '<div data-dojo-attach-point="gridAttach"></div>' +
            '</div>',
            
        /**
         *
         */
        postCreate: function() {
            this.inherited(arguments);
            var self = this;
            
            var gridRestUrl = bootstrap.restUrl+'script/postprocessing';
            var gridLayout = [{
                name: i18n("Name"),
                field:"name",
                orderField: "name",
                filterField: "name",
                filterType: "text",
                getRawValue: function(item) {
                    return item.name;
                }
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
                noDataMessage: i18n("No scripts founds"),
                tableConfigKey: "postProcessScriptList",
                columns: gridLayout
            });
            this.grid.placeAt(this.gridAttach);

            var newScriptButton = {
                label: i18n("Create Script"),
                showTitle: false,
                onClick: function() {
                    self.showEditScriptDialog();
                }
            };
   
            var topButton = new Button(newScriptButton);
            domClass.add(topButton.domNode, "idxButtonSpecial");
            topButton.placeAt(this.buttonTopAttach);
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
            
            var copyLink = domConstruct.create("a", {
                "class": "actionsLink linkPointer",
                "innerHTML": i18n("Copy")
            }, result);
            on(copyLink, "click", function() {
                self.showEditScriptDialog(undefined, item);
            });

            var editLink = domConstruct.create("a", {
                "class": "actionsLink linkPointer",
                "innerHTML": i18n("Edit")
            }, result);
            on(editLink, "click", function() {
                self.showEditScriptDialog(item);
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
        showEditScriptDialog: function(script, source) {
            var self = this;
            
            var newScriptDialog = new Dialog({
                title: i18n("Edit Script"),
                closable: true,
                draggable: true
            });
            
            var editScriptForm = new EditScript({
                script: script,
                source: source,
                callback: function() {
                    newScriptDialog.hide();
                    newScriptDialog.destroy();
                    self.grid.refresh();
                }
            });
            editScriptForm.placeAt(newScriptDialog.containerNode);
            newScriptDialog.show();
        },

        /**
         * 
         */
        confirmDelete: function(target) {
            var self = this;
            var confirm = new GenericConfirm({
                message: i18n("Are you sure you want to delete %s?", target.name),
                action: function() {
                    self.grid.block();
                    xhr.del({
                        url: bootstrap.restUrl+"script/postprocessing/"+target.id,
                        handleAs: "json",
                        load: function(data) {
                            self.grid.unblock();
                            self.grid.refresh();
                        }
                    });
                }
            });
        }
    });
});