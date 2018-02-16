//>>built
require({cache:{"url:idx/grid/templates/PropertyFormatter.html":'<div class="${baseClass}"\r\n><div id="${id}_format" tabindex="0" dojoAttachPoint="formatNode,focusNode" class="${baseClass}Format"></div\r\n><div id="${id}_edit" dojoAttachPoint="containerNode" class="${baseClass}Edit"></div\r\n></div>\r\n'}});
define("idx/grid/PropertyFormatter","dojo/_base/declare,dijit/_Widget,dijit/_TemplatedMixin,dijit/_Container,dojo/_base/lang,dojo/_base/array,dojo/string,dojo/number,dojo/date/locale,dojo/aspect,dojo/dom-class,dijit/registry,dijit/form/_FormWidget,../util,../string,../resources,../widget/EditController,dojo/text!./templates/PropertyFormatter.html,dojo/i18n!../nls/base,dojo/i18n!./nls/base,dojo/i18n!./nls/PropertyFormatter".split(","),function(s,t,u,v,m,n,h,w,x,o,j,y,z,f,p,q,A,B){var r=new function(){};
return s("idx.grid.PropertyFormatter",[t,u,v],{data:null,propertyName:"",properties:"",format:"",altSyntax:!1,emptyFormat:"",readOnly:!1,disabled:!1,formatFunc:r,toEditFunc:null,fromEditFunc:null,dateFormatOptions:null,timeFormatOptions:null,dateTimeFormatOptions:null,decimalFormatOptions:null,integerFormatOptions:null,percentFormatOptions:null,currencyFormatOptions:null,propertyContainer:null,editController:null,baseClass:"idxPropertyFormatter",templateString:B,constructor:function(){this._started=
!1;this.emptyFormat=null;this._editmode=!1;this._editorHandles={}},destroy:function(){this._controllerHandle&&(this._controllerHandle.remove(),delete this._controllerHandle);if(this._editorHandles)for(var a in this._editorHandles){var b=this._editorHandles[a];b&&b.remove();delete this._editorHandles[a]}this._editController&&(this._editController.destroyRecursive(),delete this._editController);this._editorsByOrder&&(n.forEach(this._editorsByOrder,function(a){a.destroyRecursive();delete a}),delete this._editorsByOrder);
(a=this.getChildren())&&n.forEach(a,function(a){a.destroyRecursive()});this.inherited(arguments)},_stringSubstitute:function(a,b){return a.replace(this.altSyntax?/\$\[([^\s\]]+)\]/g:/\$\{([^\s\}]+)\}/g,function(a,d){return m.getObject(d,!1,b)})},postMixInProperties:function(){f.nullify(this,this.params,["formatFunc"]);this.inherited(arguments)},buildRendering:function(){this.inherited(arguments)},postCreate:function(){this.inherited(arguments)},startup:function(){this._started||(this.inherited(arguments),
this._reformat(),this._updateEditors())},addChild:function(a,b){this.inherited(arguments);this._started&&this._updateEditors()},isEditorValid:function(){var a=!0;if(this._editorsByName)for(var b in this._editorsByName){var c=this._editorsByName[b];c&&"isValid"in c&&"function"==f.typeOfObject(c.isValid)&&(c.isValid()||(a=!1))}return a},_onEditorChange:function(a,b){if(this._editMode){var c=a.get("id");if(this._namesByEditorID&&(c=this._namesByEditorID[c]))this.onEditorChange(c,b,this)}},removeChild:function(a){this.inherited(arguments);
var b=a.get("id");if(b in this._editorHandles){var c=this._editorHandles[b];c&&c.remove();delete this._editorHandles[b]}this._started&&this._updateEditors()},_updateEditors:function(){this._started&&(0==this.getChildren().length?j.add(this.domNode,this.baseClass+"NoEditors"):j.remove(this.domNode,this.baseClass+"NoEditors"),this._mapEditors(),this._updateEditController())},_getEditController:function(){return this.editController?this.editController:this._editController?this._editController:this.propertyContainer?
this.propertyContainer.get("editController"):null},_setEditControllerAttr:function(a){this.editController=y.byId(a);this._updateEditController()},_setPropertyContainerAttr:function(a){this.propertyContainer=a;this._controllerHandle&&(this._controllerHandle.remove(),delete this._controllerHandle);if(a)this._controllerHandle=o.after(a,"onEditControllerChanged",m.hitch(this,"_updateEditController"),!0);this._updateEditController();this._reformat()},_updateEditController:function(){if(this._started){var a=
this._getEditController();if(this._linkedController&&this._linkedController!=a)this._linkedController.unlinkEditor(this),this._linkedController=null;if(!a&&0<this.getChildren().length&&!this._editController)this._editController=new A({readOnly:this.readOnly,disabled:this.disabled,readControlledNodeIDs:this.formatNode.id,editControlledNodeIDs:this.containerNode.id}),this._editController.startup(),this._editController.placeAt(this.domNode,"last");if(this._editController&&(a&&a!==this._editController||
0==this.getChildren().length))this._editController.destroyRecursive(),delete this._editController,this._editController=null;if(!a&&this._editController)a=this._editController;if(a&&!this._linkedController)a.linkEditor(this,{onSave:"_onSave",onCancel:"_onCancel",onEdit:"_onEdit",readNodeIDs:this.formatNode.id,editNodeIDs:this.containerNode.id}),this._linkedController=a}},_mapEditors:function(){if(this._started)if(this.properties){for(var a=this.getChildren(),b=[],c=[],d=[],e=[],k=0,g=0,i=0;i<a.length;i++){var f=
a[i];if(f instanceof z){k++;var h=f.get("id");if(!(h in this._editorHandles)&&f.onChange){var j=this,l=o.after(f,"onChange",function(a){j._onEditorChange(f,a)},!0);this._editorHandles[h]=l}e.push(f);(l=f.get("name"))?(this._propsByName[l]&&g++,h=f.get("id"),b[l]=f,c[h]=l):d.push(f)}}i=this._properties.length-g;if(0<i&&i==d.length)for(i=a=0;i<this._properties.length;i++)k=this._properties[i].propName,g=b[k],!g&&!(a>=d.length)&&(g=d[a++],h=g.get("id"),b[k]=g,c[h]=k);this._editorsByName&&delete this.editorsByName;
this._namesByEditorID&&delete this._namesByEditorID;this._eidtorsByOrder&&delete this._editorsByOrder;this._editorsByName=b;this._namesByEditorID=c;this._editorsByOrder=e}else this._editorsByName=null},_setDataAttr:function(a){this.data=a;this._reformat()},_setFormatAttr:function(a){this.format=a;this._reformat()},_setEmptyFormatAttr:function(a){this.emptyFormat=a;this._reformat()},_setFormatFuncAttr:function(a){this.formatFunc=a;this._reformat()},_setDateFormatOptionsAttr:function(a){this.dateFormatOptions=
a;this._reformat()},_setTimeFormatOptionsAttr:function(a){this.timeFormatOptions=a;this._reformat()},_setDateTimeFormatOptionsAttr:function(a){this.dateTimeFormatOptions=a;this._reformat()},_setDecimalFormatOptionsAttr:function(a){this.decimalFormatOptions=a;this._reformat()},_setIntegerFormatOptionsAttr:function(a){this.integerFormatOptions=a;this._reformat()},_setPercentFormatOptionsAttr:function(a){this.percentFormatOptions=a;this._reformat()},_setCurrencyFormatOptionsAttr:function(a){this.currencyFormatOptions=
a;this._reformat()},_setPropertiesAttr:function(a){this.properties=a;this._properties=[];this._propsByName=[];a=this._defaultFormat="";if(null!=this.properties)for(var b=this.properties.split(","),c=0,c=0;c<b.length;c++){var d=this._parsePropertyName(b[c]),e=d.propName;this._properties.push(d);this._propsByName[e]=d;this._defaultFormat=this._defaultFormat+a+"${"+e+"}";a=", "}this._reformat()},_parsePropertyName:function(a){var b=[],a=h.trim(a),c=null,d=a.indexOf("("),e=a.indexOf(")"),f=a;0<=d&&e==
a.length-1&&(c=a.substring(d+1,e),c=h.trim(c),f=a=h.trim(a.substring(0,d)));for(var g=a.indexOf("."),d=a.indexOf("[");0<=g||0<=d;){e=null;if(0<=g&&(0>d||g<d))e=h.trim(a.substring(0,g)),a=g<a.length-1?h.trim(a.substring(g+1)):"",b.push(e);else{var g=a.indexOf("]"),i=this._makeNumber(h.trim(a.substring(d+1,g))),e=h.trim(a.substring(0,d)),a=g<a.length-1?h.trim(a.substring(g+1)):"";"."==a.charAt(0)&&(a=a.substring(1));0<e.length&&b.push(e);b.push(i)}g=a.indexOf(".");d=a.indexOf("[")}0<a.length&&b.push(a);
return{propName:f,propType:c,propParts:b}},_reformat:function(){if(this._started)this.formatNode.innerHTML=this._getFormattedValue()},refresh:function(){this._reformat();var a=this.propertyContainer;this.onRefresh(this._getData(),this,a)},_customFormat:function(a){var b=null;this.formatFunc&&this.formatFunc!==r&&(b=this.formatFunc.call(this,a));if(null!=b)return b;if(this.propertyContainer){var c=this.propertyContainer.get("formatFunc");c&&(b=c.call(this.propertyContainer,this.propertyName,a))}return b},
_getFormattedValue:function(){var a=this._getData(),b=this._customFormat(a);if(null!=b)return b;var b={},c=0;if(!this._properties)return"";for(c=0;c<this._properties.length;c++){var d=this._properties[c],e=a?this._resolveValue(a,d.propParts):null;if(null==e&&1==d.propParts.length)b[d.propName]=this._getEmptyFormat();else for(var h=b,g=0;g<d.propParts.length;g++){var i=d.propParts[g];"number"==f.typeOfObject(i)&&(i="__arrindex_"+i);g<d.propParts.length-1?(h[i]||(h[i]={}),h=h[i]):h[i]=this._formatPart(e,
d.propType)}}a=this.format;if(null==p.nullTrim(a))a=this._defaultFormat;c=a;do a=c,c=a.replace(/(\x24\x7b[^\x7d\x5b\x5d]+)\x5b(\x2d?[0-9]+)\x5d([^\x7b\x7d]*\x7d)/g,"$1.__arrindex_$2$3");while(c!=a);b=this._stringSubstitute(c,b);null==p.nullTrim(b)&&(b=this._getEmptyFormat());return b},_resolveValue:function(a,b){for(var c=a,d=0;d<b.length;d++){var e=b[d];"number"==f.typeOfObject(e)&&0>e&&"length"in c&&(e=c.length+e);if("undefined"==typeof c[e])return null;c=c[e]}return c},_resolveEdit:function(a,
b,c){for(var d=0;d<b.length;d++){var e=b[d];"number"==f.typeOfObject(e)&&0>e&&"length"in a&&(e=a.length+e);if("undefined"==typeof a[e])break;d<b.length-1?a=a[e]:a[e]=c}},_inferPropertyType:function(a){switch(dParser.valToType(a)){case "string":return"txt";case "number":return Math.round(a)==a?"int":"dec";case "date":return"dat";default:return"txt"}},_formatDate:function(a,b){a=this._makeDate(a);return!a?null:x.format(a,this._getFormatOptions(b))},_formatNumber:function(a,b){a=this._makeNumber(a);
return!a?null:w.format(a,this._getFormatOptions(b))},_formatPart:function(a,b){switch(b){case "txt":return""+a;case "dat":return this._formatDate(a,"date");case "tim":return this._formatDate(a,"time");case "dtm":return this._formatDate(a,"dateTime");case "dec":return this._formatNumber(a,"decimal");case "int":return this._formatNumber(a,"integer");case "pct":return this._formatNumber(a,"percent");case "cur":return this._formatNumber(a,"currency");default:return""+a}},_getData:function(){var a=this.data;
return a?a:null==this.propertyContainer?null:this.propertyContainer.get("data")},_getEmptyFormat:function(){var a=this.emptyFormat;if(null!=a)return a;if(null!=this.propertyContainer){var b=this.propertyContainer.get("resources");b&&"emptyFormat"in b&&(a=b.emptyFormat)}return null!=a?a:(a=q.get("emptyFormat","idx/grid/PropertyFormatter"))||""},_makeDate:function(a){return"date"==f.typeOfObject(a)?a:f.parseObject(""+a,"date")},_makeNumber:function(a){return"number"==f.typeOfObject(a)?a:f.parseObject(""+
a,"number")},_makeBoolean:function(a){return"boolean"==f.typeOfObject(a)?a:f.parseObject(""+a,"boolean")},_getFormatOptions:function(a){a+="FormatOptions";if(this[a])return this[a];var b=null;if(this.propertyContainer){var c=this.propertyContainer.get("resources");c&&(b=c[a])}return b?b:b=q.get(a,"idx/grid/PropertyFormatter")},onChange:function(){},onEditorChange:function(){},_setReadOnlyAttr:function(a){this.readOnly=a;this._editController&&this._editController.set("readOnly",a)},_setDisabledAttr:function(a){this.disabled=
a;this._editController&&this._editController.set("disabled",a)},_onSave:function(){if(this._editMode){this._editMode=!1;for(var a=0;a<this._editorsByOrder.length;a++){var b=this._editorsByOrder[a],c=b.get("name");if(c){var d=b.get("value"),e=b.get("checked");if(("on"==d||"false"==d||"true"==d||"off"==d)&&(!0===e||!1===e||"checked"in b))d=e;this.saveEditorValue(c,d)}}for(a=0;a<this._properties.length;a++)if(c=this._properties[a].propName,(b=this._editorsByName[c])&&!b.get("name")){d=b.get("value");
e=b.get("checked");if(("on"==d||"false"==d||"true"==d||"off"==d)&&(!0===e||!1===e||"checked"in b))d=e;this.saveEditorValue(c,d)}this._reformat();j.remove(this.domNode,this.baseClass+"EditMode");this.onChange(this._getData(),this)}},_onCancel:function(){if(this._editMode)this._editMode=!1,j.remove(this.domNode,this.baseClass+"EditMode"),this._prepareEditors(),this._editController&&this._editController.set("readOnly",this.readOnly),this.onEditCancel()},onEditCancel:function(){},onEditBegin:function(){},
_prepareEditors:function(){for(var a=0;a<this._editorsByOrder.length;a++){var b=this._editorsByOrder[a],c=b.get("name");if(c){c=this.prepareEditorValue(c);if(!0==c||!1==c){var d=b.get("checked");(!0==d||!1==d||"checked"in b)&&b.set("checked",c)}b.set("value",c);b.validate&&"function"==typeof b.validate&&b.validate()}}for(a=0;a<this._properties.length;a++)if(c=this._properties[a].propName,(b=this._editorsByName[c])&&!b.get("name")){c=this.prepareEditorValue(c);if(!0==c||!1==c)d=b.get("checked"),(!0==
d||!1==d||"checked"in b)&&b.set("checked",c);b.set("value",c)}},_onEdit:function(){if(!(this._editMode||0==this.getChildren().length))this._editMode=!0,j.add(this.domNode,this.baseClass+"EditMode"),this._prepareEditors(),this._editController&&0<this._editorsByOrder.length&&this._editorsByOrder[0].focus(),this.onEditorChange(),this.onEditBegin()},focus:function(){this._editMode&&0<this._editorsByOrder.length?this._editorsByOrder[0].focus():this.focusNode.focus()},prepareEditorValue:function(a){var b=
this._getData(),c=null;this.toEditFunc&&(c=this.toEditFunc.call(this,a,b));if(c)return c;a=this._propsByName[a];return!a?null:b?this._resolveValue(b,a.propParts):null},saveEditorValue:function(a,b){var c=this._getData(),d=null;if(c){if(this.fromEditFunc){var e=this.fromEditFunc.call(this,a,b);if(null!=e){for(field in e)(d=this._propsByName[field])&&this._resolveEdit(c,d.propParts,e[field]);return}}(d=this._propsByName[a])&&this._resolveEdit(c,d.propParts,b)}},onRefresh:function(){}})});