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
        "dojo/dom-construct",
        "dojox/html/entities",
        "deploy/widgets/report/ReportTable"
        ],
function(
        array,
        declare,
        domConstruct,
        entities,
        ReportTable
) {
    /**
     *
     */
    return declare('deploy.widgets.report.securityReportEnvironment.SecurityReportEnvironmentTable',  [ReportTable], {

        reportRestUrlBase: null,
        reportResultTable: null, // Table.js of current report results

        selectableColumns: true,

        constructor: function() {
                var t = this;
                this.reportRestUrlBase = bootstrap.restUrl + "report/";
        },

        reportType : 'com.urbancode.ds.subsys.report.domain.security_report.environment.SecurityReportEnvironment',

        formatters: {
            multiNameFormatter: function(item, value) {
                var div = domConstruct.create("div");
                var values = value ? value.split(",") :  null;

                array.forEach(values, function(it, index) {
                    if (index !== 0) {
                        domConstruct.create('br', {}, div);
                    }
                    domConstruct.create('span', {innerHTML:entities.encode(it)}, div);
                });
                        return div;
            }
        },

        getReportResultLayout: function() {
            var self = this;
            var reportResultLayout = [{
                    name: i18n("Application"),
                        field:"application",
                        getRawValue:function(item) {
                            return item.application;
                        },
                        orderField:"application"
                    },{
                        name: i18n("Environment"),
                        field:"environment",
                        getRawValue:function(item) {
                            return item.environment;
                        },
                        orderField:"environment"
                    },{
                        formatter: self.formatters.multiNameFormatter,
                        name: i18n("Create"),
                        field:"Create Environments"
                    },{
                        formatter: self.formatters.multiNameFormatter,
                        name: i18n("Delete"),
                        field:"Delete"
                    },{
                        formatter: self.formatters.multiNameFormatter,
                        name: i18n("Edit Basic Settings"),
                        field:"Edit Basic Settings"
                    },{
                        formatter: self.formatters.multiNameFormatter,
                        name: i18n("Execute"),
                        field:"Execute on Environments"
                    },{
                        formatter: self.formatters.multiNameFormatter,
                        name: i18n("Manage Approval Processes"),
                        field:"Manage Approval Processes"
                    },{
                        formatter: self.formatters.multiNameFormatter,
                        name: i18n("Manage Base Resources"),
                        field:"Manage Base Resources"
                    },{
                        formatter: self.formatters.multiNameFormatter,
                        name: i18n("Manage Properties"),
                        field:"Manage Properties"
                    },{
                        formatter: self.formatters.multiNameFormatter,
                        name: i18n("Manage Teams"),
                        field:"Manage Teams"
                    },{
                        formatter: self.formatters.multiNameFormatter,
                        name: i18n("View"),
                        field:"View Environments"
                }];
            return reportResultLayout;
        }
    });
});