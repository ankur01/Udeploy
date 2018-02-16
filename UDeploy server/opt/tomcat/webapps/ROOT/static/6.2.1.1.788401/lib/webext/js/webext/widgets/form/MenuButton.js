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
        "dijit/form/DropDownButton",
        "dijit/DropDownMenu",
        "dijit/MenuItem",
        "dojo/_base/array",
        "dojo/_base/declare"
        ],
function(
        DropDownButton,
        DropDownMenu,
        MenuItem,
        array,
        declare
) {

    /**
     * A shortcut widget for making a DropDownButton populated with various options.
     */
    return declare(
        [DropDownButton],
        {
            /**
             *
             */
            postCreate: function() {
                this.inherited(arguments);
                var self = this;

                this.dropDown = new DropDownMenu();
                
                array.forEach(this.options, function(option) {
                    self.dropDown.addChild(new MenuItem(option));
                });
            }
        }
    );
});
