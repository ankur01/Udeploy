/*
* Licensed Materials - Property of IBM Corp.
* IBM UrbanCode Deploy
* (c) Copyright IBM Corporation 2011, 2014. All Rights Reserved.
*
* U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
* GSA ADP Schedule Contract with IBM Corp.
*/
/*global define, require */
define(["dojo/_base/declare",
        "dojo/_base/xhr",
        "dijit/_WidgetBase",
        "dojo/on",
        "dojo/mouse",
        "dojo/dom-class",
        "dojo/dom-construct",
        "dijit/popup",
        "dijit/TooltipDialog",
        "dijit/form/Button",
       "js/webext/widgets/Alert"],
        function (
            declare,
            xhr,
            _WidgetBase,
            on,
            mouse,
            domClass,
            domConstruct,
            popup,
            TooltipDialog,
            Button,
            Alert) {
    /**
     * A widget to show annoying popup alerts to notify users of new feature areas. The alert will be shown if it has
     * not been dismissed by the user and alerts are not being suppressed by the user. This is determined using user
     * properties set in user preferences. Properties are named with a "dismissed_" prefix followed by the given name
     * of the widget (unless given name already begins with "dismissed_")
     *
     * Supported properties:
     *  name / String                   (required) The name of the alert. The name is important for determining user
     *                                  preference of when to show and when to not show the popup.
     *  around / DOM Node               (required) The DOM node to attach the popup to.
     *  title / String                  (optional) The title of the alert box. Displayed in bold.
     *  message / String                The message to display.
     *  dismissText / String            Text for the dismiss forever button. Default: Got it!
     *  cancelText / String             Text for the cancel button. Default: Remind me later
     *  onDismiss / Function            Function to execute when the box is dismissed. Default: Sets the user property
     *                                  to dismiss the slert forever.
     *  onCreate / Function             Function called after tooltip creation. Default opens the tooltip. Used to
     *                                  override if you don't want the tooltip to open immediately
     *  open / Function                 Function to open the popup for connecting events to. Only works when the tooltip
     *                                  exists and the 'around' dom node is provided
     *  width / String                  Width of the popup. Default: 350px
     */
    return declare("deploy.widgets.FeatureAlertPopup",
            [_WidgetBase], {

        around: undefined,
        title: null,
        message: null,
        dismissText: null,
        cancelText: null,
        name: undefined,
        alertName: undefined,
        dismissUrl: undefined,
        width: "360px",
        dismissedPrefix: "dismissed_",

        /**
         *
         */
        postCreate: function() {
            var self = this;
            var userPreferencesUrl = bootstrap.restUrl+"security/userPreferences";
            this.alertName = "";
            if (this.name.indexOf(this.dismissedPrefix) !== 0) {
                this.alertName += this.dismissedPrefix;
            }
            this.alertName += this.name;

            if (!this.dismissUrl) {
                this.dismissUrl = userPreferencesUrl + "/dismissAlert/" + this.alertName;
            }
            xhr.get({
                url: userPreferencesUrl,
                handleAs: "json",
                load: function(data) {
                    if (!data.suppressAlerts &&
                            !data.dismissedUserAlerts[self.alertName]) {
                        self.createTooltip();
                        self.onCreate();
                    }
                }
            });
        },

        createTooltip: function() {
            var self = this;
            if (self.tooltip) {
                self.close();
                self.tooltip.destroy();
            }

            var content = domConstruct.create("div", {
                "class": "popupContent"
            });
            var title = domConstruct.create("div", {
               "class": "popupTitle",
               innerHTML: self.title || ""
            }, content);
            var message = domConstruct.create("p", {
                "class": "popupMessage",
                innerHTML: self.message || ""
            }, content);

            var buttonContainer = domConstruct.create("div", {
                "class": "popupButtons"
            }, content);

            self.addButtons(buttonContainer);

            this.tooltip = new TooltipDialog({
                content: content,
                style: "width:" + self.width
            });
        },

        addButtons: function(buttonContainer) {
            var self = this;
            var cancelButton = new Button({
                label: self.cancelText || i18n("Remind Me Later"),
                onClick: function() {
                    self.onCancel();
                }
            });
            cancelButton.placeAt(buttonContainer);

            this.dismissButton = new Button({
                label: self.dismissText || i18n("Got It!"),
                onClick: function() {
                    self.onDismiss();
                }
            });
            domClass.add(this.dismissButton.domNode, "idxButtonSpecial");
            this.dismissButton.placeAt(buttonContainer);
        },

        onDismiss: function() {
            xhr.post({
                url: this.dismissUrl,
                headers: { "Content-Type": "application/json" },
                handleAs: "json",
                error: function(response) {
                    var dismissalError = new Alert({
                        messages: [i18n("Error dismissing feature alert:"),
                                   "",
                                   util.escape(response.responseText)]
                    });
                }
            });
            this.close();
        },

        onCancel: function() {
            this.close();
        },

        open: function() {
            var self = this;
            if (this.tooltip && this.around) {
                popup.open({
                    popup: self.tooltip,
                    around: self.around
                });
            }
            if (this.dismissButton) {
                this.dismissButton.focus();
            }
        },

        close: function() {
            if (this.tooltip) {
                popup.close(this.tooltip);
            }
        },

        onCreate: function() {
            this.open();
        }
    });
});
