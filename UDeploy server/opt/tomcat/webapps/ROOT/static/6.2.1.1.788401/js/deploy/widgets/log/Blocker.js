/*
* Licensed Materials - Property of IBM Corp.
* IBM UrbanCode Deploy
* (c) Copyright IBM Corporation 2011, 2014. All Rights Reserved.
*
* U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
* GSA ADP Schedule Contract with IBM Corp.
*/
/*global define */

define([
        "dijit/_Widget",
        "dojo/_base/declare",
        "js/util/blocker/_BlockerMixin"
        ],
function(
        _Widget,
        declare,
        _BlockerMixin
) {
    /**
     * a stub for a blocker element
     */
    return declare('deploy.widgets.log.Blocker',  [_BlockerMixin, _Widget], {
    });
});
