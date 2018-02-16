/*
* Licensed Materials - Property of IBM Corp.
* IBM UrbanCode Deploy
* (c) Copyright IBM Corporation 2011, 2014. All Rights Reserved.
*
* U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
* GSA ADP Schedule Contract with IBM Corp.
*/
/*global define, require */

define([
        "dojo/_base/declare",
        "js/webext/widgets/ColumnForm",
        "js/webext/widgets/RestSelect",
        "deploy/widgets/component/ComponentFileComparison",
        "js/webext/widgets/Table",
        "dojo/_base/array",
        "dojo/_base/xhr",
        "dojo/dom-class",
        "dojo/dom-construct",
        "dojo/DeferredList",
        "dojo/dom-style",
        "dojo/on",
        "dojo/window",
        "deploy/widgets/log/Blocker",
        "js/util/blocker/_BlockerMixin",
        "js/webext/widgets/Dialog",
        "js/webext/widgets/Pager"
        ],
function(
        declare,
        ColumnForm,
        RestSelect,
        ComponentFileComparison,
        Table,
        Array,
        xhr,
        domClass,
        domConstruct,
        DeferredList,
        domStyle,
        on,
        win,
        Blocker,
        _BlockerMixin,
        Dialog,
        Pager
) {
    /**
     *
     */
    return declare([Dialog], {
        autoRefresh: true,

        lines: null,
        linesOfInterest: null,

        pagerControls: null,

        logText: null, // log-text div
        headerContainer: null,

        /**
        *
        */
        postCreate: function() {
            this.inherited(arguments);
            this.compareDialog = new Dialog({
                title: i18n("File Differences"),
                closable: true,
                heightPercent: 75,
                widthPercent: 75,
                destroyOnHide: true
            });
            domClass.add(this.compareDialog.containerNode, "versionFileCompare");
        },

        /**
        *
        */
        show: function () {
            var t = this;
            t.compContainer = domConstruct.create("div", {"class":"compContainer"}, t.compareDialog.containerNode);
            t.titleContainer = domConstruct.create("div", {"class": "titleContainer", "innerHTML": "<div></div><br>"}, t.compContainer);
            var title1 = domConstruct.create("div", {"class": "title", "innerHTML": t.version1.escape()}, t.titleContainer);
            var titleSpace = domConstruct.create("div", {"class": "titleSpacer", "style": {"width": "2%", display: "inline-block"}}, t.titleContainer);
            var title2 = domConstruct.create("div", {"class": "title", "innerHTML": t.version2.escape()}, t.titleContainer);

            t.showCompText();
            t.compareDialog.show();
        },

       /**
        * Fetch the updated log content from the server.
        *
        */
        showCompText: function() {
            var t = this;

            var colorChange = false;
            if (t.data !== undefined) {
                t.onData(t.data);
            }
            else {
                var loadText = xhr.get({
                    url: t.url,
                    handleAs: "json",
                    load: function(data) {
                        t.onData(data);
                    }
                });
            }
        },

        onData: function(data) {
           var t = this;
           Array.forEach(data, function (item) {
               if (item.space) {
                   t.changesContainer = domConstruct.create("div", {"class": "ellipsisContainer"}, t.compContainer);
                   var leftEll = domConstruct.create("div", {"class": "leftEll", "innerHTML": "..."}, t.changesContainer);
                   var rightEll = domConstruct.create("div", {"class": "rightEll", "innerHTML": "..."}, t.changesContainer);
                   t.changesContainer = domConstruct.create("div", {"class": "changesContainer"}, t.compContainer);
               }
               else {
                   var lineContainer = domConstruct.create("div", {"class": "lineContainer"}, t.changesContainer);
                   var originalContainer = domConstruct.create("div", {"class": "originalContainer"}, lineContainer);
                   var original = domConstruct.create("div", {"class": "original"}, originalContainer);
                   original.innerHTML = item.original || " ";
                   var changeContainer = domConstruct.create("div", {"class": "changeContainer"}, lineContainer);
                   var change = domConstruct.create("div", {"class": "change"}, changeContainer);
                   change.innerHTML = item.change || " ";
                   if (item.type === "CHANGE") {
                       original.style.backgroundColor = "#FFFCDC";
                       original.style.borderLeft = "3px solid #F4E967";
                       original.style.marginLeft = "6px";
                       change.style.backgroundColor = "#FFFCDC";
                       change.style.borderLeft = "3px solid #F4E967";
                       change.style.marginLeft = "6px";
                   }
                   else if (item.type === "INSERT") {
                       change.style.backgroundColor = "#F0FFD2";
                       change.style.borderLeft = "3px solid #5C6E25";
                       change.style.marginLeft = "6px";
                   }
                   else if (item.type === "DELETE") {
                       original.style.backgroundColor = "#FFEEEE";
                       original.style.borderLeft = "3px solid #9B3A3A";
                       original.style.marginLeft = "6px";
                   }
               }
           });
       },

       /**
       *
       */
        hide: function() {
            this.inherited(arguments);
            if (this.refreshTimer) {
                clearTimeout(this.refreshTimer);
            }
            this.compareDialog.destroy();
        }
    });
});
