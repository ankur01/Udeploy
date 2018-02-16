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
         "dojo/dom-style",
         "dojo/_base/fx",
         "dojo/_base/lang",
         "dojo/dom-construct"],
function(
         declare,
         domStyle,
         fx,
         lang,
         domConstruct){

/**
 * Requires _BlockerMixin.css
 *
 * A mixin to add block and unblock methods to any widget.
 * When blocked the widget has a gray animated spinner overlay
 * covering the widget
 */
return declare(null, {

    /**
     * Initialize the blocker element if not present
     */
    initBlocker: function (){
        var self = this;

        // fix the domNode positioning for blocker element to position against
        self.fixDomPositionStyle();

        // create the blocker element
        if (!self.blockerElement){
            self.blockerElement = domConstruct.create("div", {"class":"_blocker_mask"}, self.domNode, "first");
        }
    },

    /**
     * When dom node is not yet in document, the css position attribute can not be determined,
     * we need to fix this after the fact if executed at this point.
     *
     * This method will garuntee that the widget domNode will have a position value other than "static".
     */
    fixDomPositionStyle: function() {
        var self = this;

        var position = domStyle.get(self.domNode, "position");
        if (!position) {
            // not in document yet, keep polling for when we can read position attribute
            // TODO use dojox.timing.Timer?
            if (!self.blockerTimer) {
                self.blockerTimer = window.setInterval(function (){ self.fixDomPositionStyle(); }, 50);
            }
        }
        else {
            window.clearInterval(self.blockerTimer);
            self.blockerTimer = null;
            if (position === "static") {
                domStyle.set(self.domNode, "position", "relative");
            }
        }
    },

    /**
     * Block the widget with a gray spinner overlay.
     */
    block: function (){
        var self = this;
        var duration = 400;
        var op = 0.6;

        // create blockerElement if not already present
        self.initBlocker();

        domStyle.set(self.blockerElement, "display", "block");
        fx.fadeIn({
                "node": self.blockerElement,
                "duration": duration,
                "end": op
        }).play();
    },

    /**
     * Unblock the widget hiding the spinner overlay.
     */
    unblock: function (){
        var self = this;
        var duration = 400;
        var op = 0.6;

        if (self.blockerElement && !self._beingDestroyed) {
            fx.fadeOut({
                "node": self.blockerElement,
                "duration": duration,
                "onEnd": lang.hitch(self, function (){
                    domStyle.set(self.blockerElement, "display", "none");
                })
            }).play();
        }
    },
    
    /**
     * Indicates whether the widget is currently blocked.
     */
    isBlocked: function() {
        var result = false;
        
        if (this.blockerElement) {
            if (domStyle.get(this.blockerElement, "display") === "block") {
                result = true;
            }
        }
        
        return result;
    },

    /**
     * Cleanup any timers/pending operations
     */
    destroy: function (){
        var self = this;
        // clean up timer if present
        if (self.blockerTimer) {
            window.clearInterval(self.blockerTimer);
            self.blockerTimer = null;
        }
        if (self.blockerElement) {
            domConstruct.destroy(self.blockerElement);
        }
        self.inherited(arguments);
    }
});

});