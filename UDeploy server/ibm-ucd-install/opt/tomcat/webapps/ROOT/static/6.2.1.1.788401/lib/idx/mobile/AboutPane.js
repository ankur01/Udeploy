//>>built
define("idx/mobile/AboutPane","dojo/_base/declare,dojo/dom-class,dojo/dom-construct,dojo/i18n,dojo/string,dojox/mobile/Container,dojo/i18n!./nls/AboutPane".split(","),function(d,e,b,f,g,h){return d("idx.mobile.AboutPane",[h],{name:"",_setNameAttr:{node:"_nameNode",type:"innerHTML"},version:"",build:"",legal:"Licensed Materials &mdash; Property of IBM. &copy; IBM Corp. ${copyright}. IBM, the IBM logo, and ibm.com are trademarks of IBM Corp., registered in many jurisdictions worldwide. ${trademarks}Other product and service names might be trademarks of IBM or other companies. A current list of IBM trademarks is available on the Web at www.ibm.com/legal/copytrade.shtml. This Program is licensed under the terms of the license agreement for the Program. Please read this agreement carefully before using the Program. By using the Program, you agree to these terms.",
copyright:"2012",trademarks:"",logos:null,postMixInProperties:function(){this._nls=f.getLocalization("idx.mobile","AboutPane");this.inherited(arguments)},buildRendering:function(){this.containerNode=b.create("div",{className:"mblIdxAboutContent"});if(this.srcNodeRef)for(var a=0,c=this.srcNodeRef.childNodes.length;a<c;a++)this.containerNode.appendChild(this.srcNodeRef.removeChild(this.srcNodeRef.firstChild));this.inherited(arguments);b.create("div",{className:"mblIdxIbmLogo",title:this._nls.logoIBM},
this.domNode);this._nameNode=b.create("h1",{className:"mblIdxProductName"},this.domNode);this._versionNode=b.create("p",{className:"mblIdxInformational"},this.domNode);this._legalNode=b.create("p",{className:"mblIdxLegal"},this.domNode);this._logosNode=b.create("div",{className:"mblIdxLogos"},this.domNode);this.domNode.appendChild(this.containerNode);e.add(this.domNode,"mblIdxAboutPane")},_refreshVersion:function(){this._versionNode.innerHTML=(this.version?this._nls.labelVersion+" "+this.version:
"")+(this.version&&this.build?"<br />":"")+(this.build?this._nls.labelBuild+" "+this.build:"")},_setVersionAttr:function(a){this.version=a;this._refreshVersion()},_setBuildAttr:function(a){this.build=a;this._refreshVersion()},_refreshLegal:function(){this._legalNode.innerHTML=g.substitute(this.legal,this)},_setLegalAttr:function(a){this.legal=a;this._refreshLegal()},_setCopyrightAttr:function(a){this.copyright=a;this._refreshLegal()},_setTrademarksAttr:function(a){this.trademarks=a;this._refreshLegal()},
_setLogosAttr:function(a){for(;0<this._logosNode.childNodes.length;)this._logosNode.removeChild(this._logosNode.firstChild);for(var c=a.length-1;0<=c;c--)b.create("div",{className:"mblIdxLogo"+a[c]},this._logosNode);b.create("div",{style:"clear: both;"},this._logosNode)}})});