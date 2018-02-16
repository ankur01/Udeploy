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
    "deploy/widgets/environment/EditLandscaperBlueprintProperties",
    "dojo/dom-style"],

function (declare,
          WizardPane,
          EditLandscaperBlueprintProperties,
          domStyle) {

    return declare([WizardPane], {

        postCreate: function () {
            this.inherited(arguments);

            var self = this;

            this.page = new EditLandscaperBlueprintProperties({
                environmentData: this.environmentData,
                dialog: this.dialog,
                blueprint: this.blueprint,
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

        setData: function (data) {
            this.page.environmentData = data;
        },

        _onShow: function () {
            this.inherited(arguments);
            this.refreshWizardIcons();

        },

        refreshWizardIcons: function () {
            domStyle.set(this.dialog.wizardIconNode1, "display", "none");
            domStyle.set(this.dialog.wizardIconNode2, "display", "inline");
        }

    });
});
