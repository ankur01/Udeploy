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
        "dijit/_TemplatedMixin",
        "dijit/_Widget",
        "dojo/_base/array",
        "dojo/_base/declare",
        "dojo/_base/xhr",
        "dojo/_base/lang",
        "dojo/window",
        "dojo/dom-class",
        "dojo/dom-construct",
        "dojo/dom-attr",
        "dojo/on",
        "dojo/mouse",
        "dojo/query",
        "dijit/form/Button",
        "dijit/form/CheckBox",
        "dijit/form/NumberSpinner",
        "deploy/widgets/workflow/GraphEdgeManager",
        "deploy/widgets/workflow/activity/ActivityCreator",
        "js/webext/widgets/Alert",
        "js/webext/widgets/Dialog",
        "js/webext/widgets/GenericConfirm",
        "deploy/widgets/process/ProcessIconsFormatter",
        "deploy/widgets/process/RequiredCommentForm"
        ],
function(
        _TemplatedMixin,
        _Widget,
        array,
        declare,
        xhr,
        lang,
        win,
        domClass,
        domConstruct,
        domAttr,
        on,
        mouse,
        query,
        Button,
        CheckBox,
        NumberSpinner,
        GraphEdgeManager,
        ActivityCreator,
        Alert,
        Dialog,
        GenericConfirm,
        ProcessIconsFormatter,
        RequiredCommentForm
) {
    /*globals mxClient, mxUtils, mxToolbar, mxPrintPreview, mxWindow, mxCellOverlay, mxCellOverlay, mxImage, mxPoint,
     mxConstants, mxEvent, mxConnectionConstraint, mxGraph, mxOutline, mxDivResizer, mxGraphLayout, mxRectangle,
     mxLayoutManager, mxEdgeStyle, mxEventObject, body
     */
    /**
     * This widget provides some skeleton for mxGraph implementations, as well as utility methods.
     */
    return declare('deploy.widgets.workflow.BaseGraph',  [_Widget, _TemplatedMixin], {
        templateString:
            '<div class="baseGraph" style="position: relative;">'+
              '<div data-dojo-attach-point="alternateContentAttach" class="hidden"></div>'+
              '<div class="hidden" data-dojo-attach-point="toolBarContainer">' +
                '<div data-dojo-attach-point="toolbarAttach"></div>'+
                '<div data-dojo-attach-point="outlineAttach" class="process-outline-box"></div>'+
              '</div>' +
              '<div class="hidden" data-dojo-attach-point="processStepContainer">' +
                '<div data-dojo-attach-point="addAttach"></div>'+
              '</div>' +
              '<div data-dojo-attach-point="dialogAttach" class="hide-notification process-save-dialog"></div>'+
              '<div data-dojo-attach-point="mxgraphAttach" class="hidden" style="height: 100%; margin-left: 240px;"></div>'+
            '</div>',

        graph: null,
        edgeManager: null,
        activityCreator: null,
        initialized: false,

        /**
         *
         */
        postCreate: function() {
            this.inherited(arguments);
            var self = this;

            var container = this.mxgraphAttach;
            container.style.overflow = 'hidden';
            container.style.height = win.getBox().h+"px";

            mxEvent.disableContextMenu(container);
            mxConstants.SHADOWCOLOR = '#CCCCCC';
            mxConstants.VERTEX_SELECTION_COLOR = '#888888';
            mxConstants.HANDLE_FILLCOLOR = '#FFFFFF';
            mxConstants.HIGHLIGHT_COLOR = "#00B2EF";
            mxConstants.TARGET_HIGHLIGHT_COLOR = "#00B2EF";
            mxConstants.VERTEX_HIGHLIGHT_COLOR = "#00B2EF";

            this.graph = new mxGraph(container);

            this.configureGraph();
            this.setGraphStyling();

            // Create the overview box.
            var outlineBox = new mxOutline(this.graph, this.outlineAttach);

            // Workaround for Internet Explorer ignoring certain styles
            if (mxClient.IS_IE) {
                var divResizer = new mxDivResizer(container);
                divResizer = new mxDivResizer(this.outlineAttach);
            }

            this.edgeManager = new GraphEdgeManager({
                graphEditor: this,
                graphHasChanges: function(){
                    self.graphHasChanges();
                }
            });

            this.activityCreator = new ActivityCreator({
                graphEditor: this,
                graphHasChanges: function(){
                    self.graphHasChanges();
                }
            });

            // Keep showing save dialog on page refresh;
            if (util.getCookie("processSaved") === "true"){
                var message = util.getCookie("processSavedMessage");
                var error = util.getCookie("error") === "true";
                this.showSavePopup(message, error);
            }
            if (body){
                domClass.add(body, "process-editor");
            }

            // get property context info, and store it in a cache to use for autocomplete
            var processType;
            var processId;
            if (this.applicationProcess) {
                processId = this.applicationProcess.id;
                processType = 'application';
            }
            else if (this.componentProcess) {
                processId = this.componentProcess.id;
                if (this.componentProcess.component) {
                    processType = 'component';
                }
                else {
                    processType = 'componentTemplate';
                }
            }
            self.cache = ["", ""];
            if (processType && processId) {
                xhr.get({
                    url: bootstrap.restUrl+"process/"+processType+"/"+processId+"/propContextPrefixes",
                    handleAs: "json",
                    load: function(data) {
                        if (data) {
                            self.cache[0] = data;
                        }
                    }
                });
                xhr.get({
                    url: bootstrap.restUrl+"process/"+processType+"/"+processId+"/propContext",
                    handleAs: "json",
                    load: function(data) {
                        if (data) {
                            self.cache[1] = data;
                        }
                    }
                });
            }
        },

        refreshStepPalette: function() {
            var self = this;
            if (self.stepTreeTable) {
                self.stepTreeTable.refresh();
            }
            else {
                console.log("Could not find the step palette.");
            }
        },

        /**
         * Shows a save confirmation box for 2 seconds after saving.
         *  @param message: The message to display.
         *  @param error: If the message is an error (Non-Save).
         */
        showSavePopup: function(message, error){
            var self = this;
            util.setCookie("processSaved", "true");
            util.setCookie("processSavedMessage", message);
            util.setCookie("processSavedError", error);
            domClass.remove(this.dialogAttach, "hide-notification");
            domClass.remove(this.dialogAttach, "show-notification");
            domClass.remove(this.dialogAttach, "process-saved");
            domClass.remove(this.dialogAttach, "process-error");
            var fullMessage = "";
            if ((error === true) || (error === "true")){
                fullMessage = '<div class="inline-block general-icon warning-icon-large"></div>' + util.escape(message);
                domClass.add(this.dialogAttach, "process-error");
            }
            else {
                fullMessage = '<div class="inline-block general-icon check-icon-large"></div>' + util.escape(message);
                domClass.add(this.dialogAttach, "process-saved");
            }
            this.dialogAttach.innerHTML = fullMessage;
            setTimeout(function(){
                if (self.dialogAttach){
                    domClass.add(self.dialogAttach, "hide-notification");
                    domClass.remove(self.dialogAttach, "show-notification");
                }
                util.setCookie("processSaved", "false");
            }, 2000);
            on(this.dialogAttach, mouse.enter, function(){
                if (self.dialogAttach){
                    domClass.add(self.dialogAttach, "hide-notification");
                    domClass.remove(self.dialogAttach, "show-notification");
                }
            });
        },
        
        /**
         * Show the appropriate message based on an error encountered when saving the process
         */
        showSaveErrorPopup: function(error) {
            if (error && error.response) {
                if (error.response.status === 409) {
                    var concurrentModificationAlert = new Alert({
                        message: i18n("Design not saved; this process has been modified since you " +
                                "last opened it. Refresh the page before making changes")
                    });
                }
                else if (error.response.text) {
                    var errorResponseAlert = new Alert({
                        messages: [i18n("An error occurred while saving the process design."),
                                   "",
                                   util.escape(error.response.text)]
                    });
                }
            }
            else {
                var errorAlert = new Alert({
                    message: i18n("An error occurred while saving the process design.")
                });
            }
        },

        /**
         * Formats an item for the step palette. If item.type is folder, we will show the entry
         * as a folder. Otherwise, it will be a step which can be dragged into the process.
         *
         * process: The process being edited. This value is passed along with the item into the
         *          activity creator functionality.
         */
        stepTreeFormatter: function(item, cellDomNode, process) {
            var self = this;
            var resultNode = domConstruct.create("div");
            var iconContainer = domConstruct.create("div", {
                className: "iconContainer inline-block"
            }, resultNode);
            if (cellDomNode && item.description){
                domAttr.set(cellDomNode, "title", i18n(item.description.escape()));
            }

            var processNameContainer = null;
            if (item.type === "folder") {
                domConstruct.create("div", {
                    "class": "inline-block process-icon process-folder-icon"
                }, iconContainer);

                processNameContainer = domConstruct.create("div", {
                    className: "processActivityName process-folder-cell"
                }, resultNode);
                domConstruct.create("div", {
                    className: "process-name-wrapper",
                    innerHTML: i18n(item.name)
                }, processNameContainer);
            } else {
                var icon = ProcessIconsFormatter.getIconForTree(item);
                domConstruct.place(icon, iconContainer);
                if (cellDomNode){
                    domClass.add(cellDomNode, "process-step-cell");
                }

                var stepNameLabel = "";
                if (item.copy && item.label) {
                    stepNameLabel = i18n(util.escape(item.label)).replace(/\n/g, "<br/>");
                }
                else {
                    stepNameLabel = i18n(util.escape(item.name));
                }

                processNameContainer = domConstruct.create("div", {
                    className: "processActivityName draggableProcessStepName"
                }, resultNode);
                domConstruct.create("div", {
                    className: "process-name-wrapper process-name-wrapper-draggable",
                    innerHTML: stepNameLabel
                }, processNameContainer);

                // Creates the image which is used as the sidebar icon (drag source)
                var img = icon;

                var releaseFunction = function(graph, evt, cell, x, y) {
                    // due to getCellDropTarget we ensure that
                    //cell will be either be
                    // 1: null to put on the main pallette
                    // 2: an container cell(like Run For Each Agent
                    var model = self.graph.getModel();
                    item.process = process;

                    model.beginUpdate();
                    if (item.copy && item.activity) {
                        self.activityCreator.addSavedActivity(lang.clone(item.activity), x, y, cell);
                    }
                    else {
                        self.activityCreator.addNewActivity(item, x, y, cell);
                    }
                    model.endUpdate();
                };

                mxUtils.makeDraggable(
                        cellDomNode,
                        self.graph,
                        releaseFunction,
                        img,
                        null,
                        null,
                        null,
                        null,
                        true,
                        self.getCellDropTarget);
            }

            if (item.copy) {
                var removeContainer = domConstruct.create("div", {
                    'class': 'closeStepIcon inline-block',
                    title: i18n("Delete"),
                    onclick: function(e) {
                        var removeConfirm = new GenericConfirm({
                            message: i18n("Are you sure you want to remove the step '%s' from your Clipboard?", item.label),
                            action: function() {
                                xhr.del({
                                    url: bootstrap.restUrl+"copiedStep/"+item.id,
                                    handleAs: "json",
                                    load: function(data) {
                                        self.stepTreeTable.refresh();
                                    },
                                    error: function(error) {
                                        var alert = new Alert({
                                            message: i18n("Error deleting copied step.")
                                        });
                                        alert.startup();
                                    }
                                });
                            }
                        });
                    }
                });
                var cellWrapper = query(".cellWrapper", cellDomNode);
                domClass.add(cellWrapper.length ? cellWrapper[0] : cellDomNode, "copied-step-cell");
                domConstruct.place(removeContainer, cellWrapper.length ? cellWrapper[0] : cellDomNode);
            }

            return resultNode;
        },

        /**
         * Get the lowest-level graph child. This fix is in place to protect against unusable
         * graphs caused by repeated application of 4.5 change #1.
         */
        getLowestGraphChild: function(activity) {
            var result = activity;

            array.forEach(activity.children, function(child) {
                if (child.type === "graph") {
                    result = child;
                }
            });

            if (result !== activity) {
                result = this.getLowestGraphChild(result);
            }

            return result;
        },

        /**
         * Given data loaded for the saved workflow, add all activities and edges back to the graph.
         */
        graphStartup: function(data) {
            var self = this;
            var parent = this.graph.getDefaultParent();
            var model = this.graph.getModel();

            if (data && data.children) {
                data = this.getLowestGraphChild(data);
            }

            model.beginUpdate();

            var startOffset = this.graph.container.offsetWidth/2-180;
            this.activityCreator.addSavedActivity({
                "type": "start"
            }, startOffset, 0);

            if (data && data.children) {
                array.forEach(data.children, function(child) {
                    var x = null;
                    var y = null;
                    var h = null;
                    var w = null;

                    var offset = util.getNamedProperty(data.offsets, child.name);
                    if (offset) {
                        x = offset.x + startOffset;
                        y = offset.y;

                        h = offset.h;
                        w = offset.w;
                    }
                    self.activityCreator.addSavedActivity(child, x, y, null, h, w);
                });

                var startCell = this.getStartCell();

                array.forEach(data.edges, function(edge) {
                    var from;
                    if (edge.from) {
                        from = model.filterCells(parent.children, function(cell) {
                            return (cell.activity && cell.activity.getName() === edge.from);
                        })[0];
                    }
                    else {
                        from = startCell;
                    }

                    var to;
                    if (edge.to) {
                        to = model.filterCells(parent.children, function(cell) {
                            return (cell.activity && cell.activity.getName() === edge.to);
                        })[0];
                    }

                    if (from && to) {
                        self.restoreEdge({
                            from: from,
                            to: to,
                            type: edge.type,
                            value: edge.value
                        });
                    }
                });
            }

            // Check for any existing finish cells...if none exist, auto-add one.
            var finishYOffset = 420;
            if(!(this.getFinishCells().length)) {
                this.activityCreator.addNewActivity({
                    "type": "finish"
                }, startOffset-5, finishYOffset);
            }
            model.endUpdate();

            document.hasChanges = false;
            this.initialized = true;
        },

        buildToolbar: function(){
            var self = this;

            // Create the toolbar window.
            var toolWindowContent = document.createElement('div');
            toolWindowContent.className = "toolbar-container";

            // -- Add buttons.
            var toolbar = new mxToolbar(toolWindowContent);
            toolbar.addItem(i18n("Zoom In"), bootstrap.imageUrl+'icons/blank18x18.png', function() {
                self.graph.zoomIn();
            }, null, "mxToolbarItem general-icon zoom-in-icon");
            toolbar.addItem(i18n("Zoom Out"), bootstrap.imageUrl+'icons/blank18x18.png', function() {
                self.graph.zoomOut();
            }, null, "mxToolbarItem general-icon zoom-out-icon");
            toolbar.addItem(i18n("Actual Size"), bootstrap.imageUrl+'icons/blank18x18.png', function() {
                self.graph.zoomActual();
            }, null, "mxToolbarItem general-icon zoom-actual-icon");
            toolbar.addItem(i18n("Print Preview"), bootstrap.imageUrl+'icons/blank18x18.png', function() {
                var printDialog = new Dialog({
                    title: i18n("Print Preview"),
                    closable: true,
                    draggable: true
                });

                var printFormatNormal = true;
                var printStyleNormal = true;
                var posterPages = 2;

                var printContainer = domConstruct.create("div", {}, printDialog.containerNode);

                // Create print format blocks.
                var printFormatContainer = domConstruct.create("div", {
                    className: "graph-print-container"
                }, printContainer);
                domConstruct.create("div", {
                    className: "graph-print-container-title",
                    innerHTML: i18n("Print Format")
                }, printFormatContainer);
                var normalPrint = domConstruct.create("div", {
                    className: "inline-block graph-print-format-container selected-print-option"
                }, printFormatContainer);
                domConstruct.create("div", {className: "normal-print-block"}, normalPrint);
                domConstruct.create("div", {
                    innerHTML: i18n("Normal"),
                    className: "graph-print-container-subtitle"
                }, normalPrint);

                var posterPrint = domConstruct.create("div", {
                    className: "inline-block graph-print-format-container"
                }, printFormatContainer);
                var posterPrintBlock = domConstruct.create("div", {className: "poster-print-block-container"}, posterPrint);
                domConstruct.create("div", {className: "inline-block poster-print-block poster-print-block-left"}, posterPrintBlock);
                domConstruct.create("div", {className: "inline-block poster-print-block"}, posterPrintBlock);
                domConstruct.create("div", {className: "inline-block poster-print-block poster-print-block-left"}, posterPrintBlock);
                domConstruct.create("div", {className: "inline-block poster-print-block"}, posterPrintBlock);
                domConstruct.create("div", {
                    innerHTML: i18n("Poster"),
                    className: "graph-print-container-subtitle"
                }, posterPrint);

                var numberOfPagesContainer = domConstruct.create("div", {
                    className: "hidden"
                }, printFormatContainer);
                domConstruct.create("div", {
                    innerHTML: i18n("Number of pages"),
                    className: "graph-print-poster-pages-title"
                }, numberOfPagesContainer);
                var numberOfPages = new NumberSpinner({
                    value: 2,
                    constraints: { min:1, max:100, places:0 },
                    focused: false,
                    onChange: function(value){
                        posterPages = value;
                        if (value && value > 100){
                            value = 2;
                        }
                    }
                }).placeAt(numberOfPagesContainer);
                on(normalPrint, "click", function(){
                    domClass.remove(posterPrint, "selected-print-option");
                    domClass.add(numberOfPagesContainer, "hidden");
                    domClass.add(normalPrint, "selected-print-option");
                    printFormatNormal = true;
                });
                on(posterPrint, "click", function(){
                    domClass.remove(normalPrint, "selected-print-option");
                    domClass.remove(numberOfPagesContainer, "hidden");
                    domClass.add(posterPrint, "selected-print-option");
                    printFormatNormal = false;
                });

                // Create print style blocks.
                var printStyleContainer = domConstruct.create("div", {
                    className: "graph-print-container"
                }, printContainer);
                domConstruct.create("div", {
                    className: "graph-print-container-title",
                    innerHTML: i18n("Graph Style")
                }, printStyleContainer);
                var normalStyle = domConstruct.create("div", {
                    className: "inline-block graph-print-style-container selected-print-option"
                }, printStyleContainer);
                var normalBlock = domConstruct.create("div", {className: "normal-print-style-block"}, normalStyle);
                domConstruct.create("div", {
                    className: "graph-print-style-container-image"
                }, normalBlock);
                domConstruct.create("div", {
                    innerHTML: i18n("Shaded"),
                    className: "graph-print-style-container-subtitle"
                }, normalBlock);

                var outlineStyle = domConstruct.create("div", {
                    className: "inline-block graph-print-style-container"
                }, printStyleContainer);
                var outlineBlock = domConstruct.create("div", {className: "outline-print-style-block"}, outlineStyle);
                domConstruct.create("div", {
                    className: "graph-print-style-container-image-dark"
                }, outlineBlock);
                domConstruct.create("div", {
                    innerHTML: i18n("Outline"),
                    className: "graph-print-style-container-subtitle"
                }, outlineBlock);

                on(normalStyle, "click", function(){
                    domClass.remove(outlineStyle, "selected-print-option");
                    domClass.add(normalStyle, "selected-print-option");
                    printStyleNormal = true;
                });
                on(outlineStyle, "click", function(){
                    domClass.remove(normalStyle, "selected-print-option");
                    domClass.add(outlineStyle, "selected-print-option");
                    printStyleNormal = false;
                });

                var printOverlays = true;
                var overlayCheckBoxContainer = domConstruct.create("div", {}, printStyleContainer);
                var overlayCheckBox = new CheckBox({
                    value: true,
                    checked: true,
                    onChange: function(value){
                        printOverlays = value;
                    }
                }).placeAt(overlayCheckBoxContainer);
                domConstruct.create("label", {
                    innerHTML: i18n("Show Overlays"),
                    "for": overlayCheckBox.id
                }, overlayCheckBoxContainer);

                var printConfirmContainer = domConstruct.create("div", {
                    className: "graph-print-buttons-container"
                }, printContainer);

                var previewButton = new Button({
                    label: i18n("Preview"),
                    onClick: function(){
                        printDialog.hide();

                        var activityCellsToChange = [];
                        var utilityCellsToChange = [];
                        var noteCellsToChange = [];
                        var parallelCellsToChange = [];
                        var switchCellsToChange = [];
                        var cells = null;

                        if (!printStyleNormal && self.graph && self.graph.model && self.graph.model.cells){
                            cells = self.graph.model.cells;
                            var key = null;
                            for (key in cells) {
                                if (cells.hasOwnProperty(key)){
                                   var cell = cells[key];
                                   if (cell.activity && cell.style){
                                       var style = cell.style;
                                       if (style.indexOf("shape") === 0){
                                           if (style.indexOf(".png") !== -1){
                                               style = style.replace(".png", "-dark.png");
                                               cell.setStyle(style);
                                           }
                                           if (style.indexOf("fillColor=#00649D") !== -1){
                                               switchCellsToChange.push(cell);
                                           }
                                           else {
                                               activityCellsToChange.push(cell);
                                           }
                                       }
                                       else if (style.indexOf("utilityStyle") === 0) {
                                           utilityCellsToChange.push(cell);
                                       }
                                       else if (style.indexOf("noteStyle") === 0) {
                                           noteCellsToChange.push(cell);
                                       }
                                       else if (style.indexOf("parallelStyle") === 0) {
                                           parallelCellsToChange.push(cell);
                                       }
                                       
                                   }
                                }
                            }
                            if (activityCellsToChange && activityCellsToChange.length > 0){
                                mxUtils.setCellStyles(self.graph.model, activityCellsToChange, "fillColor", "#FFF");
                                mxUtils.setCellStyles(self.graph.model, activityCellsToChange, "strokeColor", "#3B0256");
                                mxUtils.setCellStyles(self.graph.model, activityCellsToChange, "fontColor", "#222");
                            }
                            if (utilityCellsToChange && utilityCellsToChange.length > 0){
                                mxUtils.setCellStyles(self.graph.model, utilityCellsToChange, "fillColor", "#FFF");
                                mxUtils.setCellStyles(self.graph.model, utilityCellsToChange, "strokeColor", "#222");
                                mxUtils.setCellStyles(self.graph.model, utilityCellsToChange, "fontColor", "#222");
                                mxUtils.setCellStyles(self.graph.model, utilityCellsToChange, "fontSize", "16");
                            }
                            if (noteCellsToChange && noteCellsToChange.length > 0){
                                mxUtils.setCellStyles(self.graph.model, noteCellsToChange, "fillColor", "#EEE");
                                mxUtils.setCellStyles(self.graph.model, noteCellsToChange, "strokeColor", "#AAA");
                                mxUtils.setCellStyles(self.graph.model, noteCellsToChange, "shadow", "1");
                            }
                            if (parallelCellsToChange && parallelCellsToChange.length > 0){
                                mxUtils.setCellStyles(self.graph.model, parallelCellsToChange, "fillColor", "#EEE");
                                mxUtils.setCellStyles(self.graph.model, parallelCellsToChange, "strokeColor", "#888");
                                mxUtils.setCellStyles(self.graph.model, parallelCellsToChange, "fontColor", "#222");
                            }
                            if (switchCellsToChange && switchCellsToChange.length > 0){
                                mxUtils.setCellStyles(self.graph.model, switchCellsToChange, "fillColor", "#F0F0F0");
                                mxUtils.setCellStyles(self.graph.model, switchCellsToChange, "strokeColor", "#888");
                                mxUtils.setCellStyles(self.graph.model, switchCellsToChange, "fontColor", "#222");
                            }
                        }

                        var title = i18n("Printer-friendly version");
                        if (printFormatNormal){
                            var preview = new mxPrintPreview(self.graph, 1, null, null, null, null, null, title, null);
                            preview.printOverlays = printOverlays;
                            preview.open();
                        }
                        else {
                            title = i18n("Poster Printer-friendly version");
                            var scale = mxUtils.getScaleForPageCount(posterPages, self.graph);
                            var posterPreview = new mxPrintPreview(self.graph, scale, null, null, null, null, null, title, null);
                            posterPreview.printOverlays = printOverlays;
                            posterPreview.open();
                        }

                        if (activityCellsToChange && activityCellsToChange.length > 0){
                            array.forEach(activityCellsToChange, function(cell){
                               var cellStyle = cell.style;
                               if (cellStyle.indexOf("-dark.png") !== -1){
                                   cellStyle = cellStyle.replace("-dark.png", ".png");
                                   cell.setStyle(cellStyle);
                               }
                            });
                            mxUtils.setCellStyles(self.graph.model, activityCellsToChange, "fillColor", "#7F1C7D");
                            mxUtils.setCellStyles(self.graph.model, activityCellsToChange, "strokeColor", "#FFF");
                            mxUtils.setCellStyles(self.graph.model, activityCellsToChange, "fontColor", "#FFF");
                        }
                        if (utilityCellsToChange && utilityCellsToChange.length > 0){
                            mxUtils.setCellStyles(self.graph.model, utilityCellsToChange, "fillColor", "#888");
                            mxUtils.setCellStyles(self.graph.model, utilityCellsToChange, "strokeColor", "#FFF");
                            mxUtils.setCellStyles(self.graph.model, utilityCellsToChange, "fontColor", "#FFF");
                            mxUtils.setCellStyles(self.graph.model, utilityCellsToChange, "fontSize", "14");
                        }
                        if (noteCellsToChange && noteCellsToChange.length > 0){
                            mxUtils.setCellStyles(self.graph.model, noteCellsToChange, "fillColor", "#FDB813");
                            mxUtils.setCellStyles(self.graph.model, noteCellsToChange, "strokeColor", "#FFF");
                            mxUtils.setCellStyles(self.graph.model, noteCellsToChange, "shadow", "0");
                        }
                        if (parallelCellsToChange && parallelCellsToChange.length > 0){
                            mxUtils.setCellStyles(self.graph.model, parallelCellsToChange, "fillColor", "#82D1F5");
                            mxUtils.setCellStyles(self.graph.model, parallelCellsToChange, "strokeColor", "#00B2EF");
                            mxUtils.setCellStyles(self.graph.model, parallelCellsToChange, "fontColor", "#222");
                        }
                        if (switchCellsToChange && switchCellsToChange.length > 0){
                            array.forEach(switchCellsToChange, function(cell){
                                var switchCellStyle = cell.style;
                                if (switchCellStyle.indexOf("-dark.png") !== -1){
                                    switchCellStyle = switchCellStyle.replace("-dark.png", ".png");
                                    cell.setStyle(switchCellStyle);
                                }
                             });
                            mxUtils.setCellStyles(self.graph.model, switchCellsToChange, "fillColor", "#00649D");
                            mxUtils.setCellStyles(self.graph.model, switchCellsToChange, "strokeColor", "#FFF");
                            mxUtils.setCellStyles(self.graph.model, switchCellsToChange, "fontColor", "#FFF");
                        }
                    }
                }).placeAt(printConfirmContainer);
                var cancelButton = new Button({
                    label: i18n("Cancel"),
                    onClick: function(){
                        printDialog.hide();
                    }
                }).placeAt(printConfirmContainer);
                domClass.add(previewButton.domNode, "idxButtonSpecial");
                printDialog.show();
            }, null, "mxToolbarItem general-icon print-icon");

            if (!this.readOnly) {
                this.saveButton = toolbar.addItem(i18n("Save"), bootstrap.imageUrl+'icons/blank18x18.png', function() {
                    if (!document.hasChanges) {
                        self.showSavePopup(i18n("No changes have been made."), true);
                    }
                    else if (self.getFinishCells().length === 0) {
                        var noChangesAlert = new Alert({
                            message: i18n("This process has no 'Finish' step. Processes must end in a finish step to execute successfully.")
                        });
                    }
                    else if (config.data.systemConfiguration.requiresCommitComment) {
                        //create new dialog with comment area - save upon submit
                        var commentDialog = new Dialog({
                           title: i18n("Process Change Comment"),
                           closable: true
                        });
                        var commentForm = new RequiredCommentForm({
                            callback: function(data) {
                                if (data) {
                                    self.saveProcessDesign(data.comment);
                                }
                                commentDialog.hide();
                                commentDialog.destroy();
                            }
                        });
                        commentForm.placeAt(commentDialog);
                        commentDialog.show();
                    }
                    else {
                        self.saveProcessDesign();
                    }
                }, null, "mxToolbarItem general-icon save-icon");
                toolbar.addItem(i18n("Discard Changes"), bootstrap.imageUrl+'icons/blank18x18.png', function() {
                    var discardConfirm = new GenericConfirm({
                        message: i18n("Discard all changes and revert the graph to its last saved state?"),
                        action: function() {
                            location.reload(true);
                        }
                    });
                }, null, "mxToolbarItem general-icon discard-changes-icon");
            }

            // -- Set up window object.
            var toolWindow = new mxWindow(i18n("Tools"), toolWindowContent, 0, 0, 240, 40, false, false, this.toolbarAttach, "tool-palette mxWindow");
            toolWindow.setMaximizable(false);
            toolWindow.setScrollable(false);
            toolWindow.setResizable(false);
            toolWindow.setVisible(true);
        },

        /*
         * args = {from, to, type, value}
         */
        restoreEdge: function(edgeArgs) {
            var self = this;
            var parent = this.graph.getDefaultParent();
            var startCell = this.getStartCell();

            var from = edgeArgs.from;
            var to = edgeArgs.to;
            var type = edgeArgs.type;
            var value = edgeArgs.value;

            var newEdge = self.graph.insertEdge(parent, null, null, from, to);

            if (from.activity && from.activity.data.type === "switch") {
                newEdge.data.value = value;
                var edgeValue = newEdge.data.value || i18n("Default");
                self.graph.labelChanged(newEdge, edgeValue);
                if (!value){
                    self.graph.setDefaultEdge(newEdge, true);
                }
                else {
                    self.graph.setDefaultEdge(newEdge);
                }
            }
            else if (!from.activity || from.activity.data.type !== "start") {
                if (type === "FAILURE") {
                    self.edgeManager.addErrorOverlay(newEdge);
                }
                else if (type === "ALWAYS") {
                    self.edgeManager.addAlwaysOverlay(newEdge);
                }
            }
            return newEdge;
        },

        getFinishCells: function() {
            var model = this.graph.getModel();

            return model.filterDescendants(function(cell) {
                var result = false;
                if (cell.activity && cell.activity.data && cell.activity.data.type === "finish") {
                    result = true;
                }
                return result;
            });
        },

        /**
         *
         */
        getWorkflowJson: function() {
            var self = this;

            var parent = this.graph.getDefaultParent();

            var startCell = this.getStartCell();
            var startCellGeometry = this.graph.getCellGeometry(startCell);
            var startX = startCellGeometry.x;
            var startY = startCellGeometry.y;

            var result = this.getGraphJson(parent, startX, startY);

            return result;
        },

        /**
         * Create raw data about the current state of the graph to submit back to the server as JSON
         */
        getGraphJson: function(parent, xOffset, yOffset) {
            var self = this;

            var result = {
                type: "graph",
                children: [],
                edges: [],
                offsets: []
            };

            // If this is a user-inserted container cell, we need to track where to position its
            // 'start' activity.
            if (parent.activity) {
                var startCell = self.getStartCell(parent);
                if (startCell) {
                    var startGeometry = self.graph.getCellGeometry(startCell);

                    result.startX = startGeometry.x - xOffset;
                    result.startY = startGeometry.y - yOffset;
                }
            }

            array.forEach(parent.children, function(child) {
                if (child.edge) {
                    var edge = {};
                    if (child.source.activity && !child.source.activity.isUtilityCell()) {
                        edge.from = child.source.activity.getName();
                    }
                    if (child.target.activity && !child.target.activity.isUtilityCell()) {
                        edge.to = child.target.activity.getName();
                    }
                    edge.type = child.data.type;
                    edge.value = child.data.value;

                    result.edges.push(edge);
                }
                else {
                    if (child.activity && !child.activity.isUtilityCell()) {
                        var childGeometry = self.graph.getCellGeometry(child);
                        var childXOffset = childGeometry.x - xOffset;
                        var childYOffset = childGeometry.y - yOffset;
                        var childHeight = childGeometry.height;
                        var childWidth = childGeometry.width;

                        result.children.push(child.activity.data);

                        var childOffset = {
                            name: child.activity.getName(),
                            x: childXOffset,
                            y: childYOffset,
                            h: childHeight,
                            w: childWidth
                        };
                        result.offsets.push(childOffset);

                        if (child.activity.isContainer) {
                            child.activity.data.children = [self.getGraphJson(child, 0, 0)];
                        }
                    }
                }
            });

            return result;
        },

        /**
         * Search all children of the given parent to identify which child is the "start" cell.
         */
        getStartCell: function(parent) {
            if (!parent) {
                parent = this.graph.getDefaultParent();
            }

            var startCell = null;
            array.forEach(parent.children, function(child) {
                if (child.activity && child.activity.data.type === "start") {
                    startCell = child;
                }
            });

            return startCell;
        },

        /**
         * Recursively find any activities in this graph with the given name and return them.
         * Calls into this function should only pass the "name" parameter. Cell and activityData are
         * for recursive calls back into this function.
         * 
         * Returns an array of objects with:
         *  {
         *      cell: Graph cell object containing the activity (or one of the activity's ancestors)
         *      activity: JSONObject representing the activity with the given name
         *  }
         */
        getChildrenByName: function(name, cell, activityData) {
            var self = this;
            var result = [];

            if (activityData) {
                // This call is scoped to a specific activity within a cell. Check its name and then
                // recursively check its children.
                if (activityData.name && activityData.name === name) {
                    result.push({cell: cell, activity: activityData});
                }
                array.forEach(activityData.children, function(child) {
                    if (child && !cell.activity.isContainer) {
                        result = result.concat(self.getChildrenByName(name, cell, child));
                    }
                });
            }
            else {
                // Top-level call into this function - find all cells with activity data and
                // recursively call into them and their children.
                var model = this.graph.getModel();
                var allCells = model.filterDescendants(function(cell) {
                    return (cell.activity && cell.activity.data);
                });

                array.forEach(allCells, function(cell) {
                    result = result.concat(self.getChildrenByName(name, cell, cell.activity.data));
                });
            }

            return result;
        },

        graphHasChanges: function() {
            document.hasChanges = true;
            if (this.saveButton){
                domClass.add(this.saveButton, "save-icon-pending-changes");
            }
        },

        clearHasChanges: function() {
            document.hasChanges = false;
            if (this.saveButton){
                domClass.remove(this.saveButton, "save-icon-pending-changes");
            }
        },

        registerChangedActivity: function(activity) {
            var self = this;
            if (!self._editedActivities) {
                self._editedActivities = [];
            }
            if (activity.data.id) {
                self._editedActivities.push(activity.data.id);
            }
        },

        isActivityChanged: function(activity) {
            var self = this;
            var result = true;
            if (activity.data.id) {
                if (!self._editedActivities) {
                    self._editedActivities = [];
                }
                result = array.indexOf(self._editedActivities, activity.data.id) !== -1;
            }
            return result;
        },

        clearChangedActivities: function() {
            var self = this;
            self._editedActivities = [];
        },

        //==========================================================================================
        // General graph configuration and styling
        //==========================================================================================

        /**
         *
         */
        configureGraph: function() {
            var self = this;

            this.graph.ordered = true;
            this.graph.setAllowLoops(false);
            this.graph.setConnectable(true);
            this.graph.setDropEnabled(true);
            this.graph.setPanning(true);
            this.graph.panningHandler.useLeftButtonForPanning = true;
            this.graph.setTooltips(true);
            this.graph.foldingEnabled = true;
            this.graph.graphHandler.guidesEnabled = true;
            this.graph.setAutoSizeCells(true);
            mxGraph.prototype.setCellsEditable(false);

            this.graph.connectionHandler.connectImage = new mxImage(bootstrap.imageUrl+"icons/process/step_connector.png", 16, 16);

            // Pre-fetches connect image
            var img = new Image();
            img.src = this.graph.connectionHandler.connectImage.src;

            this.graph.isValidDropTarget = function(cell, cells, evt) {
                return cell.activity && cell.activity.isContainer;
            };

            this.graph.setDefaultEdge = function(cell, isDefault){
                var color = isDefault ? "#00A6A0" : "#00649D";
                mxUtils.setCellStyles(self.graph.model, [cell], "fontColor", color);
                mxUtils.setCellStyles(self.graph.model, [cell], "labelBorderColor", color);
                mxUtils.setCellStyles(self.graph.model, [cell], "strokeColor", color);
            };

            this.graph.setEdgeState = function(cell, failed){
                var color = failed ? "#D9182D" : null;
                if (failed === "always"){
                    color = "#777";
                }
                mxUtils.setCellStyles(self.graph.model, [cell], "strokeColor", color);
            };

            this.graph.getTooltipForCell = function(cell){
                return cell.tooltip || "";
            };

            this.graph.createEdge = function(parent, id, value, source, target, style) {
                if (target) {
                    var hasEdge = false;

                    // No-op if there is already an edge directly between the two in either direction
                    array.forEach(source.edges, function(edge) {
                        if ((edge.source === source && edge.target === target)
                                || (edge.source === target && edge.target === source)) {
                            hasEdge = true;
                        }
                    });

                    if (!hasEdge) {
                        self.graphHasChanges();
                        var result = mxGraph.prototype.createEdge(arguments);
                        self.edgeManager.addEdgeOverlays(result, source);

                        if (self.initialized) {
                            self.graphHasChanges();
                        }

                        return result;
                    }
                }
            };

            this.graph.splitEdge = function (edge, cells, newEdge, dx, dy) {
                var cell = cells[0];

                //Don't split if cell already has edges
                if (cell && !this.model.getEdgeCount(cell) && cell.value !== "Finish") {
                    dx = dx || 0;
                    dy = dy || 0;

                    if (dx === 0 && dy === 0) {
                        //Offset dx and dy to center cell on edge
                        var height = cell.geometry.height || 0;
                        var width = cell.geometry.width || 0;

                        dx -= width/2;
                        dy -= height/2;
                    }

                    var parent = self.graph.getDefaultParent();
                    var source = this.model.getTerminal(edge, true);
                    var target = this.model.getTerminal(edge, false);

                    this.model.beginUpdate();
                    try {
                        newEdge = self.graph.connectionHandler.connect(cell, target, null, cell);
                        this.cellsMoved(cells, dx, dy, false, false);
                        this.cellsAdded(cells, parent, this.model.getChildCount(parent), null, null, true);
                        this.cellsAdded([newEdge], parent, this.model.getChildCount(parent), source, cell, false);
                        this.cellConnected(edge, cell, false);
                        this.fireEvent(new mxEventObject(mxEvent.SPLIT_EDGE, 'edge', edge, 'cells', cells, 'newEdge', newEdge, 'dx', dx, 'dy', dy));
                    }
                    finally {
                        this.model.endUpdate();
                    }
                    return newEdge;
                }
            };

            /**
             * On moving any cell, if the parent has changed, remove all edges from the cell. This
             * prevents users from having arrows from one step to a step inside a container, which
             * would break our graph workflow handling.
             */
            this.graph.addListener(mxEvent.MOVE_CELLS, function(sender, event) {
                var movedCells = event.properties.cells;
                var target = event.properties.target;

                array.forEach(movedCells, function(cell) {
                    var edgesToDelete = [];
                    array.forEach(cell.edges, function(edge) {
                        if (edge.source.parent !== edge.target.parent) {
                            edgesToDelete.push(edge);
                        }
                    });

                    if (edgesToDelete.length > 0) {
                        self.graph.removeCells(edgesToDelete);
                    }
                });
            });

            this.graph.isHtmlLabel = function(cell){
                if (!!cell.htmlLabels) {
                    return cell.htmlLabels;
                }
                return false;
            };

            /**
             * Default behavior for mxGraph is that resizing a parent maintains the relative position
             * of all of the parent's children (so it's impossible to just resize to add extra space
             * at the top or left side of a cell). This function override will cause the children to
             * be moved to the same place on the page where they were prior to the resize.
             */
            this.graph.oldCellsResized = this.graph.cellsResized;
            this.graph.cellsResized = function(cells, bounds) {
                // Gather the existing positions of all children of the cell being resized.
                var oldChildCoords = [];
                array.forEach(cells, function(cell) {
                    array.forEach(cell.children, function(child) {
                        if (!child.edge) {
                            oldChildCoords.push({
                                child: child,
                                parent: cell,
                                x: cell.geometry.x+child.geometry.x,
                                y: cell.geometry.y+child.geometry.y
                            });
                        }
                    });
                });

                self.graph.oldCellsResized(cells, bounds);

                // Check all children to make sure they still fit in the resized parent. For any
                // which don't fit, resize the parent to continue to fit them.
                array.forEach(oldChildCoords, function(childCoords) {
                    var child = childCoords.child;
                    var parent = childCoords.parent;
                    var oldX = childCoords.x;
                    var oldY = childCoords.y;

                    if (oldX < parent.geometry.x) {
                        parent.geometry.width += (parent.geometry.x-oldX);
                        parent.geometry.x = oldX;
                    }
                    if (oldY < parent.geometry.y) {
                        parent.geometry.height += (parent.geometry.y-oldY);
                        parent.geometry.y = oldY;
                    }
                });

                // Reset all child cell positions so that they fit the parent.
                array.forEach(oldChildCoords, function(childCoords) {
                    var child = childCoords.child;
                    var parent = childCoords.parent;
                    var oldX = childCoords.x;
                    var oldY = childCoords.y;

                    var newX = parent.geometry.x+child.geometry.x;
                    var newY = parent.geometry.y+child.geometry.y;

                    if (newX !== oldX || newY !== oldY) {
                        child.geometry.x = oldX-parent.geometry.x;
                        child.geometry.y = oldY-parent.geometry.y;
                    }

                    self.graph.extendParent(child);
                });
            };

            this.graph.addListener(mxEvent.CELLS_RESIZED, function(sender, event) {
                if (!self.readOnly) {
                    self.graphHasChanges();
                }
            });

            this.graph.addListener(mxEvent.CELLS_MOVED, function(sender, event) {
                if (!self.readOnly) {
                    self.graphHasChanges();
                }
            });

            this.graph.isCellSelectable = function(cell) {
                return !cell.edge;
            };

            this.graph.connectionHandler.isValidSource = function(cell) {
                var result = self.graph.isValidSource(cell);
                if (cell.activity && ((cell.activity.data.type === "finish") || cell.activity.data.type === "note")) {
                    result = false;
                }
                return result;
            };

            this.graph.connectionHandler.isValidTarget = function(cell) {
                var result = self.graph.isValidTarget(cell);
                if (cell.activity && ((cell.activity.data.type === "start") || cell.activity.data.type === "note")) {
                    result = false;
                }

                return result;
            };

            // Prevent connections from activities in different parents
            this.graph.isValidConnection = function(source, target) {
                return source.parent === target.parent;
            };


            // Override the shape initializer so we put easily locatable IDs on the nodes for tests
            var oldInitializeShape = this.graph.cellRenderer.initializeShape;
            this.graph.cellRenderer.initializeShape = function(state) {
                oldInitializeShape.apply(this, arguments);

                // Put an ID on the DOM node for this shape which contains the cell ID
                if (state.shape.node && state.cell && state.cell.id) {
                    state.shape.node.setAttribute("id", "shape-"+state.cell.id);
                }
            };

            // Override the label initializer so we put easily locatable IDs on the nodes for tests
            var oldInitializeLabel = this.graph.cellRenderer.initializeLabel;
            this.graph.cellRenderer.initializeLabel = function(state) {
                oldInitializeLabel.apply(this, arguments);

                // Put an ID on the DOM node for this label which contains the cell ID
                if (state.text.node && state.cell && state.cell.id) {
                    state.text.node.setAttribute("id", "label-"+state.cell.id);
                }
            };

            // Override the overlay initializer so we put easily locatable IDs on the nodes for tests
            var oldInitializeOverlay = this.graph.cellRenderer.initializeOverlay;
            this.graph.cellRenderer.initializeOverlay = function(state, shape) {
                oldInitializeOverlay.apply(this, arguments);

                // Put an ID on the DOM node for this overlay which contains the cell ID as well as
                // the filename being used for the overlay, so we can easily locate a particular
                // icon for a particular cell ID.
                if (shape.image && shape.node && state.cell && state.cell.id) {
                    var imageUrl = shape.image;
                    var urlParts = imageUrl.split("/");
                    var imageFilename = urlParts[urlParts.length-1];
                    if (imageFilename.indexOf(".") > 0) {
                        imageFilename = imageFilename.split(".")[0];

                        shape.node.setAttribute("id", "overlay-"+state.cell.id+"-"+imageFilename);
                    }
                }
            };
        },

        /**
         * Get valid targets to drop a cell on, ignoring any cells which aren't containers.
         */
        getCellDropTarget: function(graph, x, y) {
            var cell = graph.getCellAt(x, y);

            var result = null;
            if (cell && cell.isVertex()) {
                // Only let users drop onto cells which are set
                // as containers.
                if (cell.activity && cell.activity.isContainer) {
                    result = cell;
                }
            }
            else {
                // For edges, we don't care what it is, they
                // can always be drop targets.
                result = cell;
            }
            return result;
        },

        /**
         * Set standard graph object styles.
         */
        setGraphStyling: function() {
            // Edges

            // -- Default edge style
            var defaultEdgeStyle = this.graph.getStylesheet().getDefaultEdgeStyle();
            defaultEdgeStyle[mxConstants.STYLE_STROKEWIDTH] = 2;
            defaultEdgeStyle[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = "#FFFFFF";
            defaultEdgeStyle[mxConstants.STYLE_LABEL_PADDING] = 4;
            defaultEdgeStyle[mxConstants.STYLE_STROKECOLOR] = "#3B0256";
            defaultEdgeStyle[mxConstants.STYLE_LABEL_BORDERCOLOR] = "#7F1C7D";
            defaultEdgeStyle[mxConstants.STYLE_FONTCOLOR] = "#7F1C7D";
            defaultEdgeStyle[mxConstants.STYLE_FONTSIZE] = '12';
            defaultEdgeStyle[mxConstants.STYLE_SPACING_TOP] = 15;
            defaultEdgeStyle[mxConstants.STYLE_MOVABLE] = 0;

            mxConstants.VALID_COLOR = "#00B2EF";
            mxConstants.HIGHLIGHT_COLOR = "#00B2EF";
            mxConstants.TARGET_HIGHLIGHT_COLOR = "#00B2EF";
            mxConstants.OUTLINE_STROKEWIDTH =  0;
            mxConstants.INVALID_COLOR = "#F04E37";
            mxConstants.OUTLINE_HANDLE_FILLCOLOR = "#00B2EF";
            mxConstants.OUTLINE_HANDLE_STROKECOLOR = "#00B2EF";
            mxConstants.VERTEX_SELECTION_STROKEWIDTH = 2;

            // -- Edge with no ending arrow
            var noArrowEdgeStyle = {};
            noArrowEdgeStyle[mxConstants.STYLE_ENDARROW] = undefined;
            this.graph.getStylesheet().putCellStyle('noArrowEdgeStyle', noArrowEdgeStyle);

            // Vertices
            // -- Default vertex style
            var defaultVertexStyle = this.graph.getStylesheet().getDefaultVertexStyle();
            defaultVertexStyle[mxConstants.STYLE_SPACING] = 8;
            defaultVertexStyle[mxConstants.STYLE_FONTCOLOR] = '#000000';
            defaultVertexStyle[mxConstants.VERTEX_HIGHLIGHT_COLOR] = '#000000';

            // -- Add point styling (a "plus" image)
            var plusStyle = {};
            plusStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
            plusStyle[mxConstants.STYLE_IMAGE] = bootstrap.imageUrl+'/mxgraph/add.png';
            plusStyle[mxConstants.STYLE_IMAGE_WIDTH] = '16';
            plusStyle[mxConstants.STYLE_IMAGE_HEIGHT] = '16';
            this.graph.getStylesheet().putCellStyle('plusStyle', plusStyle);

            // -- Top level container
            var topContainerStyle = {};
            topContainerStyle[mxConstants.STYLE_SHAPE] = 'rectangle';
            topContainerStyle[mxConstants.STYLE_STROKECOLOR] = '#ffffff';
            topContainerStyle[mxConstants.STYLE_FILLCOLOR] = '#ffffff';
            this.graph.getStylesheet().putCellStyle('topContainerStyle', topContainerStyle);

            // -- Sequential activity containers
            var sequenceStyle = {};
            sequenceStyle[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
            sequenceStyle[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_RIGHT;
            sequenceStyle[mxConstants.STYLE_SPACING_TOP] = -7;
            sequenceStyle[mxConstants.STYLE_SPACING_RIGHT] = -3;
            sequenceStyle[mxConstants.STYLE_SPACING_LEFT] = 15;
            sequenceStyle[mxConstants.STYLE_FONTSIZE] = '12';
            sequenceStyle[mxConstants.STYLE_FONTFAMILY] = "helvetica, arial, tahoma, verdana, sans-serif, 'lucida grande'";
            sequenceStyle[mxConstants.STYLE_SHAPE] = 'rectangle';
            sequenceStyle[mxConstants.STYLE_GRADIENTCOLOR] = '#ddddff';
            sequenceStyle[mxConstants.STYLE_STROKECOLOR] = '#bbc6ff';
            sequenceStyle[mxConstants.STYLE_FILLCOLOR] = '#eeeeff';
            this.graph.getStylesheet().putCellStyle('sequenceStyle', sequenceStyle);

            // -- Iteration activity containers
            var iterationStyle = {};
            iterationStyle[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
            iterationStyle[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_LEFT;
            iterationStyle[mxConstants.STYLE_SPACING_TOP] = -7;
            iterationStyle[mxConstants.STYLE_SPACING_RIGHT] = -3;
            iterationStyle[mxConstants.STYLE_SPACING_LEFT] = 5;
            iterationStyle[mxConstants.STYLE_FONTSIZE] = '12';
            iterationStyle[mxConstants.STYLE_FONTFAMILY] = "helvetica, arial, tahoma, verdana, sans-serif, 'lucida grande'";
            iterationStyle[mxConstants.STYLE_SHAPE] = 'rectangle';
            iterationStyle[mxConstants.STYLE_GRADIENTCOLOR] = '#ffdddd';
            iterationStyle[mxConstants.STYLE_STROKECOLOR] = '#ffbbc6';
            iterationStyle[mxConstants.STYLE_FILLCOLOR] = '#ffeeee';
            this.graph.getStylesheet().putCellStyle('iterationStyle', iterationStyle);

            // -- Parallel activity containers
            var parallelStyle = {};
            parallelStyle[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
            parallelStyle[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_LEFT;
            parallelStyle[mxConstants.STYLE_SPACING_TOP] = -5;
            parallelStyle[mxConstants.STYLE_SPACING_RIGHT] = -3;
            parallelStyle[mxConstants.STYLE_SPACING_LEFT] = 15;
            parallelStyle[mxConstants.STYLE_FONTSIZE] = '14';
            parallelStyle[mxConstants.STYLE_FONTFAMILY] = "helvetica, arial, tahoma, verdana, sans-serif, 'lucida grande'";
            parallelStyle[mxConstants.STYLE_SHAPE] = 'rectangle';
            parallelStyle[mxConstants.STYLE_FILLCOLOR] = '#82D1F5';
            parallelStyle[mxConstants.STYLE_STROKEWIDTH] = '2';
            parallelStyle[mxConstants.STYLE_STROKECOLOR] = '#00B2EF';
            this.graph.getStylesheet().putCellStyle('parallelStyle', parallelStyle);

            // -- Utility (e.g. start/stop) activities
            var utilityStyle = {};
            utilityStyle[mxConstants.STYLE_SHAPE] = 'label';
            utilityStyle[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
            utilityStyle[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
            utilityStyle[mxConstants.STYLE_SPACING_LEFT] = 15;
            utilityStyle[mxConstants.STYLE_SPACING_TOP] = 5;
            utilityStyle[mxConstants.STYLE_SPACING_BOTTOM] = 5;
            utilityStyle[mxConstants.STYLE_SPACING_RIGHT] = 15;
            utilityStyle[mxConstants.STYLE_STROKEWIDTH] = '2';
            utilityStyle[mxConstants.STYLE_STROKECOLOR] = '#FFF';
            utilityStyle[mxConstants.STYLE_FILLCOLOR] = '#888';
            utilityStyle[mxConstants.STYLE_FONTFAMILY] = "helvetica, arial, tahoma, verdana, sans-serif, 'lucida grande'";
            utilityStyle[mxConstants.STYLE_FONTSIZE] = '14';
            utilityStyle[mxConstants.STYLE_FONTCOLOR] = '#FFFFFF';
            utilityStyle[mxConstants.STYLE_SHADOW] = '0';
            utilityStyle[mxConstants.STYLE_ROUNDED] = false;
            this.graph.getStylesheet().putCellStyle('utilityStyle', utilityStyle);

            // -- Note activities
            var noteStyle = {};
            noteStyle[mxConstants.STYLE_SHAPE] = 'label';
            noteStyle[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
            noteStyle[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
            noteStyle[mxConstants.STYLE_SPACING_LEFT] = 5;
            noteStyle[mxConstants.STYLE_SPACING_TOP] = 5;
            noteStyle[mxConstants.STYLE_SPACING_BOTTOM] = 5;
            noteStyle[mxConstants.STYLE_SPACING_RIGHT] = 5;
            noteStyle[mxConstants.STYLE_STROKEWIDTH] = '2';
            noteStyle[mxConstants.STYLE_STROKECOLOR] = '#FFF';
            noteStyle[mxConstants.STYLE_FILLCOLOR] = '#FDB813';
            noteStyle[mxConstants.STYLE_FONTFAMILY] = "helvetica, arial, tahoma, verdana, sans-serif, 'lucida grande'";
            noteStyle[mxConstants.STYLE_FONTSIZE] = '12';
            noteStyle[mxConstants.STYLE_FONTSTYLE] = '0';
            noteStyle[mxConstants.STYLE_SHADOW] = '0';
            noteStyle[mxConstants.STYLE_ROUNDED] = false;
            noteStyle[mxConstants.STYLE_WHITE_SPACE] = 'wrap';
            noteStyle[mxConstants.STYLE_OVERFLOW] = 'width';
            noteStyle[mxConstants.STYLE_AUTOSIZE] = '1';
            this.graph.getStylesheet().putCellStyle('noteStyle', noteStyle);

            // -- Component process activities
            var activityStyle = {};
            activityStyle[mxConstants.STYLE_SHAPE] = 'label';
            activityStyle[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
            activityStyle[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_LEFT;
            activityStyle[mxConstants.STYLE_SPACING_LEFT] = 45;
            activityStyle[mxConstants.STYLE_SPACING_TOP] = -10;
            activityStyle[mxConstants.STYLE_SPACING_BOTTOM] = -10;
            activityStyle[mxConstants.STYLE_SPACING_RIGHT] = -20;
            activityStyle[mxConstants.STYLE_STROKECOLOR] = '#7F1C7D';
            activityStyle[mxConstants.STYLE_FILLCOLOR] = '#7F1C7D';
            activityStyle[mxConstants.STYLE_FONTCOLOR] = '#FFFFFF';
            activityStyle[mxConstants.STYLE_FONTFAMILY] = "helvetica, arial, tahoma, verdana, sans-serif, 'lucida grande'";
            activityStyle[mxConstants.STYLE_FONTSIZE] = '12';
            activityStyle[mxConstants.STYLE_FONTSTYLE] = '0';
            activityStyle[mxConstants.STYLE_SHADOW] = '0';
            activityStyle[mxConstants.STYLE_ROUNDED] = false;
            activityStyle[mxConstants.STYLE_IMAGE] = bootstrap.imageUrl+'icons/mxgraph/process_step.png';
            activityStyle[mxConstants.STYLE_IMAGE_WIDTH] = '32';
            activityStyle[mxConstants.STYLE_IMAGE_HEIGHT] = '32';
            this.graph.getStylesheet().putCellStyle('activityStyle', activityStyle);
        },

        getActivityStyle: function(){

        }
    });
});
