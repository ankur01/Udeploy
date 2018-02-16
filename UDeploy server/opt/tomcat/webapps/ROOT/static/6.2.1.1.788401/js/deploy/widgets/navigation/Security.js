/*
* Licensed Materials - Property of IBM Corp.
* IBM UrbanCode Deploy
* (c) Copyright IBM Corporation 2011, 2014. All Rights Reserved.
*
* U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
* GSA ADP Schedule Contract with IBM Corp.
*/
/*global security*/
define(["dojo/_base/kernel",
        "dojox/html/entities",
        "deploy/widgets/Security"],
function(dojo,
         entities,
         Security) {
    dojo.provide("deploy.widgets.navigation.Security");
    
    config.data.breadcrumbItems.push({
        id: "myprofile",
        getHash: function() {
            return "myprofile";
        },
        isUserData: false,
        getLabel: function() {
            return i18n("My Profile");
        }
    });
    
    config.data.tabSets.push({
        id: "myprofile",
        hashPattern: ["tab"],
        breadcrumbs: ["home", "myprofile"],
        selectedTopLevelTab: "root",
    
        defaultTab: "teams",
        tabs: [{
            id: "teams",
            label: i18n("Teams"),
            view: "deploy/views/security/userTeams"
        },{
            id: "preferences",
            label: i18n("Preferences"),
            view: "deploy/views/security/userPreferences"
        }]
    });
    
    config.data.tabSets.push({
        id: "tools",
        hashPattern: ["tab"],
        breadcrumbs: ["tab"],
        selectedTopLevelTab: "root",
       
        defaultTab: "main",
        tabs: [{
            id: "main",
            label: i18n("Tools"),
            view: "deploy/views/tools/Main"
        }]
    });
    
    config.data.tabSets.push({
        id: "security",
        hashPattern: ["tab"],
        breadcrumbs: ["home", "topLevelTab", "security"],
        selectedTopLevelTab: "settings",
        
        defaultTab: "authentication",
        tabs: [{
            id: "authentication",
            label: i18n("Authentication"),
            view: "deploy/views/security/authenticationRealmManager",
            isVisible: function() {
                return config.data.permissions[security.system.manageSecurity];
            }
        },{
            id: "authorization",
            label: i18n("Authorization"),
            view: "deploy/views/security/authorizationRealmManager",
            isVisible: function() {
                return config.data.permissions[security.system.manageSecurity];
            }
        },{
            id: "teams",
            label: i18n("Teams"),
            view: "deploy/views/security/teamManager",
            isVisible: function() {
                return config.data.permissions[security.system.manageSecurity];
            }
        },{
            id: "tokens",
            label: i18n("Tokens"),
            view: "deploy/views/security/tokens",
            isVisible: function() {
                return config.data.permissions[security.system.manageSecurity];
            }
        },{
            id: "roles",
            label: i18n("Role Configuration"),
            view: "deploy/views/security/roleManager",
            isVisible: function() {
                return config.data.permissions[security.system.manageSecurity];
            }
        },{
            id: "keys",
            label: i18n("API Keys"),
            view: "deploy/views/security/keyManager",
            isVisible: function() {
                return config.data.permissions[security.system.manageSecurity];
            }
        },{
            id: "types",
            label: i18n("Type Configuration"),
            view: "deploy/views/security/resourceRoleManager",
            isVisible: function() {
                return config.data.permissions[security.system.manageSecurity];
            }
        }]
    });

    config.data.breadcrumbItems.push({
        id: "security",
        getHash: function() {
            return "security";
        },
        isUserData: false,
        getLabel: function() {
            return i18n("Security");
        }
    });
});
