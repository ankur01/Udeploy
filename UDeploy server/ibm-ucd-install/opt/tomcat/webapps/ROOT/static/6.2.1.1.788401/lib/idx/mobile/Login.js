//>>built
define("idx/mobile/Login","dojo/_base/declare,dojo/_base/lang,dojo/_base/window,dojo/dom-class,dojo/dom-construct,dojo/i18n,dojo/on,dojo/string,dojox/mobile/Button,dojox/mobile/SimpleDialog,dojox/mobile/TextBox,dojo/i18n!./nls/Login".split(","),function(c,l,d,e,b,i,m,j,f,k,g){return c("idx.mobile.Login",[k],{name:"",_setNameAttr:{node:"_nameNode",type:"innerHTML"},cancelable:!0,legal:"&copy; ${copyright} IBM Corporation.",copyright:"2012",create:function(){if(e.contains(d.doc.documentElement,"dj_phone"))this.left=
this.top=0;this.inherited(arguments)},postMixInProperties:function(){this._nls=i.getLocalization("idx.mobile","Login");this.inherited(arguments)},buildRendering:function(){this.inherited(arguments);var a=b.create("div",{className:"mblIdxLoginPane"},this.domNode),a=b.create("form",{action:"javascript://"},a);b.create("div",{className:"mblIdxIbmLogo",title:this._nls.logoIBM},a);this._nameNode=b.create("h1",{className:"mblIdxProductName"},a);a.appendChild(this.containerNode);this._messageNode=b.create("p",
{className:"mblIdxAlert"},a);var c=b.create("div",{className:"mblIdxEdit"},a),d=b.create("div",{className:"mblIdxEdit"},a),h=b.create("div",{className:"mblIdxButtons"},a);c.appendChild((this._nameEditor=new g({placeHolder:this._nls.promptName})).domNode);d.appendChild((this._passwordEditor=new g({placeHolder:this._nls.promptPassword,type:"password"})).domNode);h.appendChild((this._loginButton=new f({label:this._nls.promptLogin,"class":"mblSpecialButton",type:"submit"})).domNode);h.appendChild((this._cancelButton=
new f({label:this._nls.promptCancel})).domNode);b.create("div",{className:"mblIdxDivider"},a);this._legalNode=b.create("p",{className:"mblIdxLegal"},a);e.add(this.domNode,"mblIdxLoginDialog");this.connect(this._cancelButton,"_onClick","hide");this.connect(this._loginButton,"_onClick","_onLogin")},showMessage:function(a){this._messageNode.innerHTML=a||""},hide:function(){this.domNode.focus();this.inherited(arguments);this.showMessage()},_setCancelableAttr:function(a){this._cancelButton.domNode.style.display=
a?"":"none"},_refreshLegal:function(){this._legalNode.innerHTML=j.substitute(this.legal,this)},_setLegalAttr:function(a){this.legal=a;this._refreshLegal()},_setCopyrightAttr:function(a){this.copyright=a;this._refreshLegal()},_onLogin:function(){this.onLogin({name:this._nameEditor.get("value"),password:this._passwordEditor.get("value")});return!1},onLogin:function(){}})});