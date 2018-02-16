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
        "dojo/dom-class",
        "deploy/widgets/notification/EditNotificationScheme",
        "js/webext/widgets/Dialog",
        "js/webext/widgets/Table"
        ],
function(
        _TemplatedMixin,
        _Widget,
        Button,
        declare,
        domClass,
        EditNotificationScheme,
        Dialog,
        Table
) {
    /**
     *
     */
    return declare('deploy.widgets.notification.NotificationSchemeList',  [_Widget, _TemplatedMixin], {
        templateString: 
            '<div class="notificationSchemeList">' +
                '<div class="listTopButtons" data-dojo-attach-point="buttonTopAttach"></div>' +
                '<div data-dojo-attach-point="gridAttach"></div>' +
            '</div>',

        /**
         *
         */
        postCreate: function() {
            this.inherited(arguments);
            var self = this;
            
            var gridRestUrl = bootstrap.restUrl+"notification/notificationScheme";
            var gridLayout = [{
                name: i18n("Notification Scheme"),
                formatter: this.notificationSchemeFormatter
            },{
                name: i18n("Description"),
                field: "description"
            }];

            this.grid = new Table({
                url: gridRestUrl,
                serverSideProcessing: false,
                columns: gridLayout,
                tableConfigKey: "notificationSchemeList",
                noDataMessage: i18n("No notification schemes have been created yet.")
            });
            this.grid.placeAt(this.gridAttach);

            var newNotificationSchemeButton = {
                label: i18n("Create Notification Scheme"),
                showTitle: false,
                onClick: function() {
                    self.showNewNotificationSchemeDialog({});
                }
            };

            var topButton = new Button(newNotificationSchemeButton);
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
        notificationSchemeFormatter: function(item) {
            var result = document.createElement("a");
            result.href = "#notificationScheme/"+item.id;
            result.innerHTML = i18n(item.name.escape());
            return result;
        },
        
        /**
         * 
         */
        showNewNotificationSchemeDialog: function() {
            var self = this;
            
            var newNotificationSchemeDialog = new Dialog({
                title: i18n("Create Notification Scheme"),
                closable: true,
                draggable: true
            });
            
            var newNotificationSchemeForm = new EditNotificationScheme({
                callback: function() {
                    newNotificationSchemeDialog.hide();
                    newNotificationSchemeDialog.destroy();
                }
            });
            newNotificationSchemeForm.placeAt(newNotificationSchemeDialog.containerNode);
            newNotificationSchemeDialog.show();
        }
    });
});