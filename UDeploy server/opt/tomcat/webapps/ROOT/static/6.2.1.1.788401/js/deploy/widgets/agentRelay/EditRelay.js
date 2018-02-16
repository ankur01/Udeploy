/*
* Licensed Materials - Property of IBM Corp.
* IBM UrbanCode Deploy
* (c) Copyright IBM Corporation 2011, 2016. All Rights Reserved.
*
* U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
* GSA ADP Schedule Contract with IBM Corp.
*/
/*global define, require */

define([
        "dijit/_TemplatedMixin",
        "dijit/_Widget",
        "dojo/_base/declare",
        "js/webext/widgets/ColumnForm",
        "dojo/date/locale"
        ],
function(
        _TemplatedMixin,
        _Widget,
        declare,
        ColumnForm,
        locale
) {
    return declare('deploy.widgets.agentRelay.EditRelay',  [_Widget, _TemplatedMixin], {
        templateString:
            '<div class="edit-relay">'+
            '  <div data-dojo-attach-point="formAttach"></div>'+
            '</div>',
        showCancel:true,

        /**
         *
         */
        postCreate: function() {
            this.inherited(arguments);
            var self = this;

            this.existingValues = {};
            if (this.relay) {
                this.existingValues = this.relay;
            }

            var cancelLabel = i18n("Cancel");
            if (!this.showCancel) {
                cancelLabel=null;
            }
            this.form = new ColumnForm({
                submitUrl: bootstrap.restUrl + "relay/" + self.existingValues.id,
                readOnly: self.readOnly,
                showButtons: !self.readOnly,
                "cancelLabel": cancelLabel,
                postSubmit: function(data) {
                    if (!self.noRedirect) {
                        navBar.setHash("relay/" + data.id);
                    }

                    if (self.callback !== undefined) {
                        self.callback();
                    }
                },
                addData: function(data) {
                    var key;
                    for (key in data) {
                        if (data.hasOwnProperty(key)) {
                            //Relay API Only allows description to be updated. Remove all other fields before PUT.
                            if(key !== "description") {
                                delete data[key];
                            }
                        }
                    }
                },
                onCancel: function() {
                    self.form.setValue("description", self.existingValues.description);
                    if (!self.noRedirect) {
                        navBar.setHash("relay/" + self.existingValues.id);
                    }
                }
            });

            this.form.addField({
                name: "name",
                label: i18n("Name"),
                type: "Label",
                style: "margin-top:0;",
                value: this.existingValues.name
            });

            this.form.addField({
                name: "description",
                label: i18n("Description"),
                required: false,
                type: "Text",
                value: this.existingValues.description
            });

            this.form.addField({
                name: "relayHostname",
                label: i18n("Host"),
                type: "Label",
                style: "margin-top:0",
                value: this.existingValues.relayHostname
            });

            this.form.addField({
                name: "hostname",
                label: i18n("Listening on"),
                type: "Label",
                style: "margin-top:0",
                value: this.existingValues.hostname
            });

            this.form.addField({
                name: "jmsPort",
                label: i18n("JMS Port"),
                type: "Label",
                style: "margin-top:0",
                value: this.existingValues.jmsPort.toString()
            });

            this.form.placeAt(this.formAttach);
        }
    });
});