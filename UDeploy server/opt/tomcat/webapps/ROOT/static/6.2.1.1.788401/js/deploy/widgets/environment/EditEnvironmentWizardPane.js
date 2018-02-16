/*
 * Licensed Materials - Property of IBM Corp.
 * IBM UrbanCode Deploy
 * (c) Copyright IBM Corporation 2011, 2014. All Rights Reserved.
 *
 * U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
 * GSA ADP Schedule Contract with IBM Corp.
 */
define(["dojo/_base/declare",
    "dojox/widget/WizardPane",
    "deploy/widgets/environment/EditEnvironment",
    "js/webext/widgets/Dialog",
    "dojo/dom-construct",
    "dijit/form/Button",
    "dojo/dom-class",
    "dojo/dom-style"],

function (declare,
          WizardPane,
          EditEnvironment,
          Dialog,
          domConstruct,
          Button,
          domClass,
          domStyle) {

    return declare([WizardPane], {

        postCreate: function () {
            this.inherited(arguments);

            var self = this;
            this.page = new EditEnvironment({
                application: this.application,
                dialog: this.dialog,
                callback: function () {
                    self.dialog.hide();
                    self.dialog.destroy();

                    if (self.application) {
                        navBar.setHash("#application/" + self.application.id, false, true);
                    }
                }
            });
            this.attachDoneFunction();
            this.addChild(this.page, 0);
        },
        _doneFunction: function () {
            this.page.submitForm();
        },
        attachDoneFunction: function () {
            this.doneFunction = this._doneFunction;
        },

        detachDoneFunction: function () {
            this.doneFunction = null;
        },

        getData: function () {
            return this.page.form.getData();
        },

        _checkPass: function () {
            var validationMessages = this.page.form.validateRequired();
            if (validationMessages.length > 0) {
                var requiredDialog = new Dialog({
                    title: i18n("Field Validation"),
                    closable: true,
                    draggable: false
                });

                var requiredText = domConstruct.create("div");
                requiredText.innerHTML = i18n("Please correct the following errors before moving to next page:");
                requiredDialog.containerNode.appendChild(requiredText);

                dojo.forEach(validationMessages, function (validationMessage) {
                    var fieldRequiredText = domConstruct.create("div");
                    fieldRequiredText.innerHTML = validationMessage;
                    requiredDialog.containerNode.appendChild(fieldRequiredText);
                });

                var closeButton = new Button({
                    label: i18n("Close"),
                    onClick: function () {
                        this.parentWidget.destroy();
                    }
                });
                domClass.add(closeButton.domNode, "underField");
                closeButton.parentWidget = requiredDialog;
                closeButton.placeAt(requiredDialog.containerNode);

                requiredDialog.show();
                return false;
            }
            return true;
        },

        _onShow: function () {
            this.inherited(arguments);
            this.refreshWizardIcons();

        },

        refreshWizardIcons: function () {
            if (this.isLastChild) {
                domStyle.set(this.dialog.wizardIconNode1, "display", "none");
                domStyle.set(this.dialog.wizardIconNode2, "display", "none");
            } else {
                domStyle.set(this.dialog.wizardIconNode1, "display", "inline");
                domStyle.set(this.dialog.wizardIconNode2, "display", "none");
            }
        }

    });
});
