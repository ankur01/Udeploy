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
        "dojo/_base/declare",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin"
        ],
function(
        declare,
        _WidgetBase,
        _TemplatedMixin
) {

    /**
     * A simple wrapper to present a dom node as a widget.
     */
    return declare(
        [_WidgetBase, _TemplatedMixin],
        {
            templateString:
                '<div class="domNode">'+
                '    <div dojoAttachPoint="domAttach"></div>'+
                '</div>'
        }
    );
});