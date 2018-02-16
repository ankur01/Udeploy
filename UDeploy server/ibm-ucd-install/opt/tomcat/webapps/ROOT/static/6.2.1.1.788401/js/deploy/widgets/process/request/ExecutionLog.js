/*
* Licensed Materials - Property of IBM Corp.
* IBM UrbanCode Deploy
* (c) Copyright IBM Corporation 2011, 2016. All Rights Reserved.
*
* U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
* GSA ADP Schedule Contract with IBM Corp.
*/
/*global define, require */

define([
        "dijit/form/Button",
        "dijit/form/CheckBox",
        "dijit/_Widget",
        "dijit/_TemplatedMixin",
        "dijit/registry",
        "dojo/_base/array",
        "dojo/_base/declare",
        "dojo/_base/xhr",
        "dojo/dom",
        "dojo/dom-class",
        "dojo/dom-construct",
        "dojo/dom-style",
        "dojo/on",
        "dojo/dom-geometry",
        "dojo/mouse",
        "dojo/query",
        "deploy/widgets/process/request/ExecutionLogFormatters",
        "deploy/widgets/approval/ApprovalRevocationDialog",
        "deploy/widgets/Popup",
        "js/webext/widgets/GenericConfirm",
        "js/webext/widgets/Alert",
        "js/webext/widgets/form/MenuButton",
        "js/webext/widgets/table/TreeTable",
        "js/webext/widgets/Dialog"
        ],
function(
        Button,
        CheckBox,
        _Widget,
        _TemplatedMixin,
        registry,
        array,
        declare,
        xhr,
        dom,
        domClass,
        domConstruct,
        domStyle,
        on,
        geo,
        mouse,
        query,
        ExecutionLogFormatters,
        ApprovalRevocationDialog,
        Popup,
        GenericConfirm,
        Alert,
        MenuButton,
        TreeTable,
        Dialog
) {
    /**
     * A textual view of activity execution, showing log information as a table.
     *
     * Supported properties:
     *  requestTraceUrl / String            The URL to request workflow trace data from
     *  approvalId / String                 The ID of an associated approval to show progress for
     */
    return declare([_Widget, _TemplatedMixin], {
        templateString:
            '<div class="executionLog">' +
                '<div data-dojo-attach-point="approvalAttach" style="margin-bottom: 15px;">'+
                    '<div class="containerLabel" data-dojo-attach-point="approvalHeader"></div>'+
                    '<div data-dojo-attach-point="approvalGridAttach" class="hidden"></div>' +
                    '<div data-dojo-attach-point="approvalControlsAttach"></div>' +
                '</div>' +
                '<div data-dojo-attach-point="executionAttach">'+
                    '<div class="containerLabel" data-dojo-attach-point="executionHeader"></div>'+
                    '<div class="execution-log-timeline" data-dojo-attach-point="timelineAttach"></div>' +
                    '<div class="execution-log-timeline-spacer" data-dojo-attach-point="timelineSpacer"></div>' +
                    '<div data-dojo-attach-point="gridAttach" class="hidden"></div>' +
                    // This next line has margin-bottom 150px so that it's easier to expand things toward
                    // the bottom of the tree without having to scroll down again each time.
                    '<div data-dojo-attach-point="executionControlsAttach" style="margin-top: 10px; margin-bottom: 150px;"></div>' +
                '</div>'+
            '</div>',

        /**
         *
         */
        postCreate: function() {
            this.inherited(arguments);
            var _this = this;

            this.approvalHeader.innerHTML = i18n("Approval Progress");
            this.executionHeader.innerHTML = i18n("Execution");

            if (this.approvalId) {
                this.loadApproval();
            }
            else {
                domClass.add(_this.approvalAttach, "hidden");
            }

            this.loadExecution();
        },

        /**
         *
         */
        loadApproval: function() {
            var _this = this;

            xhr.get({
                url: bootstrap.restUrl+"approval/approval/"+this.approvalId+"/withTrace",
                handleAs: "json",
                load: function(data) {
                    _this.approval = data;
                    _this.showApprovalLog();
                }
            });
        },

        /**
         *
         */
        loadExecution: function() {
            var _this = this;
            xhr.get({
                url: this.requestTraceUrl,
                handleAs: "json",
                load: function(data) {
                    _this.rootActivity = data;
                    _this.loadTimelineElement = {};
                    _this.showExecutionLog();
                }
            });
        },

        /**
         *
         */
        showApprovalLog: function() {
            var _this = this;

            domConstruct.empty(_this.approvalControlsAttach);
            if (_this.approvalGrid) {
                domConstruct.empty(_this.approvalGrid.buttonAttach);
            }

            if (_this.approval.activity && _this.approval.activity.children) {
                if (_this.approvalGrid) {
                    _this.approvalGrid.data = _this.approval.activity.children;
                    _this.approvalGrid.refresh();
                }
                else {
                    domClass.remove(_this.approvalGridAttach, "hidden");
                    _this.approvalGrid = new TreeTable({
                        data: _this.approval.activity.children,
                        orderField: "graphPosition",
                        serverSideProcessing: false,
                        hideExpandCollapse: true,
                        hideFooter: true,
                        columns: [{
                            name: i18n("Task"),
                            formatter: function(item) {
                                return ExecutionLogFormatters.nameFormatter(item);
                            },
                            orderField: "graphPosition",
                            getRawValue: function(item) {
                                var result = item.name;
                                if (item.graphPosition) {
                                    result = Number(item.graphPosition);
                                }
                                return result;
                            }
                        },{
                            name: i18n("Target"),
                            formatter: function(item) {
                                return ExecutionLogFormatters.approvalTargetFormatter(item);
                            }
                        },{
                            name: i18n("Required Role"),
                            formatter: function(item) {
                                return ExecutionLogFormatters.roleFormatter(item);
                            }
                        },{
                            name: i18n("Start Time"),
                            formatter: function(item) {
                                if (item.startDate) {
                                    return util.dateFormatShort(item.startDate);
                                }
                            },
                            getRawValue: function(item) {
                                var result = 0;
                                if (item.startDate) {
                                    result = Number(item.startDate);
                                }
                                return result;
                            },
                            orderField: "startDate"
                        },{
                            name: i18n("Status"),
                            formatter: function(item, value, cell) {
                                return ExecutionLogFormatters.statusFormatter(item, cell);
                            }
                        },{
                            name: i18n("Completed By"),
                            formatter: function(item) {
                                return ExecutionLogFormatters.taskCompletedByFormatter(item);
                            }
                        },{
                            name: i18n("Actions"),
                            formatter: function(item) {
                                return ExecutionLogFormatters.actionsFormatter(item);
                            }
                        }]
                    });
                    _this.approvalGrid.placeAt(_this.approvalGridAttach);
                }
            }

            if (_this.approval.failedBy) {
                var failedNotice = document.createElement("div");
                failedNotice.className = "failureBox";
                failedNotice.innerHTML = i18n("Approval was revoked by %s on %s.",
                        _this.approval.failedBy, util.dateFormatShort(_this.approval.failedDate));
                _this.approvalControlsAttach.appendChild(failedNotice);
            }
            else if (_this.approvalGrid && !_this.approval.failed && !_this.approval.cancelled && _this.rootActivity
                    && !_this.rootActivity.children && _this.approval.finished && !_this.rootActivity.error) {
                var revokeButton = new Button({
                    label: i18n("Revoke Approval"),
                    showTitle: false,
                    onClick: function() {
                        var approvalRevocation = ApprovalRevocationDialog({
                            applicationProcessRequestId: _this.approval.appRequest ? _this.approval.appRequest.id : null,
                            componentProcessRequestId: _this.approval.compRequest ? _this.approval.compRequest.id : null
                        });
                    }
                });
                revokeButton.placeAt(_this.approvalGrid.buttonAttach);
                _this.approvalGridAttach.style.marginTop = "5px";
            }

            var activity = _this.approval.activity;
            if (activity.error) {
                domConstruct.create("div", {
                    innerHTML: activity.error.escape()
                }, _this.approvalControlsAttach);
            }
            else if (!activity.state || activity.state === "EXECUTING" || activity.state === "INITIALIZED") {
                setTimeout(function() {
                    _this.loadApproval();
                }, 3000);
            }
        },

        /**
         *
         */
        showExecutionLog: function() {
            var _this = this;

            if (dom.byId("processControlLinks")) {
                domConstruct.destroy("processControlLinks");
            }
            if (_this.timeout) {
                clearTimeout(_this.timeout);
            }

            domConstruct.empty(_this.executionControlsAttach);
            if (_this.grid) {
                domConstruct.empty(_this.grid.buttonAttach);
            }

            if (_this.rootActivity && _this.rootActivity.children) {
                if (_this.grid) {
                    _this.grid.data = _this.rootActivity.children;
                    _this.grid.refresh();
                }
                else {
                    domClass.remove(_this.gridAttach, "hidden");
                    _this.grid = new TreeTable({
                        data: _this.rootActivity.children,
                        orderField: ["graphPosition", null, "startDate"],
                        serverSideProcessing: false,
                        hideFooter: true,
                        applyRowStyle: function(item, row) {
                            if (item.graphPosition && item.children) {
                                domClass.add(row, "rowOfInterest");
                            }
                            domClass.add(row, item.id);
                            ExecutionLogFormatters.statusFormatter(item, domConstruct.create("div"), row);
                            // Add ability to unselect a row.
                            on(row, "click", function(){
                                if (domClass.contains(row, "selected")){
                                    setTimeout(function(){
                                        domClass.remove(row, "selected");
                                    }, 100);
                                }
                            });
                            // Adding classes to row when mouse hovers over row and finding the
                            // corresponding bar in the timeline to highlight.
                            on(row, mouse.enter, function(){
                                if (_this.timeline && _this.timeline.elements){
                                    var relatedStep = _this.timeline.elements.step[item.id];
                                    var stepGroup = [];
                                    if (relatedStep){
                                        stepGroup = _this.timeline.elements.steps[relatedStep];
                                        array.forEach(stepGroup, function(hoverItem){
                                            domClass.add(hoverItem, "hover");
                                        });
                                    }
                                    var relatedRow = _this.timeline.elements[item.id];
                                    if (relatedRow){
                                        domClass.add(relatedRow.bar, "hover-item");
                                        on(row, mouse.leave, function(){
                                            domClass.remove(relatedRow.bar, "hover-item");
                                            array.forEach(stepGroup, function(hoverItem){
                                                domClass.remove(hoverItem, "hover");
                                            });
                                        });
                                    }
                                }
                            });
                        },
                        getChildUrl: function(item) {
                            var result = "";
                            if (!item.childUrlLoaded){
                                item.childUrlLoaded = true;
                                if (item.componentProcessRequestId) {
                                    result = bootstrap.restUrl+"workflow/componentProcessRequestChildren/"+item.componentProcessRequestId;
                                }
                                else if (item.childRequestId) {
                                    result = bootstrap.restUrl+"process/request/"+item.childRequestId+"/traceChildren";
                                }

                                if (_this.timeline && _this.timeline.elements && _this.timeline.elements.loadChild[item.componentProcessRequestId]){
                                    _this.timeline.elements.loadChild[item.componentProcessRequestId]();
                                }
                                else {
                                    _this.loadTimelineElement[item.componentProcessRequestId] = true;
                                }
                                setTimeout(function(){
                                    delete item.childUrlLoaded;
                                }, 1000);
                            }
                            return result;
                        },
                        hasChildren: function(item) {
                            var result = false;
                            if (item.children && item.children.length > 0) {
                                result = true;
                            }
                            else if (item.type === "runProcess" || item.type === "componentProcess") {
                                if ((item.state === "EXECUTING" || item.state === "CLOSED")
                                        && !item.notNeeded) {
                                    if (item.childRequestId || item.componentProcessRequestId) {
                                        result = true;
                                    }
                                }
                            }

                            return result;
                        },
                        columns: [{
                            name: i18n("Step"),
                            formatter: function(item, value, cell) {
                                var container = ExecutionLogFormatters.nameFormatter(item, true);
                                var actionsMenu = _this.actionsFormatter(item, cell);
                                if (actionsMenu){
                                    domConstruct.place(actionsMenu, container);
                                }
                                return container;
                            },
                            orderField: "graphPosition",
                            getRawValue: function(item) {
                                var result = item.name;
                                if (item.graphPosition) {
                                    result = Number(item.graphPosition);
                                }
                                return result;
                            }
                        },{
                            name: i18n("Progress"),
                            formatter: function(item, value, cell) {
                                var result;
                                if (item.children) {
                                    result = ExecutionLogFormatters.progressFormatter(item, cell);
                                }
                                return result;
                            }
                        },{
                            name: i18n("Start Time"),
                            formatter: function(item) {
                                if (item.startDate) {
                                    return util.dateFormatShortSeconds(item.startDate);
                                }
                            },
                            getRawValue: function(item) {
                                var result = 0;
                                if (item.startDate) {
                                    result = Number(item.startDate);
                                }
                                return result;
                            },
                            orderField: "startDate"
                        },{
                            name: i18n("Duration"),
                            formatter: function(item) {
                                var result = "";
                                if (item.startDate && item.duration !== undefined) {
                                    result = util.formatDuration(item.duration);
                                }
                                return result;
                            }
                        },{
                            name: i18n("Status"),
                            formatter: function(item, value, cell) {
                                var statusCell = domConstruct.create("div", {
                                    className: "status-cell"
                                });
                                var statusColorCell = domConstruct.create("div", {
                                    className: "inlineBlock status-color-block"
                                }, statusCell);
                                domConstruct.create("div", {
                                    className: "inlineBlock status-text-cell",
                                    innerHTML: ExecutionLogFormatters.statusFormatter(item, statusColorCell)
                                }, statusCell);
                                return statusCell;
                            }
                        }]
                    });

                    _this.grid.oldExpand = _this.grid.expand;
                    _this.grid.expand = function(item, expandAll) {
                        if (!expandAll ||
                                (item.type !== "componentProcess" && item.type !== "runProcess")) {
                            _this.grid.oldExpand(item, expandAll);
                        }
                    };

                    _this.grid.placeAt(_this.gridAttach);
                }

                domConstruct.empty(_this.grid.tfootAttach);
                var summaryRow = domConstruct.create("tr", {
                    "class": "executionSummaryRow"
                }, _this.grid.tfootAttach);

                var summaryStep = domConstruct.create("td", {}, summaryRow);
                domConstruct.create("div", {
                    className: "cellWrapper",
                    innerHTML: i18n("Total Execution")
                }, summaryStep);

                var progressCell = domConstruct.create("td", {}, summaryRow);
                var progressCellWrapper = domConstruct.create("div", {
                    className: "cellWrapper"
                }, progressCell);
                progressCellWrapper.appendChild(ExecutionLogFormatters.progressFormatter(_this.rootActivity, progressCell));

                var startTimeCell = domConstruct.create("td", {}, summaryRow);
                domConstruct.create("div", {
                    className: "cellWrapper",
                    innerHTML: !!_this.rootActivity.startDate ? util.dateFormatShortSeconds(_this.rootActivity.startDate) : i18n("Starting...")
                }, startTimeCell);

                var durationCell = domConstruct.create("td", {}, summaryRow);
                domConstruct.create("div", {
                    className: "cellWrapper",
                    innerHTML: !!_this.rootActivity.startDate ? util.formatDuration(_this.rootActivity.duration) : util.formatDuration(0)
                }, durationCell);

                var statusCell = domConstruct.create("td", {}, summaryRow);
                var statusCellWrapper = domConstruct.create("div", {
                    className: "cellWrapper"
                }, statusCell);
                var statusColorCell = domConstruct.create("div", {
                    className: "inlineBlock status-color-block"
                }, statusCellWrapper);
                domConstruct.create("div", {
                    className: "inlineBlock status-text-cell",
                    innerHTML: ExecutionLogFormatters.statusFormatter(_this.rootActivity, statusColorCell, summaryRow)
                }, statusCellWrapper);

                var controlLinks = domConstruct.create("div", {
                    id: "processControlLinks",
                    className: "inlineBlock process-control-links"
                }, _this.grid.aboveTreeOptions);

                if (_this.rootActivity.state === "EXECUTING") {
                    if (_this.rootActivity.paused) {
                        var resumeButton = new Button({
                            label: i18n("Resume")
                        });
                        resumeButton.placeAt(controlLinks);
                        resumeButton.on("click", function() {
                            _this.grid.block();
                            xhr.put({
                                url: bootstrap.restUrl+"workflow/"+_this.rootActivity.workflowTraceId+"/resume",
                                handleAs: "json",
                                load: function() {
                                    _this.grid.unblock();
                                    _this.loadExecution();
                                }
                            });
                        });
                    }
                    else {
                        var pauseButton = new Button({
                            label: i18n("Pause")
                        });
                        pauseButton.placeAt(controlLinks);
                        pauseButton.on("click", function() {
                            _this.grid.block();
                            xhr.put({
                                url: bootstrap.restUrl+"workflow/"+_this.rootActivity.workflowTraceId+"/pause",
                                handleAs: "json",
                                load: function() {
                                    _this.grid.unblock();
                                    _this.loadExecution();
                                }
                            });
                        });
                    }

                    var cancelButton = new Button({
                        label: i18n("Cancel")
                    });
                    cancelButton.placeAt(controlLinks);
                    cancelButton.on("click", function() {
                        var confirm = new GenericConfirm({
                            message: i18n("Are you sure you want to cancel this process request?"),
                            action: function() {
                                _this.grid.block();
                                xhr.put({
                                    url: bootstrap.restUrl+"workflow/"+_this.rootActivity.workflowTraceId+"/cancel",
                                    handleAs: "json",
                                    load: function() {
                                        _this.grid.unblock();
                                        _this.loadExecution();
                                    },
                                    error: function(data) {
                                        var errorAlert = new Alert({
                                            message: i18n("Could not cancel the process.")
                                        });
                                        _this.grid.unblock();
                                        _this.loadExecution();
                                    }
                                });
                            }
                        });
                    });
                }
                else {
                    if (appState.applicationProcessRequest) {
                        var repeatButton = new Button({
                            label: i18n("Repeat Request")
                        });
                        repeatButton.placeAt(controlLinks);
                        repeatButton.on("click", function() {
                            var confirm = new GenericConfirm({
                                message: i18n("Are you sure you want to repeat this application process request?"),
                                action: function() {
                                    xhr.put({
                                        url: bootstrap.restUrl+"deploy/applicationProcessRequest/"+appState.applicationProcessRequest.id+"/repeat",
                                        handleAs: "json",
                                        load: function(data) {
                                            navBar.setHash("applicationProcessRequest/"+data.requestId+"/log", false, true);
                                        }
                                    });
                                }
                            });
                        });
                    }
                }

                var downloadLogsButton = new Button({
                    label: i18n("Download All Logs")
                });
                downloadLogsButton.placeAt(controlLinks);
                downloadLogsButton.on("click", function() {
                    util.downloadFile(bootstrap.restUrl+"workflow/"+_this.rootActivity.workflowTraceId+"/fullTraceWithLogs");
                });
            }
            else if (this.approval && this.approval.failed) {
                _this.executionControlsAttach.innerHTML = i18n("Approval failed; This process request has been aborted.");
            }
            else {
                _this.executionControlsAttach.innerHTML = i18n("Waiting to start...");
            }


            if (_this.rootActivity) {
                if (_this.rootActivity.error) {
                    _this.executionControlsAttach.innerHTML = _this.rootActivity.error.escape();

                    var seeLogDiv = document.createElement("div");
                    seeLogDiv.style.marginTop = "15px";
                    seeLogDiv.innerHTML = i18n("See the server log for the full error trace.");
                    _this.executionControlsAttach.appendChild(seeLogDiv);
                }
                else if (!_this.rootActivity.state
                        || _this.rootActivity.state === "EXECUTING"
                        || _this.rootActivity.state === "INITIALIZED") {
                    _this.timeout = setTimeout(function() {
                        _this.timeout = null;

                        // Keep height of table on refresh to not lose scroll position.
                        if (_this.gridAttach){
                            var height = geo.position(_this.gridAttach).h;
                            domStyle.set(_this.executionAttach, "minHeight", height + 40 + "px");
                        }
                        _this.loadExecution();
                    }, 3000);
                }
            }
            if (_this.rootActivity && _this.rootActivity.children && _this.rootActivity.endDate){
                _this.showExecutionTimeline();
            }
        },

       /**
        * Creates the Actions... button for each item.
        */
       actionsFormatter: function(item, cell) {
           var result = domConstruct.create("div", {
               "dir": util.getUIDir(),
               "align": util.getUIDirAlign(),
               "class": "tableHoverActions"
           });

           var menuActions = [];

           array.forEach(ExecutionLogFormatters.actionsMenuFormatter(item, result), function(viewChildExecutionItem){
               menuActions.push(viewChildExecutionItem);
           });

           if (menuActions.length) {
               var actionsContainer = domConstruct.create("div", {
                   className: "table-actions-container"
               }, result);
               array.forEach(menuActions, function(action){
                   var containerType = action.onClick || action.href ? "a" : "div";
                   var buttonContainer = domConstruct.create(containerType, {
                       title: action.label,
                       className: action.onClick || action.href ? "linkPointer" : ""
                   }, actionsContainer);
                   if (action.showLabel){
                       domConstruct.create("div", {
                           className: "inline-block",
                           innerHTML: action.label
                       }, buttonContainer);
                   }
                   if (action.icon){
                       domConstruct.create("div", {
                           className: "inline-block",
                           innerHTML: action.icon
                       }, buttonContainer);
                   }
                   if (action.href){
                       buttonContainer.href = action.href;
                   }
                   else if (action.onClick){
                       on(buttonContainer, "click", function(){
                           action.onClick();
                       });
                   }
                   if (action.handleNavigationError) {
                       on(buttonContainer, "click", function(){
                           action.handleNavigationError();
                       });
                   }
               });
           }
           else {
               result = null;
           }
           return result;
       },

       /**
        * Creates the execution log timeline.
        */
        showExecutionTimeline: function(){
            var _this = this;

            // Create an extra Execution title label. Only shown when the timeline is docked at the top of the screen.
            domConstruct.create("div", {
                className: "containerLabel",
                innerHTML: i18n("Execution")
            }, this.timelineAttach);

            // Determine if timeline is docked at top of screen.
            var checked = util.getCookie("timelineDocked");
            if (!checked){
                checked = "true";
                util.setCookie("timelineDocked", "true");
            }
            var dockCheckBoxContainer = domConstruct.create("div", {
                className: "timeline-dock-checkbox-container"
            }, this.timelineAttach);
            var dockCheckBox = new CheckBox({
                name: "isAuthorized",
                checked: checked === "true",
                onChange: function(){
                    util.setCookie("timelineDocked", this.checked);
                    if (domClass.contains(_this.timelineAttach, "timeline-fixed-position")){
                        domClass.remove(_this.timelineAttach, "timeline-fixed-position");
                        domClass.remove(_this.executionHeader, "timeline-fixed-position");
                        _this.timelineSpacer.style.height = "0px";
                    }
                }
            });
            dockCheckBox.placeAt(dockCheckBoxContainer);
            var dockLabel = domConstruct.create("label", {
                "for": dockCheckBox.get("id"),
                innerHTML: i18n("Dock timeline at top")
            }, dockCheckBoxContainer);

            // Determine if timeline is expanded.
            if (!util.getCookie("timelineExpanded")){
                util.setCookie("timelineExpanded", "true");
            }
            else if (util.getCookie("timelineExpanded") === "false"){
                domClass.add(_this.timelineAttach, "timeline-collapsed");
            }
            var timelineExpander = domConstruct.create("div", {
                className: "timeline-expander"
            }, this.timelineAttach);
            on(timelineExpander, "click", function(){
                if (util.getCookie("timelineExpanded") === "false"){
                    util.setCookie("timelineExpanded", "true");
                    domClass.remove(_this.timelineAttach, "timeline-collapsed");
                    _this.toggleExpandTimeline(true);
                }
                else {
                    util.setCookie("timelineExpanded", "false");
                    domClass.add(_this.timelineAttach, "timeline-collapsed");
                    _this.toggleExpandTimeline(false);
                }
            });

            /*
             * Initialize all data
             * this.timeline = {
             *    start: The start time.
             *    end: The end time.
             *    totalEnd: The end time shifted by subtractiong the start time.
             *    duartion: The duration.
             *    maxHeight: References the total number of rows to build.
             *    heightSection: The height of each row.
             *    line: The timeline container.
             *    elements: {
             *        iconStep: The icon for a given row. (iconStep[1] = icon)
             *        loadChild: If a row in the tree table is expanded and contains children, store a reference to automatically load those bars when the timeline is built.
             *        step: A step reference to the parent id. (step[item.id] = parentId;)
             *        steps: Object of arrays of timeline bars  under the same parent. (steps[parentId] = [bar, bar2, bar3])
             *    }
             * }
             */
            var timelineData = this.rootActivity.children;
            var root = this.rootActivity;
            if (timelineData.length > 0){
                this.timeline = {
                    start: root.startDate,
                    end: root.endDate,
                    totalEnd: root.endDate - root.startDate,
                    duration: root.duration,
                    maxHeight: 1,
                    heightSection: util.getCookie("timelineExpanded") === "true" ? 31 : 11,
                    marginTopSection: util.getCookie("timelineExpanded") === "true" ? 10 : 25,
                    line: domConstruct.create("div", {className: "timeline-container"}, this.timelineAttach),
                    elements:{iconStep:{}, loadChild:{}, step:{}, steps:{}, stepContainers: []}
                };
            }
            this._buildTimelineHeader();

            // Alternate between 2 colors for each group of timeline bars to better group them visually.
            var color = 1;
            array.forEach(timelineData, function(item){
                if (color === 3){
                    color = 1;
                }
                _this._createTimelineContainer(item, null, null, color);
                color++;
            });

            this._buildTimelineBackground();


            // If the timeline reaches the top of the page, set it to a fixed position so it's
            // always visible.
            if (window){
                on(window, "scroll", function(evt){
                    if (util.getCookie("timelineDocked") === "true"){
                        try {
                            var position = geo.position(_this.domNode);
                            if (position && position.y < 8){
                                if (!domClass.contains(_this.timelineAttach, "timeline-fixed-position")){
                                    domClass.add(_this.timelineAttach, "timeline-fixed-position");
                                    domClass.add(_this.executionHeader, "timeline-fixed-position");
                                    if (_this.timeline && _this.timeline.maxHeight){
                                        _this.timelineSpacer.style.height = (_this.timeline.maxHeight * _this.timeline.heightSection) + 65 + "px";
                                    }
                                }
                            }
                            else if (domClass.contains(_this.timelineAttach, "timeline-fixed-position")){
                                domClass.remove(_this.timelineAttach, "timeline-fixed-position");
                                domClass.remove(_this.executionHeader, "timeline-fixed-position");
                                _this.timelineSpacer.style.height = "0px";
                            }
                        }
                        catch (e){
                            // Geo-position cannot find owner document. Somehow not caught by dojo.
                            // None blocking error, so we don't need to show it to console.
                        }
                    }
                });
            }
        },

        /**
         * Toggle expanding and collapsing the timeline
         *  @param expanded: Is the timeline being expanded?
         */
        toggleExpandTimeline: function(expanded){
            var _this = this;
            if (expanded){
                this.timeline.heightSection = 31;
                this.timeline.marginTopSection = 10;
            }
            else {
                this.timeline.heightSection = 11;
                this.timeline.marginTopSection = 25;
            }
            array.forEach(this.timeline.elements.stepContainers, function(step){
                step.container.style.top = (_this.timeline.heightSection * step.step) + _this.timeline.marginTopSection + "px";
            });
            this._buildTimelineBackground();
        },

        /**
         * Creates the header of the timeline.
         */
        _buildTimelineHeader: function(){
            var timeContainer = domConstruct.create("div", {className: "timeline-time-container"}, this.timeline.line);

            // Start Time
            var leftTimeBox =  domConstruct.create("div", {
                className: "timeline-header-box-time-left"
            }, timeContainer);
            domConstruct.create("div", {
                innerHTML: i18n("Start"),
                className: "timeline-header-label"
            }, leftTimeBox);
            domConstruct.create("div", {
                innerHTML: util.dateFormatShortSeconds(this.timeline.start),
                className: "timeline-header-text"
            }, leftTimeBox);

            var summaryBox = domConstruct.create("div", {className: "inlineBlock timeline-header-box-summary"}, timeContainer);

            // Progress
            var progressBox =  domConstruct.create("div", {
                className: "inlineBlock timeline-header-box"
            }, summaryBox);
            domConstruct.create("div", {
                innerHTML: i18n("Progress"),
                className: "timeline-header-label"
            }, progressBox);
            progressBox.appendChild(ExecutionLogFormatters.progressFormatter(this.rootActivity, domConstruct.create("div")));

            // Status
            var statusBox =  domConstruct.create("div", {
                className: "inlineBlock timeline-header-box"
            }, summaryBox);
            domConstruct.create("div", {
                innerHTML: i18n("Status"),
                className: "timeline-header-label"
            }, statusBox);
            var statusCell = domConstruct.create("div", {className: "inlineBlock status-color-block"}, statusBox);
            domConstruct.create("div", {
                innerHTML: ExecutionLogFormatters.statusFormatter(this.rootActivity, statusCell),
                className: "inlineBlock timeline-header-text"
            }, statusBox);

            // Duration
            var durationBox =  domConstruct.create("div", {
                className: "inlineBlock timeline-header-box"
            }, summaryBox);
            domConstruct.create("div", {
                innerHTML: i18n("Duration"),
                className: "timeline-header-label"
            }, durationBox);
            domConstruct.create("div", {
                innerHTML: util.formatDuration(this.timeline.duration),
                className: "timeline-header-text"
            }, durationBox);

            // End Time
            var rightTimeBox =  domConstruct.create("div", {
                className: "timeline-header-box-time-right"
            }, timeContainer);
            domConstruct.create("div", {
                innerHTML: i18n("End"),
                className: "timeline-header-label"
            }, rightTimeBox);
            domConstruct.create("div", {
                innerHTML: util.dateFormatShortSeconds(this.timeline.end),
                className: "timeline-header-text"
            }, rightTimeBox);
        },

        /**
         * Gets the children of an item and creates a timeline bar to diplay in the timeline.
         * @param item: the data to build the timeline bar from.
         * @param parent: the parent resource of the item, if it has one.
         * @param step: the depth level to place the bar.
         * @param color: the shade of gray to color the bar (1 or 2);
         */
        _timelineChildren: function(item, parent, step, color){
            var self = this;
            if (step > this.timeline.maxHeight){
                this.timeline.maxHeight = step;
            }

            array.forEach(item, function(child){
                self._createTimelineChild(child, parent, step, color);
            });
        },

        /**
         * Creates a child timeline bar.
         * @param item: the data to build the timeline bar from.
         * @param parent: the parent resource of the item, if it has one.
         * @param step: the depth level to place the bar.
         * @param color: the shade of gray to color the bar (1 or 2);
         *
         * (For Component Processes) If process is a child process, provide the following
         * @param childContainer: The timeline bar of the process.
         * @param popupContents: The popup of the childContainer.
         */
        _createTimelineChild: function(item, parent, step, color, childContainer, popupContents){
            var self = this;
            if (item.componentProcessRequestId || item.childRequestId) {
                // Creates a message to remind the user to click on the timeline bar to view
                // the children timeline bars.
                var message = domConstruct.create("div", {
                    className: "popup-line",
                    innerHTML: i18n("(Click bar to view child execution)")
                });
                var container = childContainer || self._createTimelineContainer(item, parent, step, color, message);
                if (popupContents){
                    domConstruct.place(message, popupContents);
                }

                // Create a reference function to load the children timeline bars when parent bar
                // is clicked or the related row in the tree table is expanded.
                this.timeline.elements.loadChild[item.componentProcessRequestId] = function(){
                    if (step+1 > self.timeline.maxHeight){
                        self.timeline.maxHeight = step+1;
                    }
                    var url = bootstrap.restUrl;
                    if (item.componentProcessRequestId){
                        url += "workflow/componentProcessRequestChildren/" + item.componentProcessRequestId;
                    }
                    else {
                        url += "process/request/" + item.childRequestId + "/children";
                    }
                    xhr.get({
                        url: url,
                        handleAs: "json",
                        sync: true,
                        load: function(data) {
                            self._timelineChildren(data, parent, step+1, color);
                            self._buildTimelineBackground();
                            // Hide message after the children timebars are loaded.
                            domConstruct.destroy(message);
                        }
                    });
                };

                // Load children timeline bars if the related row in the tree table is expanded.
                if (this.loadTimelineElement[item.componentProcessRequestId]){
                    this.timeline.elements.loadChild[item.componentProcessRequestId]();
                    this.timeline.elements.loadChild[item.componentProcessRequestId] = function(){};
                }
                else {
                    // Load children timeline bars on click.
                    var loadChild = on(container, "click", function(){
                        self.timeline.elements.loadChild[item.componentProcessRequestId]();
                        self.timeline.elements.loadChild[item.componentProcessRequestId] = function(){};
                        // Destroy this function to prevent multiple loads.
                        loadChild.remove();
                    });
                }
            }
            else {
                self._createTimelineContainer(item, parent, step, color);
            }
        },

        /**
         * Creates a timeline bar to diplay in the timeline.
         * @param item: the data to build the timeline bar from.
         * @param parent: the parent resource of the item, if it has one.
         * @param step: the depth level to place the bar.
         * @param color: the shade of gray to color the bar (1 or 2);
         * @param message: an optional message to display in the popup of the timeline bar.
         * @return The constructed timeline bar.
         */
        _createTimelineContainer: function(item, parent, step, color, message){
            var _this = this;

            // First item in list has no step value, set it to 1 (Top row)
            if (!step){
                step = 1;
            }
            var nameContainer = domConstruct.create("div", {className: "name-label"});
            domConstruct.place(ExecutionLogFormatters.nameFormatter(item), nameContainer);

            // Create a common class for timeline bar under the same parent. Used for the hover feature in the tree table.
            var parentClass = "timeline-step-group-";
            if (parent && parent.id){
                parentClass += parent.id;
            }
            else {
                parentClass += item.id;
            }

            // Construct the timeline bar. Subtract 0.5% from width for better separation.
            var startDate = item.startDate;
            var margin = ((startDate - this.timeline.start) / this.timeline.totalEnd) * 100;
            var width = ((item.duration / _this.timeline.duration) * 100) - 0.5 || 0;
            if (width < 0){
                width = 0;
            }

            var container = domConstruct.create("div", {
                className: "timeline-step timeline-step-color-" + color + " " + parentClass,
                style: {
                    marginLeft: margin + "%",
                    position: "absolute",
                    top: (this.timeline.heightSection * step) + this.timeline.marginTopSection + "px",
                    width: startDate ? width + "%" : "1px"
                }
            }, _this.timeline.line);

            // Create references to this container. Each container is stored in the parent object,
            // and each item references the parent id. This data is used to highlight the bars when
            // the corresponding row in the tree table is hovered.
            if (parent && parent.id){
                var parentContainer = this.timeline.elements.steps[parent.id];
                parentContainer.push(container);
                this.timeline.elements.step[item.id] = parent.id;
            }
            else {
                this.timeline.elements.step[item.id] = item.id;
                this.timeline.elements.steps[item.id] = [container];
            }
            this.timeline.elements.stepContainers.push({
                step: step,
                container: container
            });

            // The left and right end points of the timeline bar.
            domConstruct.create("div", {className: "inlineBlock timeline-step-border timeline-step-border-left"}, container);
            domConstruct.create("div", {className: "inlineBlock timeline-step-border timeline-step-border-right"}, container);

            // When hovering over the timeline bar, find the corresponding row in the treetable and highlight it as well.
            on(container, mouse.enter, function(){
                var relatedRow = query("." + item.id)[0];
                if (relatedRow){
                    domClass.add(relatedRow, "hover");
                    on(container, mouse.leave, function(){
                        domClass.remove(relatedRow, "hover");
                    });
                }
            });

            // Construct the popup of the timeline bar.
            var popupContents = domConstruct.create("div", {className: "popup-contents-container"});
            domConstruct.place(nameContainer, popupContents);

            // Places the start time and duration in the popup.
            if (startDate){
                var timeContainer = domConstruct.create("div", {className: "popup-line"}, popupContents);
                domConstruct.create("div", {
                    className: "inlineBlock popup-label",
                    innerHTML: "Start Time: "
                }, timeContainer);
                domConstruct.create("div", {
                    className: "inlineBlock popup-text",
                    innerHTML: util.dateFormatShortSeconds(startDate)
                }, timeContainer);
                var duration = item.duration;
                if (duration){
                    var durationContainer = domConstruct.create("div", {className: "popup-line"}, popupContents);
                    domConstruct.create("div", {
                        className: "inlineBlock popup-label",
                        innerHTML: "Duration: "
                    }, durationContainer);
                    domConstruct.create("div", {
                        className: "inlineBlock popup-text",
                        innerHTML: util.formatDuration(duration)
                    }, durationContainer);
                }
                var progressLabel = ExecutionLogFormatters.progressFormatter(item, domConstruct.create("div"), true);
                if (progressLabel !== "0 / 0"){
                    var progressContainer = domConstruct.create("div", {className: "popup-line"}, popupContents);
                    domConstruct.create("div", {
                        className: "inlineBlock popup-label",
                        innerHTML: "Progress: "
                    }, progressContainer);
                    domConstruct.create("div", {
                        className: "inlineBlock popup-text",
                        innerHTML: progressLabel
                    }, progressContainer);
                }
            }
            var statusContainer = domConstruct.create("div", {className: "popup-line"}, popupContents);
            domConstruct.create("div", {
                className: "inlineBlock popup-label",
                innerHTML: "Status: "
            }, statusContainer);
            var statusBoxContainer = domConstruct.create("div", {
                className: "inlineBlock popup-text"
            }, statusContainer);
            var statusBox = domConstruct.create("div", {
                className: "inlineBlock status-container"
            }, statusBoxContainer);
            var statusText = ExecutionLogFormatters.statusFormatter(item, statusBox);
            var timelineContainerClass = statusText.replace(" ", "-");
            container.className += "timeline-step timeline-step-color-" + timelineContainerClass.toLowerCase();

            domConstruct.create("span", {
                innerHTML: statusText
            }, statusBoxContainer);
            if (message){
                domConstruct.place(message, popupContents);
            }

            var popup = new Popup({
                attachPoint: container,
                contents: popupContents,
                autoWidth: true
            });
            domClass.add(popup.domNode, "popup" + item.id);

            // Store a reference to the timeline bar and popup;
            this.timeline.elements[item.id] = {
                bar: container,
                popup: popup
            };
            var children = item.children;

            if (children){
                _this._timelineChildren(children, parent || item, step+1, color);
            }
            else if (item.componentProcess && step === 1){
                _this._createTimelineChild(item, item, step, color, container, popupContents);
            }


            // Picks out the common icon for the timeline step row.
            var findIcon = query(".general-icon", nameContainer);
            var icon = domConstruct.create("div");
            if (findIcon[0]){
                icon.className = findIcon[0].className;
            }
            else {
                icon.className = "process-icon execution-timeline-icon";
            }
            if (!this.timeline.elements.iconStep[step]){
                this.timeline.elements.iconStep[step] = icon;
            }
            return container;
        },

        /**
         * Creates the execution timeline background row separators.
         */
        _buildTimelineBackground: function(){
            var _this = this;
            if (this.timeline.background){
                domConstruct.destroy(this.timeline.background);
            }
            this.timeline.background = domConstruct.create("div", {
                className: "timeline-time-container timeline-background",
                style: {
                    height: (this.timeline.maxHeight * this.timeline.heightSection) + 1 + "px"
                }
            }, this.timeline.line);
            var i = 0;
            for (i; i < this.timeline.maxHeight; i++){
                var section = domConstruct.create("div", {
                    className: "timeline-section" + ((i === this.timeline.maxHeight - 1) ? " bottom-timeline-section" : "")
                }, _this.timeline.background);
                var icon = this.timeline.elements.iconStep[i+1];
                if (icon){
                    var iconContainer = domConstruct.create("div", {
                        className: "timeline-icon-section"
                    }, section);
                    domConstruct.place(icon, iconContainer);
                }
            }
        }
    });
});
