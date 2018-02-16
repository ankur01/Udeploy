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
/*global define, i18n */
define([
        "dojo/_base/declare",
        "dijit/_Widget",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dojo/_base/array",
        "dojo/dom-class",
        "dojo/dom-style",
        "dojo/dom-construct",
        "dojo/_base/lang",
        "dojo/_base/xhr",
        "dojo/window",
        "dojo/on"
        ],
function(
        declare,
        _Widget,
        _WidgetBase,
        _TemplatedMixin,
        array,
        domClass,
        domStyle,
        domConstruct,
        lang,
        baseXhr,
        win,
        on
) {
    return declare(
        [_WidgetBase, _TemplatedMixin],
        {
            templateString: '<div class="pageAlerts">' +
                                '<div data-dojo-attach-point="alertAttach"></div>' +
                            '</div>',

            /**
             *
             */
            postCreate: function() {
                this.inherited(arguments);
                var self = this;

                array.forEach(this.alerts, function(item) {
                    self.addAlert(item);
                });
            },

            addAlert: function(item) {
                var self = this;
                var alert;
                // Container to hold alert info
                var containerDiv = domConstruct.create('div', {
                    'class': 'pageAlert'
                }, self.alertAttach);

                var alertDiv = domConstruct.create('div', {});

                if (item.text) {
                    alertDiv.innerHTML = item.text.escape();
                }
                else if (item.html) {
                    if (typeof item.html === "object") {
                        domConstruct.place(item.html, alertDiv);
                    }
                    else {
                        alertDiv.innerHTML = item.html;
                    }
                }
                else if (item.messageId) {
                    alert = self.getAlert(item.messageId);
                    alertDiv = alert.getDisplay(item);
                }
                containerDiv.appendChild(alertDiv);

                if (item.userCanDismiss) {
                    var closeDiv = domConstruct.create('div', {
                        'class': 'dismiss'
                    }, containerDiv);

                    on (closeDiv, 'click', function() {
                        if (item.messageId && alert && alert.dismiss) {
                            alert.dismiss(item);
                        }
                        domConstruct.destroy(containerDiv);
                    });
                }

                // Any optional classes to add to the alert
                if (item.className) {
                    domClass.add(containerDiv, item.className);
                }
            },

            getAlert: function(alertId, args) {
                var result;
                if (config && config.data && config.data.alerts) {
                    result = config.data.alerts[alertId];
                }
                return result;
            }
        }
    );
});
