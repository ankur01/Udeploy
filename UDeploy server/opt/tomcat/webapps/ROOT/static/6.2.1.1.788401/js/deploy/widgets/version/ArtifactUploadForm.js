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
        "dijit/_Widget",
        "dojo/_base/declare",
        "dojo/topic",
        "js/webext/widgets/Alert",
        "js/webext/widgets/Dialog"
        ],
function(
        _Widget,
        declare,
        topic,
        Alert,
        Dialog
) {
    /**
     *
     */
    return declare('deploy.widgets.version.ArtifactUploadForm',  [_Widget], {
        /**
         *
         */
        postCreate: function() {
            var self = this;
            
            var dialog = new Dialog({
                title: i18n("Upload Artifacts"),
                closable: true,
                draggable: true
            });
            
            var form = document.createElement("form");
            form.target = "formTarget";
            form.action = bootstrap.tasksUrl+"PluginTasks/loadPlugin";
            form.method = "POST";
            form.enctype = "multipart/form-data";
            form.encoding = "multipart/form-data";
            
            var fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.name = "file";
            
            var submitButton = document.createElement("input");
            submitButton.type = "submit";
            submitButton.value = i18n("Submit");
            submitButton.style.display = "block";
            
            form.appendChild(fileInput);
            form.appendChild(submitButton);
            dialog.containerNode.appendChild(form);
            
            form.onsubmit = function() {
                var result = true;
                if (!fileInput.value) {
                    var fileAlert = new Alert({
                        message: i18n("Please choose a file to upload.")
                    });
                    result = false;
                }
                else {
                    var subscription = topic.subscribe("formTarget", function() {
                        topic.unsubscribe(subscription);
                        
                        setTimeout(function() {
                            dialog.hide();
                            dialog.destroy();
                            self.grid.refresh();
                        }, 20);
                    });
                }
                return result;
            };

            dialog.show();
        }
    });
});