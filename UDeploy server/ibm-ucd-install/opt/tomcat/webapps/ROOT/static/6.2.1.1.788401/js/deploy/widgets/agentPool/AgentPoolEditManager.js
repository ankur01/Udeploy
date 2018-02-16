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
        "deploy/widgets/agentPool/EditAgentPool"
        ],
function(
        array,
        declare,
        xhr,
        on,
        domConstruct,
        TwoPaneListManager,
        EditAgentPool
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
            var editAgentPool = new EditAgentPool({
                agentPool: appState.agentPool,
                readOnly: !appState.agentPool.security["Edit Basic Settings"]
            });
            editAgentPool.placeAt(this.detailAttach);
        }
    });
});