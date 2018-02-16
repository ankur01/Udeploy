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
        "dijit/form/TextBox",
        "dijit/popup",
        "dojo/_base/declare",
        "dojo/date",
        "dojo/dom-construct",
        "dojo/on",
        "deploy/widgets/CustomDateRangeSelector"
        ],
function(
        _TemplatedMixin,
        _Widget,
        Select,
        TextBox,
        popup,
        declare,
        date,
        domConstruct,
        on,
        CustomDateRangeSelector
) {
    return declare('deploy.widgets.DateRangeSelector',  [_Widget, _TemplatedMixin], {
        templateString: '<div class="date-range-selector">' +
                            '<div class="inlineBlock" data-dojo-attach-point="selectAttach"></div>' +
                            '<div class="inlineBlock date-range-wrapper">' +
                              '<div data-dojo-attach-point="startDateSelected" class="inlineBlock selectedDate"></div>' +
                              '<div data-dojo-attach-point="endDateSelected" class="inlineBlock selectedDate"></div>' +
                            '</div>' +
                            '<div id="customDateRangeDropDown" class="dateRangeDropDown" data-dojo-attach-point="dropDownAttach"></div>' +
                        '</div>',

        startDateSelected : null,
        endDateSelected : null,
        startDateText : null,
        endDateText : null,
        selectAttach : null,
        dropDownAttach : null,
        timeUnit : "TIME_UNIT_MONTH",
        rangeSelect : null,
        timeUnitSelect : null,
        startDate : null,
        endDate : null,
        customDateRangeSelector : null,
        value : "currentWeek",
        popup : null,

        constructor : function(/*object*/args) {
            this.inherited(arguments);
        },

        buildRendering: function() {
            this.inherited(arguments);

            var t = this;

            t.rangeSelect = new Select({
                name:'dateRange',
                options:[
                         {label: i18n("Current Week"), value:'currentWeek'},
                         {label: i18n("Prior Week"), value:'priorWeek'},
                         {label: i18n("Current Month"), value:'currentMonth', selected: true},
                         {label: i18n("Prior Month"), value:'priorMonth'},
                         {label: i18n("Current Quarter"), value:'currentQuarter'},
                         {label: i18n("Prior Quarter"), value:'priorQuarter'},
                         {label: i18n("Current Year"), value:'currentYear'},
                         {label: i18n("Prior Year"), value:'priorYear'},
                         {label: i18n("Custom"), value:'custom'}
                ],
                onChange : function(value) {
                    t.rangeSelectChanged(value);
                }
            });
            t.rangeSelect.placeAt(t.selectAttach);

            t.startDateText = new TextBox({disabled:true});
            t.startDateText.placeAt(t.startDateSelected);

            t.endDateText = new TextBox({disabled:true});
            t.endDateText.placeAt(t.endDateSelected);

            t.setDisplayedValue();

            on(t, "blur", function() {
                if (t.popup) {
                    t.popupFinished();
                }
            });
        },

        destroy : function() {
            var t= this;
            this.inherited(arguments);
            var d = function(widget) {
                if (widget) {
                    widget.destroy();
                }
            };

            d(t.timeUnitSelect);
            d(t.startDateSelect);
            d(t.endDateSelect);
            d(t.customDropDown);
            d(t.rangeSelect);
        },

        rangeSelectChanged : function(value) {
            var t = this;
            t.value=value;
            if (value === "currentWeek" ||
                value === "priorWeek" ||
                value === "currentMonth" ||
                value === "priorMonth")
            {
                t.timeUnit = "TIME_UNIT_DAY";
                t.setDisplayedValue();
            }
            else if (value === "currentQuarter" || value === "priorQuarter") {
                t.timeUnit = "TIME_UNIT_WEEK";
                t.setDisplayedValue();
            }
            else if (value === "currentYear" || value === "priorYear") {
                t.timeUnit = "TIME_UNIT_MONTH";
                t.setDisplayedValue();
            }
            else {
                //custom selected
                if (!t.fromSetValue) {
                    t.rangeSelect.disabled = true;
                    t.showCustomDropDown();
                }
            }
            t.fromSetValue=false;
        },

        showCustomDropDown : function() {
            var t = this;

            domConstruct.empty(t.dropDownAttach);

            t.customDateRangeSelector = new CustomDateRangeSelector({
                'startDate':t.startDate,
                'endDate':t.endDate,
                'timeUnit': t.timeUnit,
                finished : function() {
                    t.popupFinished();
                }
            });

            t.popup = popup.open({
                parent: t,
                popup:t.customDateRangeSelector,
                around:t.dropDownAttach,
                onCancel : function() {
                    t.popupFinished();
                },
                onExecute: function() {
                    t.popupFinished();
                }

            });
        },

        popupFinished : function() {
            var t = this;
            t.startDate = t.customDateRangeSelector.getStartDate();
            t.endDate = t.customDateRangeSelector.getEndDate();
            t.timeUnit = t.customDateRangeSelector.getTimeUnit();
            popup.close(t.customDateRangeSelector);
            t.rangeSelect.disabled = false;
            t.popup = null;
            t.setDisplayedValue();
        },

        getStartDate : function () {
            return this.startDate;
        },

        getEndDate : function () {
            return this.endDate;
        },

        getTimeUnit : function() {
            return this.timeUnit;
        },

        _setValueAttr : function(value) {
            this.fromSetValue = true;
            this.rangeSelect.set('value', value);
            popup.close(this.customDateRangeSelector);
        },

        fromSetValue : false,

        _getStartOfWeek : function(/*Date*/date) {
            date.setDate(date.getDate() - date.getDay());
            return date;
        },

        _getEndOfWeek : function(/*Date*/date) {
            date.setDate(date.getDate() + (6 - date.getDay()));
            return date;
        },

        setDisplayedValue: function() {
            var t = this;
            var start;
            var end;
            var curStartDate = new Date();
            var curEndDate = new Date();

            switch (t.value) {
                case "priorWeek":
                    curStartDate = date.add(curStartDate, "day", -7);
                    curEndDate = date.add(curEndDate, "day", -7);
                    curStartDate = t._getStartOfWeek(curStartDate);
                    curEndDate = t._getEndOfWeek(curEndDate);
                    start = curStartDate;
                    end = curEndDate;
                    break;
                case "currentWeek":
                    curStartDate = t._getStartOfWeek(curStartDate);
                    curEndDate = t._getEndOfWeek(curEndDate);
                    start = curStartDate;
                    end = curEndDate;
                    break;
                case "currentMonth":
                    curStartDate.setDate(1);
                    curEndDate.setDate(date.getDaysInMonth(curEndDate));
                    start = curStartDate;
                    end = curEndDate;
                    break;
                case "priorMonth":
                    curStartDate.setDate(15); //every month has a 15
                    curEndDate.setDate(15);
                    curStartDate = date.add(curStartDate, "month", -1);
                    curEndDate = date.add(curEndDate, "month", -1);
                    curStartDate.setDate(1);
                    curEndDate.setDate(date.getDaysInMonth(curEndDate));
                    start = curStartDate;
                    end = curEndDate;
                    break;
                case "currentYear":
                    curStartDate.setMonth(0);
                    curStartDate.setDate(1);
                    curEndDate.setMonth(11);
                    curEndDate.setDate(date.getDaysInMonth(curEndDate));
                    start = curStartDate;
                    end = curEndDate;
                    break;
                case "priorYear":
                    curStartDate = date.add(curStartDate, "year", -1);
                    curEndDate = date.add(curEndDate, "year", -1);
                    curStartDate.setMonth(0);
                    curStartDate.setDate(1);
                    curEndDate.setMonth(11);
                    curEndDate.setDate(date.getDaysInMonth(curEndDate));
                    start = curStartDate;
                    end = curEndDate;
                    break;
                case "currentQuarter":
                    curStartDate = t._getStartOfQuarter(curStartDate);
                    curEndDate = t._getEndOfQuarter(curEndDate);
                    start = curStartDate;
                    end = curEndDate;
                    break;
                case "priorQuarter":
                    curStartDate.setDate(15); //every month has a 15
                    curEndDate.setDate(15);
                    curStartDate = date.add(curStartDate, "month", -3);//jump to last quarter
                    curEndDate = date.add(curEndDate, "month", -3);
                    curStartDate = t._getStartOfQuarter(curStartDate);
                    curEndDate = t._getEndOfQuarter(curEndDate);
                    start = curStartDate;
                    end = curEndDate;
                    break;
                case "custom":
                    start = t.startDate;
                    end = t.endDate;
                    break;
            }

            t.startDateText.set('value', util.dayFormatShort(start));
            t.endDateText.set('value', util.dayFormatShort(end));
        },

        _getStartOfQuarter : function(/*date*/startDate) {
            startDate.setDate(1);
            //0-2 , 3-5, 6-8, 9-11
            if (startDate.getMonth() <= 2) {
                startDate.setMonth(0);
            }
            else if (startDate.getMonth() <= 5) {
                startDate.setMonth(3);
            }
            else if (startDate.getMonth() <= 8) {
                startDate.setMonth(6);
            }
            else {
                startDate.setMonth(9);
            }
            return startDate;
        },
        _getEndOfQuarter : function(/*date*/endDate) {
            endDate.setDate(1);
            //0-2 , 3-5, 6-8, 9-11
            if (endDate.getMonth() <= 2) {
                endDate.setMonth(2);
            }
            else if (endDate.getMonth() <= 5) {
                endDate.setMonth(5);
            }
            else if (endDate.getMonth() <= 8) {
                endDate.setMonth(8);
            }
            else {
                endDate.setMonth(11);
            }
            endDate.setDate(date.getDaysInMonth(endDate));
            return endDate;
        }
    });
});