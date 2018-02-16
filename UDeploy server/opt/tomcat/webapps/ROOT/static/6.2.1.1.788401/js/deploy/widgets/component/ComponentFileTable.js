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
        "dijit/form/Button",
        "dojo/_base/declare",
        "dojo/dom-construct",
        "dojo/on",
        "js/webext/widgets/Dialog",
        "js/webext/widgets/table/TreeTable",
        "deploy/widgets/resource/TransientResourceCompareTree",
        "dojo/_base/xhr",
        "deploy/widgets/version/VersionFileCompare"
        ],
function(
        _TemplatedMixin,
        _Widget,
        Button,
        declare,
        domConstruct,
        on,
        Dialog,
        TreeTable,
        TransientResourceCompareTree,
        xhr,
        VersionFileCompare
) {
    /**
     *
     */
    return declare('deploy.widgets.component.ComponentFileTable',  [_Widget, _TemplatedMixin], {
        templateString:
            '<div>'+
              '<div class="containerLabel" data-dojo-attach-point="labelAttach"></div>'+
              '<div class="innerContainer">'+
                  '<div data-dojo-attach-point="gridAttach"></div>'+
              '</div>'+
            '</div>',

        /**
         *
         */
        postCreate: function() {
            this.inherited(arguments);
            if (this.component.componentType === "ZOS") {
                this.labelAttach.innerHTML = i18n("Data Set Difference Report for %s", this.component.name.escape());
            } else{
                this.labelAttach.innerHTML = i18n("File Difference Report for %s", this.component.name.escape());
            }
            var self = this;
            var name1;
            if (self.title1) {
                name1 = i18n("%s - Version: %s (Last Modified)", this.title1, this.version.name);
            }
            else {
                name1 = i18n("Version: %s (Last Modified)", this.version.name);
            }
            var name2;
            if (self.title2) {
                name2 = i18n("%s - Version: %s (Last Modified)", this.title2, this.otherVersion.name);
            }
            else {
                name2 = i18n("Version: %s (Last Modified)", this.otherVersion.name);
            }
            var gridLayout = [];
            if (this.component.componentType === "ZOS") {
                gridLayout = self.createzOSCompareTableLayout(name1, name2);
            } else {
                gridLayout = self.createCompareTableLayout(name1, name2);
            }
            var noDataMessage = i18n("No file differences found.");
            if (!this.component.useVfs) {
                noDataMessage = i18n("This component does not store its artifacts in CodeStation.");
            }
            else if (this.component.sourceConfigPlugin) {
                if (this.component.sourceConfigPlugin.name === "AnthillPro") {
                    noDataMessage = i18n("This component does not store its artifacts in CodeStation.");
                }
            }
            if(this.component.componentType === "ZOS") {
                noDataMessage = i18n("No difference between the two versions.");
            }

            var gridRestUrl = bootstrap.restUrl+"deploy/component/"+this.component.id+"/"+this.version.id+"/compareVersions/"+this.otherVersion.id;
            this.grid = new TreeTable({
                url: gridRestUrl,
                serverSideProcessing: false,
                columns: gridLayout,
                tableConfigKey: "versionFileList",
                noDataMessage: noDataMessage,
                hidePagination: false,
                hideExpandCollapse: true
            });
            this.grid.placeAt(this.gridAttach);
        },

        /**
         *
         */
        modifiedFormatter: function(item, value, version) {
            var result = i18n("Not deployed");
            if (value === 0 || value) {
                result = document.createElement("div", {"class": "downContainer"});
                if (value > 0) {
                    result.innerHTML = util.tableDateFormatter(item, value);
                }
                else {
                    result.innerHTML = i18n("No Date");
                }
                if (!version.archived && version.component && version.component.componentType && version.component.componentType !== "ZOS") {
                    var openParen = domConstruct.create("span", {"innerHTML": "  (", "style": {whiteSpace: "pre"}}, result);
                    var downloadLink = domConstruct.create("a", {
                        "class": "linkPointer",
                        "innerHTML": i18n("Download")
                    }, result);
                    on(downloadLink, "click", function() {
                        util.downloadFile(bootstrap.restUrl+"deploy/version/"+version.id+"/downloadArtifact/"+util.encodeIgnoringSlash(item.download));
                    });
                    var closeParen = domConstruct.create("span", {"innerHTML": ")"}, result);
                }
            }
            return result;
        },

        /**
         *
         */
        compFormatter: function(componentVersion, componentOtherVersion, path) {
            var result = document.createElement("div");
            var downloadLink = domConstruct.create("a", {
                "class": "linkPointer",
                "innerHTML": i18n("Compare")
            }, result);

            on(downloadLink, "click", function() {
                xhr.get({
                    url: bootstrap.restUrl+"deploy/version/"+componentVersion.id+"/fileCompare/"+componentOtherVersion.id+"/"+path,
                    handleAs: "json",
                    load: function(data) {

                        if (data.type === "resource") {
                            var dialog = new Dialog({
                                title: i18n("Differences"),
                                closable: true,
                                draggable: false,
                                width: -50
                            });

                            var resourceCompareTree = new TransientResourceCompareTree({
                                readOnly: true,
                                data:data.data
                            });
                            resourceCompareTree.placeAt(dialog.containerNode);
                            dialog.show();
                        }
                        else if (data.type === "file") {
                            var compareDialog = new VersionFileCompare({
                                data: data.data,
                                title: i18n("File Differences"),
                                version1: "Version " + componentVersion.name,
                                version2: "Version " + componentOtherVersion.name
                            });
                            compareDialog.show();
                        }
                    }
                });
            });
            return result;
        },
        /**
         * zOS compare table layout will not need action column and download link for member,
         * also will display path as DS(member)
         */
        createzOSCompareTableLayout: function(name1, name2) {
            var self = this;
            return [{
                name: i18n("Artifact"),
                field: "name",
                formatter: function(item, value) {
                    var result = value;
                    if (value.indexOf("/")>0) {
                        result = value.replace(/\//g, "(");
                        result += ")";
                    }

                    return result;
                }
            },{
                name: "Artifact Type",
                field: "artifactType",
                formatter: function(item, value) {
                    return "["+value+"]";
                }
            },{
                name: name1,
                field: "version1Modified",
                formatter: function(item, value) {
                    return self.modifiedFormatter(item, value, self.version);
                }
            },{
                name: name2,
                field: "version2Modified",
                formatter: function(item, value) {
                    return self.modifiedFormatter(item, value, self.otherVersion);
                }
            }];
        },
        createCompareTableLayout: function (name1, name2) {
            var self = this;
            return [{
                name: i18n("Path"),
                field: "name"
            },{
                name: name1,
                field: "version1Modified",
                formatter: function(item, value) {
                    return self.modifiedFormatter(item, value, self.version);
                }
            },{
                name: name2,
                field: "version2Modified",
                formatter: function(item, value) {
                    return self.modifiedFormatter(item, value, self.otherVersion);
                }
            },{
                name: i18n("Actions"),
                field: "changes",
                formatter: function(item, value) {
                    if (value) {
                        var thisVersion = self.version;
                        var otherVersion = self.otherVersion;
                        return self.compFormatter(thisVersion, otherVersion, value);
                    }
                }
            }];
        },

        /**
         *
         */
        destroy: function() {
            this.inherited(arguments);
            this.grid.destroy();
            if (this.compareDialog) {
                this.compareDialog.destroy();
            }
        }
    });
});
