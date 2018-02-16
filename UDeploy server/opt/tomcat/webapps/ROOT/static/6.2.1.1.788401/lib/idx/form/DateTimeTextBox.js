//>>built
require({cache:{"url:idx/form/templates/DateTimeTextBox.html":'<div class="idxDateTimeTextBox dijitInline">\r\n\t<div dojoAttachPoint="dateTextBox" data-dojo-type="idx.form.DateTextBox" data-dojo-props=\'\r\n\t\thint: "Input Date ${dateHint}",\r\n\t\thintPosition: "inside",\r\n\t\tshowPickerIcon: ${showPickerIcon}\r\n\t\'></div>\r\n\t<div dojoAttachPoint="timeTextBox" data-dojo-type="idx.form.TimeTextBox" data-dojo-props=\'\r\n\t\thint: "Input Time ${timeHint}",\r\n\t\thintPosition: "inside",\r\n\t\tshowPickerIcon: ${showPickerIcon}\r\n\t\'></div>\r\n\t<input type="hidden" dojoAttachPoint="focusNode"></input>\r\n</div>'}});
define("idx/form/DateTimeTextBox","dojo/_base/declare,dojo/_base/lang,dojo/dom-attr,dijit/_Templated,dijit/form/_FormValueWidget,./DateTextBox,./TimeTextBox,dojo/text!./templates/DateTimeTextBox.html".split(","),function(d,e,c,f,g,i,j,h){return e.getObject("idx.form",!0).DateTimePicker=d("idx.form.DateTimeTextBox",[g,f],{widgetsInTemplate:!0,templateString:h,baseClass:"idxDateTimeTextBoxWrap",required:!1,readOnly:!1,value:null,showPickerIcon:!1,dateHint:"dd/mm/yyyy",timeHint:"hh:mm",postCreate:function(){this.inherited(arguments);
this.connect(this.dateTextBox,"_setValueAttr","_updateValueAttr");this.connect(this.timeTextBox,"_setValueAttr","_updateValueAttr");c.set(this.dateTextBox.focusNode,"title","Input Date");c.set(this.timeTextBox.focusNode,"title","Input Time")},validate:function(a){if("undefined"!==typeof this._hasBeenBlurred)this.dateTextBox._hasBeenBlurred=this._hasBeenBlurred||this.dateTextBox._hasBeenBlurred,this.timeTextBox._hasBeenBlurred=this._hasBeenBlurred||this.timeTextBox._hasBeenBlurred;var b=this.dateTextBox.validate(a),
a=this.timeTextBox.validate(a);return b&&a},isValid:function(a){return this.dateTextBox.isValid(a)&&this.timeTextBox.isValid(a)},_getDateAttr:function(){return this.dateTextBox.get("value")},_getTimeAttr:function(){return this.timeTextBox.get("value")},_setDateAttr:function(a){this.dateTextBox.set("value",a)},_setTimeAttr:function(a){this.timeTextBox.set("value",a)},_getValueAttr:function(){return this._getCombinedValue()},_setValueAttr:function(a){this.value=a;this.dateTextBox.set("value",a);this.timeTextBox.set("value",
a)},_setDisabledAttr:function(a){this.inherited(arguments);this.dateTextBox.set("disabled",a);this.timeTextBox.set("disabled",a)},_setRequiredAttr:function(a){this.required=a;this.dateTextBox.set("required",a);this.timeTextBox.set("required",a)},_setReadOnlyAttr:function(a){this.readOnly=a;this.dateTextBox.set("readOnly",a);this.timeTextBox.set("readOnly",a)},_updateValueAttr:function(){this.value=this._getCombinedValue()},_getCombinedValue:function(){var a=this.dateTextBox.get("value"),b=this.timeTextBox.get("value");
if(!a&&!b)return null;a=a||new Date(0);b=b||new Date(0);return new Date(a.getTime()+b.getTime())},reset:function(){this.inherited(arguments);this.dateTextBox.reset();this.timeTextBox.reset()},_onMouseDown:function(){}})});