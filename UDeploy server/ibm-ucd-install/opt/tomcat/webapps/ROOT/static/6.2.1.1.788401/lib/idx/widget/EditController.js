//>>built
require({cache:{"url:idx/widget/templates/EditController.html":'<div class="${baseClass}"\n><div data-dojo-type="idx/form/Link" class="${baseClass}EditLink"\n      data-dojo-attach-point="_editLink">${editLabel}</div\n><div data-dojo-type="idx/layout/ButtonBar" data-dojo-attach-point="_buttonBar"\n      class="${baseClass}ButtonBar"\n><div data-dojo-type="dijit/form/Button" data-dojo-attach-point="_saveButton">${saveLabel}</div\n><div data-dojo-type="dijit/form/Button" data-dojo-props="placement: \'secondary\'" data-dojo-attach-point="_cancelButton">${cancelLabel}</div\n></div>\n</div>\n'}});
define("idx/widget/EditController","dojo/_base/declare,dijit/_Widget,dijit/_TemplatedMixin,dijit/_WidgetsInTemplateMixin,dojo/_base/lang,dojo/aspect,dojo/dom-attr,dojo/dom-class,dijit/registry,dijit/form/Button,../resources,../string,../util,../form/Link,../layout/ButtonBar,dojo/text!./templates/EditController.html,dojo/i18n!../nls/base,dojo/i18n!./nls/base,dojo/i18n!./nls/EditController".split(","),function(l,m,p,q,h,k,i,j,n,t,r,g,f,u,v,s){return l("idx.widget.EditController",[m,p,q],{readControlledNodeIDs:"",
editControlledNodeIDs:"",readOnly:!1,disabled:!1,editLabel:"",saveLabel:"",cancelLabel:"",baseClass:"idxEditController",templateString:s,constructor:function(){this._editMode=this._started=!1;this._linkedEditors={}},destroy:function(){if(this._linkedEditors)for(var b in this._linkedEditors){var a=this._linkedEditors[b];a.changeHandle&&(a.changeHandle.remove(),delete a.changeHandle)}this.inherited(arguments)},buildRendering:function(){var b=r.getResources("idx/widget/EditController",this.lang);if(null==
g.nullTrim(this.editLabel))this.editLabel=b.editLabel;if(null==g.nullTrim(this.saveLabel))this.saveLabel=b.saveLabel;if(null==g.nullTrim(this.cancelLabel))this.cancelLabel=b.cancelLabel;this.inherited(arguments);this._built=!0;this._updateReadControlNodeIDs();this._updateEditControlNodeIDs()},postCreate:function(){this.inherited(arguments);this.own(k.after(this._saveButton,"onClick",h.hitch(this,this._onSaveClick),!0));this.own(k.after(this._cancelButton,"onClick",h.hitch(this,this._onCancelClick),
!0));this.own(k.after(this._editLink,"onClick",h.hitch(this,this._onEditClick),!0))},_setReadControlledNodeIDsAttr:function(b){this.readControlledNodeIDs=b;this._updateReadControlNodeIDs()},_updateReadControlNodeIDs:function(){if(this._built){var b={};if(g.nullTrim(this.readControlledNodeIDs))for(var a=this.readControlledNodeIDs.split(","),d=0;d<a.length;d++){var e=g.nullTrim(a[d]);e&&(b[e]=!0)}for(var c in this._linkedEditors)if(a=this._linkedEditors[c].readNodeIDs,g.nullTrim(a)){a=a.split(",");
for(d=0;d<a.length;d++)(e=g.nullTrim(a[d]))&&(b[e]=!0)}var a=c="",f;for(f in b)c=c+a+f,a=",";g.nullTrim(c)?i.set(this._editLink.domNode,"aria-controls",c):i.remove(this._editLink.domNode,"aria-controls")}},_setEditControlledNodeIDsAttr:function(b){this.editControlledNodeIDs=b;this._updateEditControlNodeIDs()},_updateEditControlNodeIDs:function(){if(this._built){var b={};if(g.nullTrim(this.editControlledNodeIDs))for(var a=this.editControlledNodeIDs.split(","),d=0;d<a.length;d++){var e=g.nullTrim(a[d]);
e&&(b[e]=!0)}for(var c in this._linkedEditors)if(a=this._linkedEditors[c].editNodeIDs,g.nullTrim(a)){a=a.split(",");for(d=0;d<a.length;d++)(e=g.nullTrim(a[d]))&&(b[e]=!0)}var a=c="",f;for(f in b)c=c+a+f,a=",";g.nullTrim(c)?(i.set(this._saveButton.focusNode,"aria-controls",c),i.set(this._cancelButton.focusNode,"aria-controls",c)):(i.remove(this._saveButton.focusNode,"aria-controls"),i.remove(this._cancelButton.focusNode,"aria-controls"))}},_setEditLabelAttr:function(b){this._editLink.set("label",b)},
_setSaveLabelAttr:function(b){this._saveButton.set("label",b)},_setCancelLabelAttr:function(b){this._cancelButton.set("label",b)},startup:function(){this._started||(this.inherited(arguments),this._editLink.startup(),this._saveButton.startup(),this._cancelButton.startup(),this._buttonBar.startup())},_onSaveClick:function(){if(this._editMode){for(var b in this._linkedEditors){var a=this._linkedEditors[b];if(a.onPreSave)a.onPreSave()}this.onPreSave();this._editMode=!1;j.remove(this.domNode,this.baseClass+
"EditMode");this.onResize();this._editLink.focus();for(b in this._linkedEditors)if(a=this._linkedEditors[b],a.onSave)a.onSave();this.onSave();for(b in this._linkedEditors)if(a=this._linkedEditors[b],a.onPostSave)a.onPostSave();this.onPostSave()}},_onCancelClick:function(){if(this._editMode){this._editMode=!1;j.remove(this.domNode,this.baseClass+"EditMode");this.onResize();this._editLink.focus();for(var b in this._linkedEditors){var a=this._linkedEditors[b];if(a.onCancel)a.onCancel()}this._valid=!0;
this._updateButtons();this.onCancel()}},_onEditClick:function(){if(!this._editMode){this._editMode=!0;j.add(this.domNode,this.baseClass+"EditMode");this.onResize();this._cancelButton.focus();for(var b in this._linkedEditors){var a=this._linkedEditors[b];if(a.onEdit)a.onEdit()}this.onEdit()}},onEdit:function(){},onSave:function(){},onPreSave:function(){},onPostSave:function(){},onCancel:function(){},_setDisabledAttr:function(b){var a=(this.disabled=b)||this.readOnly;j.toggle(this.domNode,this.baseClass+
"Disabled",b);this._editLink.set("disabled",b);this._saveButton.set("disabled",a);this._cancelButton.set("disabled",b)},_setReadOnlyAttr:function(b){this.readOnly=b;this._updateButtons()},_updateButtons:function(){j.toggle(this.domNode,this.baseClass+"ReadOnly",this.readOnly);this._editLink.set("readOnly",this.readOnly);this._saveButton.set("readOnly",this.readOnly);this._cancelButton.set("readOnly",this.readOnly);this._saveButton.set("disabled",this.readOnly||this.disabled||!this._valid)},onResize:function(){},
_editorChanged:function(){var b=!0,a;for(a in this._linkedEditors){var d=this._linkedEditors[a];d&&d.validCheck&&!d.validCheck()&&(b=!1)}this._valid=b;this._updateButtons()},_checkEditorValid:function(b,a){return"invalid"==a||"isInvalid"==a||"errant"==a?!b.get(a):b.get(a)},_interpretNotifier:function(b,a,d){(a=a&&a[d]?a[d]:null)&&"string"==f.typeOfObject(a)&&a in b&&f.typeOfObject("function"==b[a])&&(a=h.hitch(b,a));a&&"object"==f.typeOfObject(a)&&"attribute"in a&&"value"in a&&b[a.attribute]&&(a=
h.hitch(editor,"set",a.attribute,a.value));if(a&&"function"!=f.typeOfObject(a))throw"The specified "+d+" handler is not a function of the specified widget, nor is it an object describing an attribute and value for the specified widget.  notifier=[ "+a+" ], notifier.attribute=[ "+a.attribute+" ], notifier.value=[ "+a.value+" ]";return a},linkEditor:function(b,a){var b=n.byId(b),d=b.get("id");this._linkedEditors[d]&&this.unlinkEditor(b);var e=a&&a.changeEvent?a.changeEvent:null;!e&&"onEditorChange"in
b&&"function"==f.typeOfObject(b.onChange)&&(e="onEditorChange");!e&&"onChange"in b&&"function"==f.typeOfObject(b.onChange)&&(e="onChange");if(e&&(!(""+e in b)||"function"!=f.typeOfObject(b[""+e])))throw"The specified change event is not recognized as a function of the specified editor widget.  changeEvent=[ "+e+" ]";var c=a&&a.validCheck?a.validCheck:null;!c&&"isEditorValid"in b&&"function"==f.typeOfObject(b.isEditorValid)&&(c=h.hitch(b,"isEditorValid"));!c&&"isValid"in b&&"function"==f.typeOfObject(b.isValid)&&
(c=h.hitch(b,"isValid"));c&&"string"==f.typeOfObject(c)&&c in b&&(c=h.hitch(this,"_checkEditorValid",editor,c));if(c&&"function"!=f.typeOfObject(c))throw"The specified validity check is not a function or attribute of the speciifed widget, nor is it a function that can be called.  validCheck=[ "+c+" ]";var g=this._interpretNotifier(b,a,"onSave"),i=this._interpretNotifier(b,a,"onPreSave"),j=this._interpretNotifier(b,a,"onPostSave"),l=this._interpretNotifier(b,a,"onEdit"),m=this._interpretNotifier(b,
a,"onCancel"),o=null;e&&(o=k.after(b,""+e,h.hitch(this,"_editorChanged"),!0));e={editor:b,changeHandle:o,validCheck:c,onEdit:l,onPreSave:i,onSave:g,onPostSave:j,onCancel:m,readNodeIDs:a.readNodeIDs?a.readNodeIDs:null,writeNodeIDs:a.writeNodeIDs?a.writeNodeIDs:null};this._linkedEditors[d]=e;e.readNodeIDs&&this._updateReadControlNodeIDs();e.writeNodeIDs&&this._updateEditControlNodeIDs()},unlinkEditor:function(b){b=n.byId(b);b=b.get("id");if(b in this._linkedEditors){var a=this._linkedEditors[b],d=!1,
e=!1;if(a){a.changeHandle&&(a.changeHandle.remove(),delete a.changeHandle);a.changeHandle=null;a.readNodeIDs&&(d=!0);a.editNodeIDs&&(e=!0);for(var c in a)a[c]&&delete a[c],a[c]=null}delete this._linkedEditors[b];d&&this._updateReadControlNodeIDs();e&&this._updateEditControlNodeIDs()}}})});