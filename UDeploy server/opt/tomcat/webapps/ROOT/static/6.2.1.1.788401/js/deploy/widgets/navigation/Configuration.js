/*
* Licensed Materials - Property of IBM Corp.
* IBM UrbanCode Deploy
* (c) Copyright IBM Corporation 2011, 2014. All Rights Reserved.
*
* U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
* GSA ADP Schedule Contract with IBM Corp.
*/
define(["dojo/_base/kernel",
        "dojox/html/entities"],
function(dojo,
         entities) {
    dojo.provide("deploy.widgets.navigation.Configuration");

    config.data.tabSets.push({
        id: "configuration",
        hashPattern: ["tab"],
        breadcrumbs: ["home", "topLevelTab"],
        selectedTopLevelTab: "configuration",
        
        defaultTab: "tree",
        tabs: [{
            id: "tree",
            label: i18n("Tree"),
            view: "deploy/views/configuration/configurationTree"
        }]
    });
});