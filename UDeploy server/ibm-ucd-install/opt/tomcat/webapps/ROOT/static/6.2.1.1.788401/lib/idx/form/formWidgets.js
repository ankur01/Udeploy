//>>built
define("idx/form/formWidgets",["dojo/_base/lang","idx/main","dojo/dom-attr","dijit/form/_FormWidget","../string"],function(a,b,c,d,e){a=a.getObject("form.formWidgets",b);dojo.extend(d,{accessKey:"",_setAccessKeyAttr:function(a){this.accessKey=a;e.nullTrim(a)&&this.focusNode&&"INPUT"==this.focusNode.tagName&&c.set(this.focusNode,"accessKey",a)}});return a});