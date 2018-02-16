/*
* Licensed Materials - Property of IBM Corp.
* IBM UrbanCode Build
* IBM UrbanCode Deploy
* IBM UrbanCode Release
* IBM AnthillPro
* (c) Copyright IBM Corporation 2002, 2014, 2015. All Rights Reserved.
*
* U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
* GSA ADP Schedule Contract with IBM Corp.
*/
/*global define */
define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/aspect",
        "dijit/Dialog",
        "dijit/Tooltip",
        "dojo/window",
        "dojo/dom-style",
        "dojo/_base/kernel"
        ],
function(
        declare,
        lang,
        aspect,
        Dialog,
        Tooltip,
        win,
        domStyle,
        kernel
) {

    /**
     * A local extension of js.webext.widgets.Dialog which suppresses the draggable DOM attribute.
     *
     * Also supports manually dealing with dialog size. The following attributes may be supplied:
     *  height / Integer            Height, in pixels.
     *                              Negative value means <window height>-value
     *  width / Integer             Width, in pixels.
     *                              Negative value means <window width>-value
     *
     *                              - or -
     *
     *  heightPercent / Integer     Percent of window to use for height
     *  widthPercent / Integer      Percent of window to use for width
     *
     */
    return declare(
        'js.webext.widgets.Dialog',
        [Dialog],
        {
            templateString:
                '<div class="dijitDialog" role="dialog" aria-labelledby="${id}_title">'+
                '    <div data-dojo-attach-point="titleBar" class="dijitDialogTitleBar">'+
                '    <span data-dojo-attach-point="titleNode" class="dijitDialogTitle" id="${id}_title"></span>'+
                '    <span data-dojo-attach-point="closeButtonNode" class="dijitDialogCloseIcon" data-dojo-attach-event="ondijitclick: onCancel" title="${buttonCancel}" role="button" tabIndex="-1" style="display:inline;">'+
                '        <span data-dojo-attach-point="closeText" class="closeDialogIcon" title="${buttonCancel}"></span>'+
                '    </span>'+
                '    </div>'+
                '    <div data-dojo-attach-point="containerContainer" style="overflow-y: auto;"><div data-dojo-attach-point="containerNode" class="dijitDialogPaneContent"></div></div>'+
                '</div>',

            // State for hide and destroy below
            _destroying: false,
            _hideDeferred: null,
            destroyOnHide: false,

            postCreate: function() {
                this.inherited(arguments);

                var dimensions = win.getBox();
                var maxHeight = dimensions.h-100;
                this.containerContainer.style.maxHeight = maxHeight+"px";

                if (this.destroyOnHide) {
                    aspect.after(this, "onHide", lang.hitch(this, 'destroy'));
                }
                if (this.description) {
                    var helpCell = document.createElement("div");
                    helpCell.className = "labelsAndValues-helpCell inlineBlock";

                    var helpTip = new Tooltip({
                        connectId: [helpCell],
                        label: this.description,
                        showDelay: 100,
                        position: ["after", "above", "below", "before"]
                    });
                    this.titleBar.appendChild(helpCell);
                }
            },

            show: function() {
                this.domNode.draggable = false;
                this.inherited(arguments);
                this._hideDeferred = null;

                // This will automatically reposition the dialog after various intervals to make
                // sure that it appears in the center of the screen. We wait a bit potentially to
                // allow content for the dialog to load before repositioning it.
                var self = this;
                var reposition = function() {
                    if (self.open) {
                        self._position();
                    }
                };
                setTimeout(function() {
                    reposition();
                }, 25);
                setTimeout(function() {
                    reposition();
                }, 50);
                setTimeout(function() {
                    reposition();
                }, 100);
                setTimeout(function() {
                    reposition();
                }, 200);
                setTimeout(function() {
                    reposition();
                }, 400);
                setTimeout(function() {
                    reposition();
                }, 800);
                setTimeout(function() {
                    reposition();
                }, 1200);
            },

            /*
             * hide() and destroy() are overridden to ensure both are called
             * in the correct order and with the correct timing. If this
             * is not done properly, IE8 may throw an exception. The
             * specific requirement is that destroy() must be preceeded by
             * hide(), but destroy() must wait for the animation
             * initiated by hide() to complete first.
             */

            hide: function() {
                var deferred = this._hideDeferred;
                if (!deferred) {
                    deferred = this._hideDeferred = this.inherited(arguments);
                }
                return deferred;
            },

            destroy: function() {
                var self = this;
                var deferred;
                var args;
                var superDestroy;

                if (!self._destroying) {
                    self._destroying = true;

                    deferred = self._hideDeferred;
                    args = arguments;
                    superDestroy = self.getInherited(arguments);

                    if (!deferred) {
                        deferred = self.hide();
                    }

                    var fin = function() {
                        superDestroy.apply(self, args);
                        self._destroying = false;
                        self._hideDeferred = null;
                    };
                    if (deferred) {
                        // wait for hiding animation to complete
                        deferred.then(fin);
                    }
                    else {
                        // no hiding animation just do it now
                        fin();
                    }
                }
            },

            _size: function() {
                if (this.height || this.width || (this.heightPercent && this.widthPercent)) {
                    if (lang.isString(this.height) || lang.isString(this.width)) {
                        kernel.deprecated("String values for this.height or this.width is deprecated, and may not be supported in the future. Use integer values.");
                    }
                    // the height and width should be a number or a string without 'px'.
                    // parseInt returns the first "number" in a string. e.g. "300px" will be parsed as 300.
                    // there is no need to check that this.height or this.width exist, since parseInt will
                    // return NaN for anything that cannot be parsed as a number, and the method will fail
                    // below anyway.
                    this.height = parseInt(this.height, 10);
                    this.width = parseInt(this.width, 10);

                    var dimensions = win.getBox();

                    var height = this.height;
                    var width = this.width;

                    if (this.heightPercent) {
                        height = dimensions.h * this.heightPercent/100;
                    }
                    else if (this.height < 0) {
                        height = dimensions.h+this.height;
                    }

                    if (this.widthPercent) {
                        width = dimensions.w * this.widthPercent/100;
                    }
                    else if (this.width < 0) {
                        width = dimensions.w+this.width;
                    }

                    var style = {
                            overflow: "auto",
                            position: "relative"
                    };
                    if (width) {
                        style.width = width +"px";
                    }
                    if (height) {
                        style.height = height + "px";
                    }

                    domStyle.set(this.containerNode, style);
                }
                else {
                    this.inherited(arguments);
                }
            }
        }
    );
});
