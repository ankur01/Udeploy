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
    dojo.provide("deploy.widgets.Security");
    
    security = {
        general: {
            editBasicSettings: "Edit Basic Settings"
        },
        agent: {
            addToAgentPool: "Add to Agent Pool",
            createResources: "Create Resources",
            manageVersionImports: "Manage Version Imports"
        },
        application: {
            runComponentProcesses: "Run Component Processes",
            manageSnapshots: "Manage Snapshots"
        },
        component: {
            manageVersions: "Manage Versions"
        },
        resource: {
            mapToEnvironments: "Map to Environments",
            resourceBasicSettings: "Basic Settings (Resources)",
            resourceProperties: "Manage Properties (Resources)",
            resourceTeams: "Manage Teams (Resources)",
            manageImpersonation: "Manage Impersonation",
            resourceManageChildren: "Manage Resource Children"
        },
        system: {
            createComponents: "Create Components",
            createComponentsFromTemplate: "Create Components From Template",
            createComponentTemplates: "Create Component Templates",
            createApplications: "Create Applications",
            createApplicationsFromTemplate: "Create Applications From Template",
            createApplicationTemplates: "Create Application Templates",
            createEnvironments: "Create Environments",
            createEnvironmentsFromTemplate: "Create Environments From Template",
            createEnvironmentTemplates: "Create Environment Templates",
            createResources: "Create Resources",
            createResourceTemplates: "Create Resource Templates",
            createAgentPools: "Create Agent Pools",
            createProcess: "Create Processes",
            createManageResourceRoles: "Manage Resource Roles",
            manageSecurity: "Manage Security",
            managePlugins: "Manage Plugins"
        },
        resourceTypes: {
            ui: "20000000000000000000000000000200",
            system: "20000000000000000000000000000201"
        }
    };
});