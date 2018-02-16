/*
 * Licensed Materials - Property of IBM Corp.
 * IBM UrbanCode Deploy
 * (c) Copyright IBM Corporation 2011, 2014. All Rights Reserved.
 *
 * U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
 * GSA ADP Schedule Contract with IBM Corp.
 */
define(["dojo/_base/declare",
    "dojox/widget/Wizard",
    "dojo/dom-class",
    "dojo/dom-style"

],

function (declare,
        Wizard,
        domClass,
        domStyle) {

    return declare([Wizard], {

        postCreate: function () {
            this.inherited(arguments);

            domClass.add(this.doneButton.domNode, "idxButtonSpecial");
            domClass.add(this.nextButton.domNode, "idxButtonSpecial");
        },

        forward: function () {
            var data;
            if (this.selectedChildWidget.getData) {
                data = this.selectedChildWidget.getData();
            }
            this.inherited(arguments);
            if (this.selectedChildWidget.setData) {
                this.selectedChildWidget.setData(data);
            }
        }
    });
});
