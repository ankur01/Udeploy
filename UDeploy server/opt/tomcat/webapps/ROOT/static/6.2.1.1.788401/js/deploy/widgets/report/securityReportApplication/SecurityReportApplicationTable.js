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
    return declare('deploy.widgets.report.securityReportApplication.SecurityReportApplicationTable',  [ReportTable], {

        reportRestUrlBase: null,
        reportResultTable: null, // Table.js of current report results

        selectableColumns: true,

        constructor: function() {
            var t = this;
            this.reportRestUrlBase = bootstrap.restUrl + "report/";
        },

        formatters: {
            multiNameFormatter : function(item, value) {
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
        reportType : 'com.urbancode.ds.subsys.report.domain.security_report.environment.SecurityReportApplication',

        getReportResultLayout: function() {
            var self = this;
            var reportResultLayout = [
                {
                    name: i18n("Application"),
                    field:"application",
                    getRawValue:function(item) {
                        return item.application;
                    },
                    orderField:"application"
                },{
                    formatter: self.formatters.multiNameFormatter,
                    name: i18n("Run Component Processes"),
                    field:"Run Component Processes"
                },{
                    formatter: self.formatters.multiNameFormatter,
                    name: i18n("Create"),
                    field:"Create Applications"
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
                    name: i18n("View"),
                    field:"View Applications"
                },{
                    formatter: self.formatters.multiNameFormatter,
                    name: i18n("Manage Blueprints"),
                    field: "Manage Blueprints"
                },{
                    formatter: self.formatters.multiNameFormatter,
                    name: i18n("Manage Components"),
                    field: "Manage Components"
                },{
                    formatter: self.formatters.multiNameFormatter,
                    name: i18n("Manage Environments"),
                    field: "Manage Environments"
                },{
                    formatter: self.formatters.multiNameFormatter,
                    name: i18n("Manage Processes"),
                    field: "Manage Processes"
                },{
                    formatter: self.formatters.multiNameFormatter,
                    name: i18n("Manage Properties"),
                    field: "Manage Properties"
                },{
                    formatter: self.formatters.multiNameFormatter,
                    name: i18n("Manage Snapshots"),
                    field:"Manage Snapshots"
                },{
                    formatter: self.formatters.multiNameFormatter,
                    name: i18n("Manage Teams"),
                    field: "Manage Teams"
                }];
            return reportResultLayout;
        }
    });
});