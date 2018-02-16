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
         "dijit/_Container",
         "js/util/blocker/_BlockerMixin"
         ],
function(
         declare,
         _WidgetBase,
         _Container,
         _BlockerMixin){
    return declare([_BlockerMixin, _WidgetBase, _Container], {
        // nothing to do
    });
});