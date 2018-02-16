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
        "dijit/form/Select",
        "dojo/_base/array",
        "dojo/_base/declare",
        "dojo/dom-construct",
        "dojo/on",
        "deploy/widgets/DateRangeSelector",
        "js/webext/widgets/FormDelegates"
        ],
function(
        _TemplatedMixin,
        _Widget,
        Select,
        array,
        declare,
        domConstruct,
        on,
        DateRangeSelector,
        FormDelegates
) {
    return declare('deploy.widgets.report.deploymentReport.DeploymentReportForm',  [_Widget, _TemplatedMixin], {
        templateString: '<div></div>',

        applicationSelect: null,
        environmentSelect: null,
        userFilter: null,
        dateRangePicker: null,
        statusSelect: null,
        columnCheckBoxes: null,
        datePickerAttach: null,
        report: null,

        constructor: function(/*object*/ args) {
            var t = this;
            if (args.report) {
                t.report = args.report;
            }
            if (args.datePickerAttach) {
                t.datePickerAttach = args.datePickerAttach;
            }
        },

        buildRendering: function() {
            this.inherited(arguments);
            var t = this;

            var appDiv = domConstruct.create("div", {'class':'inlineBlock report-form-field'}, t.domNode);
            domConstruct.create("div", {"innerHTML": i18n("Application")}, appDiv);
            t.applicationSelect = FormDelegates.retrieveDelegate("TableFilterSelect")({
                "url": bootstrap.restUrl+"deploy/application",
                "idAttribute": "id",
                "name": "app",
                "allowNone": true,
                "placeHolder": "Any",
                "onChange": function(value, item) { t.updateEnvironmentOptions(value); },
                "formatDropDownLabel": function(labelDomNode, item) { labelDomNode.innerHTML = item.name.escape(); }
            });
            t.applicationSelect.placeAt(appDiv);

            var envDiv = domConstruct.create("div", {'class':'inlineBlock report-form-field'}, t.domNode);
            t.envDiv = envDiv;
            domConstruct.create("div", {"innerHTML": i18n("Environment")}, envDiv);
            t.updateEnvironmentOptions();

            // Date Range
            var dateDiv;

            if (!t.datePickerAttach) {
                dateDiv = domConstruct.create("div",{'class':'inlineBlock report-form-field'}, t.domNode);
            }
            else {
                dateDiv = domConstruct.create("div",{'class':'inlineBlock report-form-field'}, t.datePickerAttach);
            }

            t.dateRangePicker = new DateRangeSelector({timeUnit:"TIME_UNIT_DAY"});
            domConstruct.create("div", {"innerHTML": i18n("Date Range")}, t.datePickerAttach);
            t.dateRangePicker.placeAt(t.datePickerAttach);

            var userDiv = domConstruct.create("div",{'class':'inlineBlock report-form-field'}, t.domNode);
            domConstruct.create("div", {"innerHTML": i18n("User")}, userDiv);
            t.userFilter = FormDelegates.retrieveDelegate("TableFilterSelect")({
                "url": bootstrap.baseUrl+"security/user",
                "name": "user",
                "allowNone": true,
                "placeHolder": "Any",
                "formatDropDownLabel": function(labelDomNode, item) { labelDomNode.innerHTML = item.displayName; }
            });
            t.userFilter.placeAt(userDiv);

            var statusDiv = domConstruct.create("div", {'class':'inlineBlock report-form-field'}, t.domNode);
            domConstruct.create("div", {"innerHTML": i18n("Status")}, statusDiv);
            t.statusSelect = new Select({
                "name": "status",
                "value": "Any",
                "options": [{
                    "label": i18n("Any"),
                    "value": "",
                    "selected": true
                },{
                    "label": i18n("Success"),
                    "value": "SUCCESS"
                },{
                    "label": i18n("Failure"),
                    "value": "FAILURE"
                },{
                    "label": i18n("Running"),
                    "value": "RUNNING"
                },{
                    "label": i18n("Scheduled"),
                    "value": "SCHEDULED"
                },{
                    "label": i18n("Approval Rejected"),
                    "value": "APPROVAL_REJECTED"
                },{
                    "label": i18n("Awaiting Approval"),
                    "value": "AWAITING_APPROVAL"
                }
                ]
            });
            t.statusSelect.placeAt(statusDiv);

            var pluginDiv = domConstruct.create("div", {'class':'inlineBlock report-form-field'}, t.domNode);
            domConstruct.create("div", {"innerHTML": i18n("Plugin")}, pluginDiv);
            t.pluginSelect = FormDelegates.retrieveDelegate("TableFilterSelect")({
                "url": bootstrap.restUrl+"plugin/automationPlugin",
                "name": "plugin",
                "allowNone": true,
                "placeHolder": "Any",
                "formatDropDownLabel": function(labelDomNode, item) { labelDomNode.innerHTML = i18n(item.name); }
            });
            t.pluginSelect.placeAt(pluginDiv);

            t.setProperties(t.report.properties);
        },

        destroy: function() {
            var t = this;
            this.inherited(arguments);
            t.applicationSelect.destroy();
            t.environmentSelect.destroy();
            t.dateRangePicker.destroy();
            t.userFilter.destroy();
            t.statusSelect.destroy();
            t.pluginSelect.destroy();
            array.forEach(t.columnCheckBoxes, function(column) {
                column.checkBox.destroy();
            });
        },

        setProperties: function(/* Array*/ properties) {
            var t = this;

            var setFormWidgetProp = function(formWidget, name, value) {
                if (formWidget.get("name") === name) {
                    formWidget.set("value", value);

                    // environment depends upon applicationselect, so this has to be async
                    if (name === "app") {
                        t.updateEnvironmentOptions(value);
                    }
                }
            };

            array.forEach(properties, function(prop){
                var propName = prop.name;
                var propValue = prop.value;

                setFormWidgetProp(t.applicationSelect, propName, propValue);
                setFormWidgetProp(t.environmentSelect, propName, propValue);
                setFormWidgetProp(t.userFilter,        propName, propValue);
                setFormWidgetProp(t.statusSelect,      propName, propValue);
                setFormWidgetProp(t.pluginSelect,      propName, propValue);

                if (propName === "dateRange") {
                    t.dateRangePicker.set('value', propValue);
                }
                if (propName === "date_low") {
                    t.dateRangePicker.set('startDate', new Date(Number(propValue)));
                }
                if (propName === "date_hi") {
                    t.dateRangePicker.set('endDate', new Date(Number(propValue)));
                }
            });

        },

        getProperties: function() {
            var t = this;

            var properties = [];
            var addPropFromWidget = function(formWidget, isTime) {
                var name = formWidget.get('name');
                var value;
                if (name === "plugin") {
                    var item = formWidget.get('item');
                    if (item) {
                        value = item.name;
                    }
                    else {
                        value = formWidget.get('value');
                    }
                }
                else {
                    value = formWidget.get('value');
                }
                if (name && value) {
                    if (isTime) {
                        properties.push({ "name": name, "value": value.getTime() });
                    }
                    else {
                        properties.push({ "name": name, "value": value });
                    }
                }
            };

            addPropFromWidget(t.applicationSelect);
            addPropFromWidget(t.environmentSelect);
            addPropFromWidget(t.userFilter);
            addPropFromWidget(t.statusSelect);
            addPropFromWidget(t.pluginSelect);

            if (t.dateRangePicker) {
                properties.push({"name":"dateRange", "value":t.dateRangePicker.get('value')});
                if (t.dateRangePicker.get('value') === "custom") {
                    if (t.dateRangePicker.getStartDate() !== null) {
                        properties.push({"name":"date_low", "value":t.dateRangePicker.getStartDate().getTime()});
                    }
                    if (t.dateRangePicker.getEndDate() !== null) {
                        properties.push({"name":"date_hi", "value":t.dateRangePicker.getEndDate().getTime()});
                    }
                }
            }
            return properties;
        },

        setColumns: function(/* Array*/ hiddenColumns) {
            var t = this;
            array.forEach(t.columnCheckBoxes, function(column) {
                if (hiddenColumns.indexOf(column.field) > -1) {
                    column.checkBox.set('value', false);
                } else {
                    column.checkBox.set('value', true);
                }
            });
        },

        getColumns: function() {
            var t = this;

            var hiddenColumns = [];
            array.forEach(t.columnCheckBoxes, function(column) {
                if (column.checkBox && column.checkBox.getValue() === false) {
                    hiddenColumns.push(column.field);
                }
            });
            return hiddenColumns;
        },

        updateEnvironmentOptions: function(newApp) {
            var t = this;

            var value = i18n("Any");
            if (t.environmentSelect) {
                value = t.environmentSelect.get("value");
                t.environmentSelect.destroy();
            }
            var params = {
                "name": "env",
                "allowNone": true,
                "placeHolder": "Any",
                "formatDropDownLabel": function(labelDomNode, item) { labelDomNode.innerHTML = item.name; }
            };
            if (newApp) {
                params.url = bootstrap.restUrl+"deploy/application/"+newApp+"/environments/true";
            }
            else {
                params.data = [];
            }
            t.environmentSelect = FormDelegates.retrieveDelegate("TableFilterSelect")(params);
            t.environmentSelect.placeAt(t.envDiv);
        }
    });
});