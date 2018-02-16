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
    dojo.provide("deploy.widgets.navigation.Reports");

    config.data.tabSets.push({
        id: "reports",
        hashPattern: ["offset", "reportName"],
        breadcrumbs: ["home", "topLevelTab"],
        selectedTopLevelTab: "reports",
    
        stateCalls: [{
           targetAppStateEntry: "report",
           getUrl: function(appStateTargets, newAppState) {
            
               var url = bootstrap.restUrl + "report/";
               var reportName;
               var offset;
               
               if (appStateTargets.reportName) {
                   reportName = appStateTargets.reportName;
                   offset = appStateTargets.offset;
                   url = url + offset + "/" + reportName;
               }
               else {
                   reportName = appStateTargets.offset;
                   url = url + reportName;
               }
               
               return url;
           }
        }],
        
        defaultTab: "reportPage",
        tabs: [{
            id: "reportPage",
            label: i18n("Reports"),
            view: "deploy/views/report/report"
        }]
    });
});