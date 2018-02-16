/*
* Licensed Materials - Property of IBM Corp.
* IBM UrbanCode Deploy
* (c) Copyright IBM Corporation 2011, 2014. All Rights Reserved.
*
* U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
* GSA ADP Schedule Contract with IBM Corp.
*/
/*global define, require, mxGeometry */

define([
        "dijit/_Widget",
        "dojo/_base/array",
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/xhr",
        "dojo/dom-construct",
        "dojo/on",
        "js/webext/widgets/DomNode",
        "js/webext/widgets/Alert",
        "js/webext/widgets/GenericConfirm",
        "js/webext/widgets/ColumnForm",
        "js/webext/widgets/Dialog",
        "deploy/widgets/property/PropertyBox",
        "deploy/widgets/process/ProcessIconsFormatter"
        ],
function(
        _Widget,
        array,
        declare,
        lang,
        xhr,
        domConstruct,
        on,
        DomNode,
        Alert,
        GenericConfirm,
        ColumnForm,
        Dialog,
        PropertyBox,
        ProcessIconsFormatter
) {
    /**
     * A base widget for managing an activity in a graph.
     *
     * Properties:
     *  graphEditor / Object (BaseGraph)    The editor this activity has been added to. Required at
     *                                      creation time.
     *  readOnly / Boolean                  Whether this activity can be edited or not. Default: false
     *  isContainer / Boolean               Whether this activity is a container for other activities
     *  parent / Object (BaseActivity)      The parent activity of this activity. Default: null
     *  data / Object                       The configuration for this activity.
     *
     * Built-in (generated) properties:
     *  graph / Object (mxGraph)            The internal mxGraph instance for the editor.
     *  cell / Object (mxCell)              The internal mxCell representation of this activity. This is
     *                                      null until the createCell() function is invoked.
     * initialized / Boolean                Whether this cell has all data set. This is automatically
     *                                      set to true for cells loaded from existing graphs. It's up
     *                                      to the editActivities function to handle this for new cells.
     *
     * Functions:
     *  getLabel() returns String           Returns the text to display as this cell's label, given the
     *                                      current state of the activity.
     *  getStyle() returns String           Returns the mxGraph cell style name to use for the cell.
     *  editProperties()                    For applicable activity types, this will create the dialog
     *                                      and form for editing the activity properties.
     *  createPropertyDialog() ret. Dialog  For child classes: Creates a Dialog with useful defaults.
     *  createPropertyform() ret. Dialog    For child classes: Creates a ColumnForm with useful defaults.
     *  canEdit() returns Boolean           Determines whether this activity can be edited.
     *  canDelete() returns Boolean         Determines whether this activity can be deleted.
     *  isUtilityCell() returns Boolean     Determines whether this activity is a utility-type cell
     *                                      (start, end, etc.)
     *  addEditOverlay()                    Creates the edit button over this cell.
     *  addDeleteOverlay()                  Creates the delete button over this cell.
     *  sizeCell()                          Sets the cell size to match the label.
     *
     */
    return declare('deploy.widgets.workflow.activity.BaseActivity',  [_Widget], {
        graphEditor: null,
        graph: null,
        cell: null,
        readOnly: false,
        isContainer: false,
        parent: null,
        data: {},
        uiData: {},
        initialized: false,

        /**
         *
         */
        postCreate: function() {
            this.inherited(arguments);
            if(!this.process) {
                if (this.graphEditor && this.graphEditor.applicationProcess) {
                    this.process = this.graphEditor.applicationProcess;
                }
                else if (this.graphEditor && this.graphEditor.componentProcess) {
                    this.process = this.graphEditor.componentProcess;
                }
            }

            if (!this.graphEditor) {
                throw "Unable to create an activity without a graphEditor specified.";
            }

            this.graph = this.graphEditor.graph;
        },

        getLabel: function() {
            // Placeholder
        },

        getName: function() {
            return this.data.name;
        },

        getFillColor: function() {
            return "#7F1C7D";
        },

        getStyle: function() {
            var image = ProcessIconsFormatter.getIconForStep(this);

            var imageUrl = bootstrap.imageUrl+'icons/process/' + image + '.png';
            var style = 'shape=label;' +
                'spacingLeft=45;' +
                'spacingRight=-20;' +
                'spacingTop=-10;' +
                'spacingBottom=-10;' +
                'fontFamily=helvetica,arial,tahoma,verdana,sans-serif,"lucida grande";' +
                'fontSize=12;' +
                'fontColor=#FFF;' +
                'verticalAlign=middle;' +
                'align=left;' +
                'strokeColor=#FFF;'+
                'strokeWidth=2;'+
                'fillColor=' + this.getFillColor() + ";" +
                'vertexHighlightColor=#AAA;' +
                'edgeHighlightColor=#AAA;' +
                'highlightColor=#AAA;' +
                'image=' + imageUrl + ';' +
                'imageWidth=32;' +
                'imageHeight=32;' +
                'autosize;';
            return style;
        },

        getIcon: function(){
            var icon = " job-icon";
            if (this.type){
                icon += this.type;
            }
            else if (this.icon){
                icon += this.icon;
            }
            else if (this.plugin && this.name){
                icon += this.name.replace(/\W+/g, "");
            }
            return '<div class="process-icon' + icon + '"></div>';
        },

        editProperties: function() {
            // Placeholder
        },

        copyActivity: function() {
            var self = this;

            var ownerId, ownerVersion, processType;
            if (this.graphEditor.applicationProcessId) {
                processType = "APPLICATION";
                ownerId = this.graphEditor.applicationProcessId;
                ownerVersion = this.graphEditor.applicationProcessVersion;
            }
            else if (this.graphEditor.componentProcessId) {
                processType = "COMPONENT";
                ownerId = this.graphEditor.componentProcessId;
                ownerVersion = this.graphEditor.componentProcessVersion;
            }
            else if (this.graphEditor.processId) {
                processType = "GENERIC";
                ownerId = this.graphEditor.processId;
                ownerVersion = this.graphEditor.processVersion;
            }
            else if (this.graphEditor.approvalProcess) {
                processType = "APPROVAL";
                ownerId = this.graphEditor.approvalProcess.environmentId;
                ownerVersion = this.graphEditor.approvalProcess.version;
            }

            var putData = {
                "name" : this.getName(),
                "label" : this.getLabel(),
                "activityId" : this.data.id,
                "ownerId" : ownerId,
                "ownerVersion": ownerVersion,
                "processType" : processType
            };

            xhr.put({
                url: bootstrap.restUrl+"copiedStep/",
                putData: JSON.stringify(putData),
                load: function(data) {
                    self.graphEditor.refreshStepPalette();
                    self.graphEditor.showSavePopup(i18n("'%s' copied successfully.", self.getLabel()));
                },
                error: function(error, ioArgs) {
                    var errorAlert = new Alert({
                        message: i18n("An error occurred while trying to copy the activity %s.", util.escape(self.getName()))
                    });
                }
            });
        },

        canEdit: function() {
            return true;
        },

        canDelete: function() {
            return !this.readOnly;
        },

        canCopy: function() {
            return true;
        },

        isUtilityCell: function() {
            return false;
        },

        setGraphHasChanges: function(){
            if (this.graphHasChanges){
                this.graphHasChanges();
            }
            else {
                document.hasChanges = true;
            }
        },

        createCell: function(x, y, h, w) {
            var self = this;
            if (this.cell) {
                throw "Cell already generated.";
            }

            var label = util.escape(this.getLabel());
            var style = this.getStyle();

            this.cell = this.graph.insertVertex(this.parent, '', label, x, y, null, null, style);
            this.cell.activity = this;
            this.cell.htmlLabels = true;

            this.sizeCell(h, w);

            var dropTarget = this.graph.getCellAt(x, y);
            if (dropTarget && dropTarget.edge) {
                this.edgePlaceholder = {
                    from: dropTarget.source,
                    to: dropTarget.target,
                    type: dropTarget.data ? dropTarget.data.type : null,
                    value: dropTarget.data ? dropTarget.data.value : null
                };
                this.graph.splitEdge(dropTarget, [this.cell], 0, 0);
            }

            this.addOverlays();

            if (this.parent) {
                var newGeometry = this.cell.getGeometry();
                var parentGeometry = this.parent.getGeometry();

                var newGeometryMaxX = newGeometry.x+newGeometry.width;
                var newGeometryMaxY = newGeometry.y+newGeometry.height;

                var resize = false;
                var newWidth = parentGeometry.width;
                var newHeight = parentGeometry.height;
                if (newGeometryMaxX > parentGeometry.width+20) {
                    newWidth = newGeometryMaxX+20;
                    resize = true;
                }
                if (newGeometryMaxY > parentGeometry.height+10) {
                    newHeight = newGeometryMaxY+10;
                    resize = true;
                }

                if (resize) {
                    this.parent.setGeometry(new mxGeometry(parentGeometry.x, parentGeometry.y,
                            newWidth, newHeight));
                }
            }
        },

        addOverlays: function() {
            if (this.canDelete()) {
                this.addDeleteOverlay();
            }

            if (this.canEdit()) {
                this.addEditOverlay();
            }

            if (this.canCopy()) {
                this.addCopyOverlay();
            }
        },

        addDeleteOverlay: function() {
            var self = this;

            var deleteOverlay = new mxCellOverlay(new mxImage(bootstrap.imageUrl+'icons/process/close_step.png', 24, 24));
            deleteOverlay.cursor = 'hand';
            deleteOverlay.offset = new mxPoint(0, 0);
            deleteOverlay.align = mxConstants.ALIGN_RIGHT;
            deleteOverlay.verticalAlign = mxConstants.ALIGN_TOP;
            deleteOverlay.addListener(
                mxEvent.CLICK,
                mxUtils.bind(this, function(sender, evt) {
                    var removeConfirm = new GenericConfirm({
                        message: i18n("Are you sure you want to remove this step?"),
                        action: function() {
                            self.destroy();
                            self.setGraphHasChanges();
                        }
                    });
                })
            );

            this.graph.addCellOverlay(this.cell, deleteOverlay);
        },

        addEditOverlay: function() {
            var self = this;

            var editOverlay = new mxCellOverlay(new mxImage(bootstrap.imageUrl+'icons/process/step_edit.png', 18, 18));
            editOverlay.cursor = 'hand';
            editOverlay.offset = new mxPoint(-22, 0);
            editOverlay.align = mxConstants.ALIGN_RIGHT;
            editOverlay.verticalAlign = mxConstants.ALIGN_TOP;
            editOverlay.addListener(mxEvent.CLICK,
                mxUtils.bind(this, function(sender, evt) {
                    self.editProperties(function() {
                        if (!self.readOnly) {
                            self.setGraphHasChanges();
                            self.graphEditor.registerChangedActivity(self);
                        }
                    });
                })
            );

            this.graph.addCellOverlay(this.cell, editOverlay);
        },

        addCopyOverlay: function() {
            var self = this;

            var copyOverlay = new mxCellOverlay(new mxImage(bootstrap.imageUrl+'/icons/process/step_copy.png', 18, 18));
            copyOverlay.cursor = 'hand';
            if (self.canEdit()) {
                copyOverlay.offset = new mxPoint(-44, 0);
            }
            else {
                copyOverlay.offset = new mxPoint(-22, 0);
            }
            copyOverlay.align = mxConstants.ALIGN_RIGHT;
            copyOverlay.verticalAlign = mxConstants.ALIGN_TOP;
            copyOverlay.addListener(mxEvent.CLICK,
                mxUtils.bind(this, function(sender, evt) {
                    // Do not copy new or unsaved changed steps.
                    if (self.data.id && !self.graphEditor.isActivityChanged(self)) {
                        self.copyActivity();
                    }
                    else {
                        var alert = new Alert({
                            message: i18n("This step has been edited. Please save the process before copying this step.")
                        });
                    }
                })
            );

            this.graph.addCellOverlay(this.cell, copyOverlay);
        },

        destroy: function() {
            this.inherited(arguments);
            var model = this.graph.getModel();

            model.beginUpdate();
            this.graph.removeCells([this.cell], true);
            model.endUpdate();

            if (this.edgePlaceholder) {
                var edgeArgs = this.edgePlaceholder;
                var source = edgeArgs.from;
                var target = edgeArgs.to;

                if (source.parent && target.parent) {
                    this.graphEditor.restoreEdge(edgeArgs);
                }
            }

            this.edgePlaceholder = null;
            if (!this.readOnly) {
                this.setGraphHasChanges();
            }
        },

        sizeCell: function(h, w) {
            var model = this.graph.getModel();
            var geometry = model.getGeometry(this.cell);

            if (!!h && !!w) {
                geometry.height = h;
                geometry.width = w;
            }
            else {
                var size = this.graph.getPreferredSizeForCell(this.cell);
                geometry.height = size.height;
                geometry.width = size.width;
            }
        },

        updateLabel: function() {
            var model = this.graph.getModel();

            model.beginUpdate();
            this.graph.labelChanged(this.cell, util.escape(this.getLabel()));
            this.graph.refresh();
            model.endUpdate();
        },

        removePropertyField: function(propertyForm, name) {
            var runtimeSwitchName = "runtime_switch_"+name;
            var configSwitchName = "config_switch_"+name;

            if (propertyForm.hasField(runtimeSwitchName)) {
                propertyForm.removeField(runtimeSwitchName);
            }
            if (propertyForm.hasField(configSwitchName)) {
                propertyForm.removeField(configSwitchName);
            }
            if (propertyForm.hasField(name)) {
                propertyForm.removeField(name);
            }
        },

        /**
         * Helper function for child classes.  Many activities will want to take advantage of the defaults present here.
         */
         createPropertyDialog: function(config) {
            var self = this;

            if (config === undefined) {
                config = {};
            }
            if (config.title === undefined) {
                config.title = i18n("Edit Properties");
            }
            if (config.closable === undefined) {
                config.closable = true;
            }
            if (config.draggable === undefined) {
                config.draggable = true;
            }

            var propertyDialog = new Dialog(config);

            propertyDialog.on("hide", function() {
                if (!self.initialized) {
                    self.destroy();
                }
            });

            return propertyDialog;
         },

        /**
         * Helper function for child classes.  Many activities will want to take advantage of the defaults present here.
         */
        createPropertyForm: function(config) {
            var self = this;

            if (config === undefined)  {
                config = {};
            }
            if (config.saveLabel === undefined) {
                config.saveLabel = i18n("OK");
            }

            // Client code MUST specify a dialog to attach to, merely because the alternative hasn't been fleshed out.
            var propertyDialog = config.dialog;
            if (!propertyDialog) {
                throw "Internal Error: Plugin must specify a dialog to attach it's property form to.";
            }

            var propertyForm = new ColumnForm(config);

            propertyForm.on("cancel", function() {
                if (!self.initialized) {
                    self.destroy();
                }

                propertyDialog.hide();
                propertyForm.destroy();
                propertyDialog.destroy();
            });

            return propertyForm;
        },

        addPropertyField: function(propertyForm, propertyFieldData, configModeOn, beforeField) {
            var runtimeSwitchName = "runtime_switch_"+propertyFieldData.name;
            var runtimeSwitchWidget = new DomNode();
            var runtimeSwitchLink = domConstruct.create("a", {
                "class": "linkPointer",
                "innerHTML": i18n("Prompt for a value on use"),
                "style": {
                    "marginBottom": "5px"
                }
            }, runtimeSwitchWidget.domAttach);
            var runtimeSwitchFieldData = {
                name: runtimeSwitchName,
                widget: runtimeSwitchWidget,
                label: ""
            };


            var configSwitchName = "config_switch_"+propertyFieldData.name;
            var configSwitchWidget = new DomNode();
            var configSwitchLink = domConstruct.create("a", {
                "class": "linkPointer",
                "innerHTML": i18n("Set a value here"),
                "style": {
                    "marginBottom": "5px"
                }
            }, configSwitchWidget.domAttach);
            var configSwitchFieldData = {
                name: configSwitchName,
                widget: configSwitchWidget,
                label: (propertyFieldData.label ? propertyFieldData.label.escape() : propertyFieldData.label)
            };

            on(runtimeSwitchLink, "click", function() {
                propertyForm.addField(configSwitchFieldData, propertyFieldData.name);
                propertyForm.removeField(runtimeSwitchName);
                propertyForm.removeField(propertyFieldData.name);
            });
            on(configSwitchLink, "click", function() {
                propertyForm.addField(propertyFieldData, configSwitchName);
                if (config.data.systemConfiguration.enablePromptOnUse) {
                    propertyForm.addField(runtimeSwitchFieldData, configSwitchName);
                }
                propertyForm.removeField(configSwitchName);
            });

            if (configModeOn) {
                propertyForm.addField(propertyFieldData, beforeField);
                if (!this.readOnly && config.data.systemConfiguration.enablePromptOnUse) {
                    propertyForm.addField(runtimeSwitchFieldData, beforeField);
                }
            }
            else {
                propertyForm.addField(configSwitchFieldData, beforeField);
            }
        },

        validateName: function(name) {
            var self = this;
            var result = [];
            
            if (name.indexOf("/") >= 0) {
                result.push(i18n("The name may not contain the following characters: /"));
            }

            array.forEach(self.graphEditor.getChildrenByName(name), function(nameDup) {
                if (nameDup.cell !== self.cell) {
                    result.push(i18n("That name is already in use by another activity in this process. Please choose a unique name."));
                }
            });
            
            return result;
        },

        getChildData: function() {
            var result = {};
            if (this.data.children && this.data.children.length === 1) {
                result = this.data.children[0];
            }

            return result;
        },

        getChildChildData: function() {
            var childData = this.getChildData();
            var result = {};
            if (childData.children && childData.children.length === 1) {
                result = childData.children[0];
            }

            return result;
        }
    });
});
