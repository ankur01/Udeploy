/*
* Licensed Materials - Property of IBM Corp.
* IBM UrbanCode Deploy
* (c) Copyright IBM Corporation 2011, 2015. All Rights Reserved.
*
* U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
* GSA ADP Schedule Contract with IBM Corp.
*/
/*global define, require */
define([
        "dijit/_Widget",
        "dojo/_base/xhr",
        "js/webext/widgets/Dialog",
        "js/webext/widgets/RadioButtonGroup",
        "js/webext/widgets/ColumnForm",
        "js/webext/widgets/Alert",
        "dojo/_base/declare",
        "deploy/widgets/resource/ResourceSelector"
       ],
function(
       _Widget,
       xhr,
       Dialog,
       RadioButtonGroup,
       ColumnForm,
       Alert,
       declare,
       ResourceSelector
) {
    return declare([_Widget], {
        dialog: undefined,
        resource:undefined,
        resourceTemplate:undefined,

        postCreate: function() {
            this.inherited(arguments);
        },
        
        show: function() {
            var self = this;
            if (!!self.resourceTemplate) {
                xhr.get({
                    url: bootstrap.restUrl+"resource/resourceTemplate/" + self.resourceTemplate.id + "/root",
                    handleAs: "json",
                    load: function(rootResourceData) {
                        self.resource = rootResourceData;
                        self.setup();
                    },
                    error: function(response) {
                        var dndAlert = new Alert({
                            message: util.escape(response.responseText)
                        });
                    }
                });
            }
            else {
                self.setup();
            }
        },

        setup: function() {
            var self = this;
            self.dialog = new Dialog({
                title: i18n("Compare Resources"),
                closable: true,
                draggable: true
            });
            
            var radioButtonGroup = new RadioButtonGroup({
                name:"compareType",
                options: [
                    {
                        label:i18n("Compare With Resource Template"),
                        value:true
                    },{
                        label:i18n("Compare With Resource"),
                        value:false
                    }
                ],
                disabled:false,
                enabled:true,
                onChange: function(againstTemplate) {
                    radioButtonGroup.destroy();
                    var form = new ColumnForm({
                        onSubmit: function(data) {
                            self.dialog.hide();
                            self.dialog.destroy();
                            if (againstTemplate) {
                                xhr.get({
                                    url: bootstrap.restUrl+"resource/resourceTemplate/" + data.resourceTemplateId + "/root",
                                    handleAs: "json",
                                    load: function(rootResourceData) {
                                        navBar.setHash("resourceComparison/" + self.resource.id + "/" + rootResourceData.id);
                                    },
                                    error: function(response) {
                                        var dndAlert = new Alert({
                                            message: util.escape(response.responseText)
                                        });
                                    }
                                });
                            }
                            else {
                               navBar.setHash("resourceComparison/"+self.resource.id+"/"+data.targetResource);
                            }
                        },
                        onCancel: function() {
                            self.dialog.hide();
                            self.dialog.destroy();
                    
                        }
                    });
                    
                    if (againstTemplate) {
                        form.addField({
                            name: "resourceTemplateId",
                            label: i18n("Resource Template"),
                            description: i18n("Choose the resource template to compare to this resource. This will compare the root resource in the template to the current resource."),
                            type: "TableFilterSelect",
                            url: bootstrap.restUrl+"resource/resourceTemplate",
                            required: true
                        });
                    }
                    else {
                        var resourceSelect = new ResourceSelector({
                            url: bootstrap.restUrl+"resource/resource/tree",
                            isSelectable: function(resourceOption) {
                                return resourceOption.path.indexOf(self.resource.path) === -1 && self.resource.path.indexOf(resourceOption.path) !== 0;
                            }
                        });
                        form.addField({
                            name: "targetResource",
                            label: i18n("Target Resource"),
                            widget: resourceSelect,
                            required: true
                        });
                    }
                    
                    form.placeAt(self.dialog.containerNode);
                }
            });
            radioButtonGroup.placeAt(self.dialog.containerNode);
            self.dialog.show();
        }
    });
});