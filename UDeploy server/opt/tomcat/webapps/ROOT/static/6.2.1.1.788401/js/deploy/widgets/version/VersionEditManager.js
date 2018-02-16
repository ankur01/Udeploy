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
        "dojo/_base/array",
        "dojo/_base/declare",
        "dojo/on",
        "dojo/dom-construct",
        "js/webext/widgets/TwoPaneListManager",
        "deploy/widgets/version/EditVersion",
        "deploy/widgets/property/PropSheetDefValues"
        ],
function(
        array,
        declare,
        on,
        domConstruct,
        TwoPaneListManager,
        EditVersion,
        PropSheetDefValues
) {
    /**
     *
     */
    return declare([TwoPaneListManager], {
        /**
         *
         */
        postCreate: function() {
            this.inherited(arguments);
            var self = this;
            
            this.showList();
        },
        
        /**
         * 
         */
        showList: function(selectedId) {
            var self = this;

            self.addEntry({
                id: "basic",
                label: i18n("Basic Settings"),
                action: function() {
                    self.addHeading(i18n("Basic Settings"));
                    self.showBasicSettings();
                }
            });
            
            self.addEntry({
                id: "properties",
                label: i18n("Version Properties"),
                action: function() {
                    self.addHeading(i18n("Version Properties"));
                    self.showProperties();
                }
            });
        },
        
        addHeading: function(heading) {
            domConstruct.create("div", {
                innerHTML: heading,
                "class": "containerLabel",
                style: {
                    padding: "10px"
                }
            }, this.detailAttach);
        },
        
        addDescription: function(description) {
            domConstruct.create("div", {
                innerHTML: description,
                style: {
                    marginBottom: "10px"
                }
            }, this.detailAttach);
        },
        
        showBasicSettings: function() {
            var editVersion = new EditVersion({
                component: appState.component,
                version: appState.version,
                readOnly: !appState.component.extendedSecurity[security.component.manageVersions],
                callback: function() {
                    if (appState.component) {
                        navBar.setHash("component/"+appState.component.id+"/versions");
                    }
                }
            });
            editVersion.placeAt(this.detailAttach);
        },

        showProperties: function() {
            var self = this;

            var componentPropSheet = util.getNamedProperty(appState.version.propSheets, undefined);
            var componentPropSheetForm = new PropSheetDefValues({
                propSheetDefPath: componentPropSheet.propSheetDef.path,
                propSheetDefVersion: componentPropSheet.propSheetDef.version,
                propSheetPath: componentPropSheet.path,
                noPropertiesMessage: i18n("No version properties have been defined by this component."),
                readOnly: !appState.component.extendedSecurity[security.component.manageVersions]
            });
            componentPropSheetForm.placeAt(self.detailAttach);
        }
    });
});
