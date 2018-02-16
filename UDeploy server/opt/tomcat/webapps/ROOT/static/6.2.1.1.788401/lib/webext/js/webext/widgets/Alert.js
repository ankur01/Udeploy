/*
* Licensed Materials - Property of IBM Corp.
* IBM UrbanCode Build
* IBM UrbanCode Deploy
* IBM UrbanCode Release
* IBM AnthillPro
* (c) Copyright IBM Corporation 2002, 2014. All Rights Reserved.
*
* U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
* GSA ADP Schedule Contract with IBM Corp.
*/
/*global define */
define([
        "dojo/_base/array",
        "dojo/_base/declare",
        "dojo/_base/kernel",
        "dijit/_WidgetBase",
        "js/webext/widgets/Dialog",
        "dijit/form/Button"
        ],
function(
        array,
        declare,
        kernel,
        _WidgetBase,
        Dialog,
        Button
) {

    /**
     * Simple widget to show a message in a dialog box with a "Close" button.
     *
     * Supported properties:
     *  title / String                  The title of the alert box.
     *  message / String                The message to display.
     *  messages / String               An array of messages to display, one per line.
     *  messageDom / DOM Node           The DOM node to add to the box.
     *  forceRawMessages / Boolean      Whether the message should not be escaped before display
     *                                  (defaults to false - deprecated in favor of using messageDom)
     *  onClose / Function              Function to execute when the box is closed.
     */
    return declare([_WidgetBase], {
        messages: null,

        /**
         *
         */
        postCreate: function() {
            this.inherited(arguments);
            var self = this;

            if (self.message && self.messages === null) {
                self.messages = [self.message];
            }

            var dialog = new Dialog({
                title: this.title || i18n("Alert"),
                closable: true,
                draggable: false
            });
            dialog.domNode.style.maxWidth = "500px";

            if (this.messageDom) {
                dialog.containerNode.appendChild(this.messageDom);
            }
            else {
                array.forEach(self.messages, function(message) {
                    var displayMessage = message || "&nbsp;";
                    
                    if (!self.forceRawMessages) {
                        displayMessage = displayMessage.escapeHTML();
                    }
                    else {
                        kernel.deprecated("forceRawMessages is intended to support legacy code, but " +
                                "is discouraged, and may not be supported in the future.");
                    }
                    
                    var messageDiv = document.createElement("div");
                    messageDiv.style.width = "300px";
                    messageDiv.innerHTML = displayMessage;
                    dialog.containerNode.appendChild(messageDiv);
                });
            }

            var buttonContainer = document.createElement("div");
            buttonContainer.className = "underField";
            var closeButton = new Button({
                label: i18n("Close"),
                onClick: function() {
                    dialog.hide();

                    if (self.onClose) {
                        self.onClose();
                    }
                }
            });
            closeButton.placeAt(buttonContainer);
            dialog.containerNode.appendChild(buttonContainer);

            dialog.show();
        }
    });
});
