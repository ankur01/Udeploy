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
        "dojo/_base/xhr",
        "dojo/on",
        "dojo/dom-construct",
        "js/webext/widgets/TwoPaneListManager",
        "deploy/widgets/application/EditApplication",
        "deploy/widgets/application/ApplicationEnvironmentConditions",
        "deploy/widgets/property/PropValues"
        ],
function(
        array,
        declare,
        xhr,
        on,
        domConstruct,
        TwoPaneListManager,
        EditApplication,
        ApplicationEnvironmentConditions,
        PropValues
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
                label: i18n("Application Properties"),
                action: function() {
                    self.addHeading(i18n("Application Properties"));
                    self.showProperties();
                }
            });
            
            self.addEntry({
                id: "gates",
                label: i18n("Environment Gates"),
                action: function() {
                    self.addHeading(i18n("Environment Gates"));
                    self.showGates();
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
            var editApplication = new EditApplication({
                application: appState.application,
                readOnly: !appState.application.security["Edit Basic Settings"]
            });
            editApplication.placeAt(this.detailAttach);
        },
        
        showProperties: function() {
            var self = this;
            var propValues = new PropValues({
                propSheet: appState.application.propSheet,
                readOnly: !appState.application.security["Manage Properties"]
            });
            propValues.placeAt(self.detailAttach);
        },
        
        showGates: function() {
            var gates = new ApplicationEnvironmentConditions({
                application: appState.application,
                applicationTemplate: appState.application.template
            });
            gates.placeAt(this.detailAttach);
        }
    });
});