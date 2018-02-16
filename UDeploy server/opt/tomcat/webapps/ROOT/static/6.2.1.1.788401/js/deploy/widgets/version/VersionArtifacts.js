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
        "dojo/_base/declare",
        "dojo/dom-construct",
        "dojo/dom-class",
        "dojo/has",
        "dojo/on",
        "dijit/form/Button",
        "js/webext/widgets/ColumnForm",
        "js/webext/widgets/Alert",
        "js/webext/widgets/Dialog",
        "js/webext/widgets/GenericConfirm",
        "js/webext/widgets/table/TreeTable",
        "js/webext/widgets/Table",
        "deploy/widgets/Formatters"
        ],
function(
        _TemplatedMixin,
        _Widget,
        declare,
        domConstruct,
        domClass,
        has,
        on,
        Button,
        ColumnForm,
        Alert,
        Dialog,
        GenericConfirm,
        TreeTable,
        Table,
        formatters
) {
    /**
     *
     */
    return declare('deploy.widgets.version.VersionArtifacts',  [_Widget, _TemplatedMixin], {
        templateString:
            '<div class="versionArtifacts">'+
                '<div data-dojo-attach-point="countAttach"></div>'+
                '<div data-dojo-attach-point="treeAttach" class="fileTree"></div>'+
                '<div class="archiveAttach" data-dojo-attach-point="archiveAttach"></div>'+
            '</div>',

        emptyTreeMessage: null,

        /**
         *
         */
        postCreate: function() {
            this.inherited(arguments);
            var self = this;
            
            var sourceType;
            var useVfs;

            if (appState.component.sourceConfigPlugin) {
                sourceType = appState.component.sourceConfigPlugin.name;
                useVfs = appState.component.useVfs;
            }
            var anthillUrl, buildLifeId, linkContainer, anthillLink, uBuildUrl, uBuildLink;
            if (sourceType === "AnthillPro") {
                anthillUrl = util.getNamedPropertyValue(appState.component.properties, "AnthillComponentProperties/anthillUrl");
                buildLifeId = appState.version.name;

                linkContainer = domConstruct.create("div", null, self.treeAttach);
                linkContainer.style.paddingBottom = ".5em";

                anthillLink = document.createElement("a");
                anthillLink.innerHTML = i18n("View artifacts in Anthill");
                anthillLink.href = anthillUrl+"/tasks/project/BuildLifeTasks/viewArtifactList?buildLifeId="+buildLifeId;
                anthillLink.target = "_blank";

                linkContainer.appendChild(anthillLink);
            } else if (sourceType === "uBuild") {
                uBuildUrl = util.getNamedPropertyValue(appState.component.properties, "uBuildComponentProperties/uBuildUrl");
                buildLifeId = appState.version.name;

                linkContainer = domConstruct.create("div", null, self.treeAttach);
                linkContainer.style.paddingBottom = ".5em";

                uBuildLink = document.createElement("a");
                uBuildLink.innerHTML = i18n("View artifacts in uBuild");
                uBuildLink.href = uBuildUrl+"/tasks/project/BuildLifeTasks/viewArtifactList?buildLifeId="+buildLifeId;
                uBuildLink.target = "_blank";

                linkContainer.appendChild(uBuildLink);
            }

            this.showTree();
        },

        /**
         * 
         */
        destroy: function() {
            this.inherited(arguments);

            if (this.tree) {
                this.tree.destroy();
            }
        },
        
        /**
         * 
         */
        showTree: function() {
            var self = this;
            
            if (appState.version.archived) {
                var archiveLabel = domConstruct.create("div", {
                    "innerHTML": i18n("This version's artifacts have been archived."),
                    "class": "inlineBlock actionsLink"
                }, this.archiveAttach);
                var restoreLink = domConstruct.create("a", {
                    "innerHTML": i18n("Restore from Backup"),
                    "class": "linkPointer actionsLink"
                }, this.archiveAttach);
                on(restoreLink, "click", function() {
                    self.showRestoreDialog();
                });
            }
            
            if (appState.version.totalCount !== undefined) {
                var totalLabel = document.createElement("div");
                
                if (appState.component.componentType && appState.component.componentType === "ZOS") {
                    var totalAdd = "";
                    var totalDel = "";
                    var totalGeneric = "";
                    if (appState.version.totalZosAddPdsCount>0 || appState.version.totalZosAddSequentialCount>0) {
                        if (appState.version.totalZosAddPdsCount>0 && appState.version.totalZosAddSequentialCount>0) {
                            totalAdd = i18n("Total add: %s members in %s data sets, %s sequential data sets", 
                                    appState.version.totalZosAddPdsMemberCount, appState.version.totalZosAddPdsCount, appState.version.totalZosAddSequentialCount);
                        } else if (appState.version.totalZosAddPdsCount>0) {
                            totalAdd = i18n("Total add: %s members in %s data sets", appState.version.totalZosAddPdsMemberCount, appState.version.totalZosAddPdsCount);
                        } else if(appState.version.totalZosAddSequentialCount>0) {
                            totalAdd = i18n("Total add: %s sequential data sets", appState.version.totalZosAddSequentialCount);
                        }
                    }

                    if (appState.version.totalZosDelPdsCount>0 || appState.version.totalZosDelSequentialcount>0) {
                        if (appState.version.totalZosDelPdsCount>0 && appState.version.totalZosDelSequentialcount>0) {
                            totalDel = i18n("Total delete: %s members in %s data sets, %s sequential data sets", 
                                    appState.version.totalZosDelPdsMemberCount, appState.version.totalZosDelPdsCount, appState.version.totalZosDelSequentialcount);
                        } else if(appState.version.totalZosDelPdsCount>0){
                            totalDel = i18n("Total delete: %s members in %s data sets", appState.version.totalZosDelPdsMemberCount, appState.version.totalZosDelPdsCount);
                        } else if(appState.version.totalZosDelSequentialcount>0) {
                            totalDel = i18n("Total delete: %s sequential data sets", appState.version.totalZosDelSequentialcount);
                        }
                    }
                    
                    if(appState.version.totalZosGenericCount > 0) {
                        totalGeneric = i18n("Total generic artifacts: %s artifacts in %s containers", appState.version.totalZosGenericMemberCount, appState.version.totalZosGenericCount);
                    }
                    
                    var summary = totalAdd;
                    if (summary && totalDel) {
                        summary = summary + "<br/>" + totalDel;
                    } else {
                        summary = summary + totalDel;
                    }
                    if (summary && totalGeneric) {
                        summary = summary + "<br/>" + totalGeneric;
                    } else {
                        summary = summary + totalGeneric;
                    }
                    
                    totalLabel.innerHTML = summary;
                } else {
                    totalLabel.innerHTML = i18n("Total: %s (%s files)", util.fileSizeFormat(appState.version.totalSize), appState.version.totalCount);
                }
                
                this.countAttach.className = "innerContainerLabel";
                
                this.countAttach.appendChild(totalLabel);
            }
       
            var gridLayout = [            {
                name: i18n("Last Modified"),
                formatter: function(item, result, cellDom) {
                    if (item.lastModified !== 0 && item.type === "file") {
                        return util.dateFormatShort(item.lastModified);
                    }
                }
            }];
            var standardName = {
                    name: i18n("Name"),
                    formatter: function(item, result, cellDom) {
                        return formatters.artifactFormatter(item);
                    },
                    orderField: "name",
                    filterField: "name",
                    filterType: "text",
                    getRawValue: function(item) {
                        return item.name;
                    },
                    field: "name"
            };
            var zosName = {
                    name: i18n("Name"),
                    formatter: function(item, result, cellDom) {
                        return formatters.zosArtifactFormatter(item);
                    },
                    orderField: "name",
                    filterField: "name",
                    filterType: "text",
                    getRawValue: function(item) {
                        return item.name;
                    },
                    field: "name"
            };
            var zosArtifactsType = {
                    name: i18n("Artifact Type"),
                    formatter: function(item, result, cellDom) {
                        var formatResult = "";
                        if (item.type === "folder") {
                            if (item.zosContainerType && item.zosDeployAction) {
                                if (item.zosContainerType && "GENERIC" === item.zosContainerType.toUpperCase()) {
                                    formatResult = "[GENERIC]";
                                } else {
                                    formatResult = "[" + item.zosContainerType + "," + item.zosDeployAction + "]";
                                }
                            }
                            else {
                                formatResult = "[PDS,ADD]";
                            }
                        }
                        return formatResult;
                    },
                    orderField: "zosContainerType",
                    filterField: "zosContainerType",
                    filterType: "text",
                    getRawValue: function(item) {
                        var result = "";
                        if (item.type === "folder") {
                            if (item.zosContainerType && item.zosDeployAction) {
                                result = "[" + item.zosContainerType + "," + item.zosDeployAction + "]";
                            }
                            else {
                                result = "[PDS,ADD]";
                            }
                        }
                        return result;
                    },
                    field: "zosContainerType"
            };
            var deployType = {
                name: i18n("Deploy Type"),
                orderField: "deployType",
                filterField: "deployType",
                filterType: "text",
                getRawValue: function(item) {
                    var result = item.deployType;
                    if (!result) {
                        result = "";
                    }
                    return result;
                },
                field: "deployType"
            };
            
            var zOSCustomerProperties = {
                    name : i18n("Properties"),
                    formatter : function(item, result, cellDom) {
                        var customerPropertiesData = item.userAttributes||[];
                        var customeDataLength = customerPropertiesData.length;
                        if (customeDataLength > 0) {
                            var firstNameValuePair = customerPropertiesData[0].name.escape() + "=" + customerPropertiesData[0].value.escape();
                            var returnDom = domConstruct.create("div");
                            domConstruct.create("span",{
                                "innerHTML" : firstNameValuePair
                            }, returnDom);
                            
                            if (customeDataLength > 1) {
                                var propertiesLinkTitle = " (+" + customeDataLength + i18n(" more") + ")";
                                var showPropertiesLink = domConstruct.create("a", {
                                                                "class": "linkPointer",
                                                                "title": i18n("Click to view all"),
                                                                "innerHTML": i18n(propertiesLinkTitle)}, returnDom);
                                on(showPropertiesLink, "click", function() {
                                        var propertiesDialog = new Dialog({
                                            title: i18n("Artifact properties"),
                                            closable: true,
                                            draggable: true
                                        });
                                        var customerPropertiesTable = new Table({
                                                data: customerPropertiesData,
                                                serverSideProcessing: false,
                                                columns: [{
                                                            name: i18n("Name"),
                                                            field: "name",
                                                            orderField: "name",
                                                            getRawValue: function(item) {
                                                                    return item.name;
                                                                }
                                                            },{
                                                            name: i18n("Value"),
                                                            field: "value",
                                                            getRawValue: function(item) {
                                                                return item.value;
                                                            }
                                                        }],
                                                orderField: "name",
                                                hidePagination: true,
                                                style: {
                                                          maxWidth: "640px"
                                                        }
                                              });
                                        customerPropertiesTable.placeAt(propertiesDialog);
                                        propertiesDialog.show();
                                });
                            }

                            return returnDom;
                        }
                    }
            };
            var actions = {   
                name: i18n("Actions"),
                formatter: function(item, result, cellDom) {
                    if (item.type === "file" && !item.isSymlink) {
                        if (!appState.version.archived) {
                            var downloadLink = domConstruct.create("a", {
                                "class": "linkPointer",
                                "innerHTML": i18n("Download")
                            });
                            on(downloadLink, "click", function() {
                                util.downloadFile(bootstrap.restUrl+"deploy/version/"+appState.version.id+"/downloadArtifact/"+util.encodeIgnoringSlash(item.path));
                            });
                            return downloadLink;
                        }
                    }
                }
            };
            var sizeColumn = {
                name: i18n("Size"),
                formatter: function(item, result, cellDom) {
                    var finalResult;
                    if (item.isSymlink) {
                        finalResult = i18n("N/A (Symbolic Link)");
                    }
                    else if (item.type === "file") {
                        finalResult = util.fileSizeFormat(item.length);
                    }
                    else {
                        finalResult = i18n("%s (%s files)", util.fileSizeFormat(item.totalSize), item.totalCount);
                    }
                    return finalResult;
                }
            };

            if (appState.component.componentType && appState.component.componentType === "ZOS") {
                gridLayout.splice(0,0,zosName);
                gridLayout.splice(1,0,zosArtifactsType);
                gridLayout.splice(2,0,deployType);
                gridLayout.push(zOSCustomerProperties);
            }
            else {
                gridLayout.splice(0,0,standardName);
                gridLayout.splice(1,0,sizeColumn);
                gridLayout.push(actions);
            }
            
            this.tree = new TreeTable({
                url: bootstrap.restUrl+"deploy/version/"+appState.version.id+"/fileTree",
                columns: gridLayout,
                serverSideProcessing: false,
                orderField: "name",
                noDataMessage: i18n("No artifacts have been added yet"),
                tableConfigKey: "artifactList",
                getChildUrl: function(item) {
                    return bootstrap.restUrl+"deploy/version/"+appState.version.id+"/fileTree/"+util.encodeIgnoringSlash(item.$ref);
                }
            });

            if (appState.component.componentType !== "ZOS") {
                var downloadAllButton = new Button({
                    label: i18n("Download All"),
                    showTitle: false,
                    onClick: function() {
                        var timeAlert = new GenericConfirm({
                            message: i18n("For large files, this operation make take some time. Please be patient while your download begins."),
                            action: function() {
                                util.downloadFile(bootstrap.restUrl+"deploy/version/"+appState.version.id+"/downloadArtifacts");
                            }
                        });
                    }
                });
                domClass.add(downloadAllButton.domNode, "idxButtonSpecial");
                downloadAllButton.placeAt(this.tree.buttonAttach);
            }
            this.tree.placeAt(this.treeAttach);
        },
        
        showRestoreDialog: function() {
            var self = this;
            var restoreDialog = new Dialog({
                title: i18n("Restore Version Artifacts"),
                closable: true,
                draggable: true
            });
            
            var restoreForm = new ColumnForm({
                submitUrl: bootstrap.restUrl+"deploy/version/"+appState.version.id+"/restoreArtifacts",
                postSubmit: function(data) {
                    restoreDialog.hide();
                    restoreDialog.destroy();
                    
                    navBar.setHash("#version/"+appState.version.id, false, true);
                },
                onCancel: function() {
                    restoreDialog.hide();
                    restoreDialog.destroy();
                }
            });
            
            restoreForm.addField({
                name: "path",
                label: i18n("Path to Backup Zip"),
                description: i18n("The path to the backup zipfile containing the artifacts for this version."),
                value: self.findDefaultVersionPath(),
                type: "Text",
                bidiDynamicSTT: "FILE_PATH",
                required: true
            });
            
            restoreForm.placeAt(restoreDialog.containerNode);
            restoreDialog.show();
        },

        findDefaultVersionPath: function() {
            var result = config.data.systemConfiguration.cleanupArchivePath;

            var separator = config.data.systemConfiguration.serverFileSeparator;
            var lastChar = result.charAt(result.length - 1);
            if (lastChar !== separator) {
                result += separator;
            }

            var suffix = appState.component.name;
            suffix += "_";
            suffix += appState.version.name;
            suffix = suffix.replace("/", "_").replace("\\", "_");
            suffix += ".zip";

            result += suffix;

            return result;
        }
    });
});
