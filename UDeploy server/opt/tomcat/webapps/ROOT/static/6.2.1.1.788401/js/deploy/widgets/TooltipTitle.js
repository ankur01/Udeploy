/* global define */
define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dijit/Tooltip",
        "dijit/_Widget",
        "dijit/_TemplatedMixin",
        "dojo/dom-construct"
    ],
    function(
        declare,
        lang,
        Tooltip,
        _Widget,
        _TemplatedMixin,
        domConstruct
    ) {

        /**
         * A standard interface for titles with tooltips.
         * 
         * The following attributes may be supplied:
         * titleText / String           The text for the title.
         * tooltipText / String     The text to include in the tooltip
         */
        return declare(
            'deploy.widgets.TooltipTitle', [_Widget, _TemplatedMixin], {
                templateString: '<div class="tooltipTitle">' +
                    '   <span data-dojo-attach-point="titleBar" class="containerLabel title-text"></span>' +
                    '   <div data-dojo-attach-point="tooltip" class="labelsAndValues-helpCell title-helpCell inlineBlock"></div>' +
                    '</div>',

                titleText: "",
                tooltipText: "",

                postCreate: function() {
                    this.inherited(arguments);

                    this.titleBar.innerHTML = this.titleText;

                    var helpTip = new Tooltip({
                        connectId: [this.tooltip],
                        label: this.tooltipText,
                        showDelay: 100,
                        position: ["after", "above", "below", "before"]
                    });
                }
            });
    });