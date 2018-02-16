//>>built
require({cache:{"url:idx/layout/templates/HeaderPane.html":'<div class="idxHeaderPane" role=region" wairole="region" aria-labelledby="${id}_Title"\r\n><div class="idxHeaderFrame" data-dojo-attach-point="_frameNode"\r\n><div class="idxHeaderPaneHeader" data-dojo-attach-point="_headerNode"\r\n><div class="idxHeaderPaneA11y"\r\n><span id="${id}_contentTitle" data-dojo-attach-point="_contentTitleNode"></span\r\n></div><div class="idxHeaderPaneTitleBar"  data-dojo-attach-point="_headerTitleNode"\r\n><div data-dojo-attach-point="_leadingTitleNode"\r\n></div><div data-dojo-attach-point="_trailingTitleNode"\r\n></div></div><div class="idxHeaderPaneSpacer" data-dojo-attach-point="_headerSpacerNode"\r\n></div><div class="idxHeaderPaneActions" data-dojo-attach-point="_headerActionsNode"\r\n><div data-dojo-attach-point="_leadingActionsNode"\r\n></div><div data-dojo-attach-point="_trailingActionsNode"\r\n></div></div></div><div class="idxHeaderPaneContent" data-dojo-attach-point="containerNode" tabindex="${tabIndex}" \r\n\t\t\t\t\t\trole="region" wairole="region" aria-labelledby="${id}_contentTitle"\r\n></div></div></div>\r\n'}});
define("idx/layout/HeaderPane","dojo/_base/declare,idx/layout/ContentPane,dijit/layout/_LayoutWidget,dijit/_TemplatedMixin,dijit/_CssStateMixin,dojo/_base/lang,dojo/aspect,dojo/dom-attr,dojo/dom-class,dijit/_Widget,dojo/_base/array,dojo/string,dojo/query,dojo/dom-construct,dojo/dom-style,dojo/dom-geometry,dojo/_base/event,dijit/registry,dijit/form/Button,../string,../util,../border/BorderLayout,../widget/_MaximizeMixin,../resources,dojo/text!./templates/HeaderPane.html,dojo/NodeList-dom,dijit/layout/BorderContainer,dojo/i18n!../nls/base,dojo/i18n!./nls/base,dojo/i18n!./nls/HeaderPane".split(","),
function(q,r,s,t,u,g,h,m,c,v,i,w,n,o,e,p,j,B,l,f,k,x,y,z,A){return q("idx.layout.HeaderPane",[r,s,t,u],{tabIndex:0,autoHeight:!1,autoHideActions:!1,closable:!1,refreshable:!1,resizable:!1,resizeDuration:0,helpURL:"",defaultActionDisplay:"",contentFocus:!0,baseClass:"idxHeaderPane",templateString:A,constructor:function(){this._majorActions=[];this._minorActions=[];this._titleActions=[];this._headerPaneStarted=this._built=!1;this._maximizeMixin=new y({inPlace:!0})},destroy:function(){this._destroyDefaultCloseButton();
this._destroyDefaultRefreshButton();this._destroyDefaultResizeButton();this._destroyDefaultHelpButton();if(this._actionsLookup)for(var a in this._actionsLookup)i.forEach(this._actionsLookup[a],function(a){a.handle&&(a.handle.remove(),delete a.handle)});i.forEach(this.getTitleActionChildren(),function(a){a.destroyRecursive()});i.forEach(this.getMajorActionChildren(),function(a){a.destroyRecursive()});i.forEach(this.getMinorActionChildren(),function(a){a.destroyRecursive()});this.inherited(arguments)},
postMixInProperties:function(){this.inherited(arguments)},_setupNodes:function(){if(this._built)this.isLeftToRight()?(this._leftTitleNode=this._leadingTitleNode,this._rightTitleNode=this._trailingTitleNode,this._leftActionsNode=this._leadingActionsNode,this._rightActionsNode=this._trailingActionsNode,this._titleNode=this._leftTitleNode,this._titleActionsNode=this._rightTitleNode,this._majorActionsNode=this._leftActionsNode,this._minorActionsNode=this._rightActionsNode):(this._leftTitleNode=this._trailingTitleNode,
this._rightTitleNode=this._leadingTitleNode,this._leftActionsNode=this._trailingActionsNode,this._rightActionsNode=this._leadingActionsNode,this._titleNode=this._rightTitleNode,this._titleActionsNode=this._leftTitleNode,this._majorActionsNode=this._rightActionsNode,this._minorActionsNode=this._leftActionsNode),c.add(this._leftTitleNode,this.baseClass+"TitleLeft"),c.add(this._rightTitleNode,this.baseClass+"TitleRight"),c.add(this._leftActionsNode,this.baseClass+"ActionsLeft"),c.add(this._rightActionsNode,
this.baseClass+"ActionsRight"),this._regionLookup={body:this.containerNode,titleActions:this._titleActionsNode,majorActions:this._majorActionsNode,minorActions:this._minorActionsNode},this._actionsLookup={titleActions:this._titleActions,majorActions:this._majorActions,minorActions:this._minorActions},m.set(this._titleNode,{tabindex:""+this.tabIndex,id:this.id+"_Title"}),c.remove(this._titleActionsNode,this.baseClass+"TitleText"),c.remove(this._titleNode,this.baseClass+"TitleActions"),c.remove(this._majorActionsNode,
this.baseClass+"MinorActions"),c.remove(this._minorActionsNode,this.baseClass+"MajorActions"),c.add(this._titleNode,this.baseClass+"TitleText"),c.add(this._titleActionsNode,this.baseClass+"TitleActions"),c.add(this._majorActionsNode,this.baseClass+"MajorActions"),c.add(this._minorActionsNode,this.baseClass+"MinorActions"),this._titleNode.innerHTML=this.title},_setTitleAttr:function(a){this.title=a;this.inherited(arguments);if(this._built){this._titleNode.innerHTML=this.title;var b=z.get("contentTitleTemplate",
"idx/layout/HeaderPane");f.nullTrim(b)||(b="${title}");this._contentTitleNode.innerHTML=w.substitute(b,{title:this.title});this.resize()}},buildRendering:function(){this.inherited(arguments);this._built=!0;this._updateActionHiding();this._setupNodes();this.own(h.after(this._maximizeMixin,"_restore",g.hitch(this,this._onRestore),!0))},_setAutoHideActionsAttr:function(a){this.autoHideActions=a;this._updateActionHiding()},_updateActionHiding:function(){this._built&&(this.autoHideActions?c.add(this.domNode,
this.baseClass+"AutoHide"):c.remove(this.domNode,this.baseClass+"AutoHide"))},setOptimalSize:function(){this.borderLayout.setOptimalSize()},_setDefaultActionDisplayAttr:function(a){this.defaultActionDisplay=a;this._closeButton&&this._closeButton.set("displayMode",this.defaultActionDisplay);this._refreshButton&&this._refreshButton.set("displayMode",this.defaultActionDisplay);this._resizeButton&&this._resizeButton.set("displayMode",this.defaultActionDisplay);this._helpButton&&this._helpButton.set("displayMode",
this.defaultActionDisplay);this.resize()},_setClosableAttr:function(a){var b=this.closable;this.closable=a;this._idxStarted&&b!=this.closable&&(this.closable?this._createDefaultCloseButton():this._destroyDefaultCloseButton())},_setRefreshableAttr:function(a){var b=this.refreshable;this.refreshable=a;this._idxStarted&&b!=this.refreshable&&(this.refreshable?this._createDefaultRefreshButton():this._destroyDefaultRefreshButton())},_setResizableAttr:function(a){var b=this.resizable;this.resizable=a;this._idxStarted&&
b!=this.resizable&&(this.resizable?this._createDefaultResizeButton():(this._destroyDefaultResizeButton(),this._maximized&&this._restorePane()))},_setResizeDurationAttr:function(a){this.resizeDuration=a;this._setupMaximizeAnimation()},_setupMaximizeAnimation:function(){0<this.resizeDuration?(this._maximizeMixin.useAnimation=!0,this._maximizeMixin.duration=this.resizeDuration):(this._maximizeMixin.useAnimation=!1,this._maximizeMixin.duration=0)},_setHelpURLAttr:function(a){var b=this.helpURL;this.helpURL=
a;this._idxStarted&&(a=f.nullTrim(b)?!1:!0,b=f.nullTrim(this.helpURL)?!1:!0,a!=b&&(b?this._destroyDefaultHelpButton():this._createDefaultHelpButton()))},_createDefaultCloseButton:function(){if(!this._closeButton)this._closeButton=new l({buttonType:"close",placement:"toolbar",region:"titleActions",displayMode:this.defaultActionDisplay}),this._closeHandle&&(this._closeHandle.remove(),delete this._closeHandle),this._closeHandle=h.after(this._closeButton,"onClick",g.hitch(this,"_closePane"),!0),this.addChild(this._closeButton),
this._idxStarted&&this._closeButton.startup()},_destroyDefaultCloseButton:function(){this._closeHandle&&(this._closeHandle.remove(),delete this._closeHandle);this._closeButton&&(this.removeChild(this._closeButton),this._closeButton.destroyRecursive(),delete this._closeButton)},_createDefaultRefreshButton:function(){if(!this._refreshButton)this._refreshButton=new l({buttonType:"refresh",placement:"toolbar",region:"titleActions",displayMode:this.defaultActionDisplay}),this._refreshHandle&&(this._refreshHandle.remove(),
delete this._refreshHandle),this._refreshHandle=h.after(this._refreshButton,"onClick",g.hitch(this,"refreshPane"),!0),this.addChild(this._refreshButton),this._idxStarted&&this._refreshButton.startup()},_destroyDefaultRefreshButton:function(){this._refreshHandle&&(this._refreshHandle.remove(),delete this._refreshHandle);this._refreshButton&&(this.removeChild(this._refreshButton),this._refreshButton.destroyRecursive(),delete this._refreshButton)},_createDefaultResizeButton:function(){if(!this._resizeButton)this._resizeButton=
new l({buttonType:"maxRestore",placement:"toolbar",region:"titleActions",displayMode:this.defaultActionDisplay}),this._resizeHandle&&(this._resizeHandle.remove(),delete this._resizeHandle),this._resizeHandle=h.after(this._resizeButton,"onButtonTypeClick",g.hitch(this,"_resizePane"),!0),this.addChild(this._resizeButton),this._idxStarted&&this._resizeButton.startup()},_destroyDefaultResizeButton:function(){this._resizeHandle&&(this._resizeHandle.remove(),delete this._resizeHandle);this._resizeButton&&
(this.removeChild(this._resizeButton),this._resizeButton.destroyRecursive(),delete this._resizeButton)},_createDefaultHelpButton:function(){if(!this._helpButton)this._helpButton=new l({buttonType:"help",placement:"toolbar",region:"titleActions",displayMode:this.defaultActionDisplay}),this._helpHandle&&(this._helpHandle.remove(),delete this._helpHandle),this._helpHandle=h.after(this._helpButton,"onClick",g.hitch(this,"_displayHelp"),!0),this.addChild(this._helpButton),this._idxStarted&&this._helpButton.startup()},
_destroyDefaultHelpButton:function(){this._helpHandle&&(this._helpHandle.remove(),delete this._helpHandle);this._helpButton&&(this.removeChild(this._helpButton),this._helpButton.destroyRecursive(),delete this._helpButton)},postCreate:function(){this.inherited(arguments)},startup:function(){this._idxStarted?this.inherited("startup",arguments):(this._idxStarted=!0,this.borderLayout=new x({frameNode:this._frameNode,topNode:this._headerNode,bottomNode:null,leftNode:null,rightNode:null,centerNode:this.containerNode,
design:"headline",leftToRight:this.isLeftToRight()}),this.inherited("startup",arguments),this._trackMouseState(this._headerNode,"idxHeaderPaneHeader"),this._href&&this.set("href",this._href),(this._isShown()||this.preload)&&this._onShow(),i.forEach(this.getChildren(),this._setupChild,this),this.refreshable&&this._createDefaultRefreshButton(),f.nullTrim(this.helpURL)&&this._createDefaultHelpButton(),this.resizable&&this._createDefaultResizeButton(),this.closable&&this._createDefaultCloseButton(),this._updateActionBarVisibility(),
this.resize(),this.autoHeight&&this.borderLayout.setOptimalHeight())},_removeDefaultButtons:function(a){if(this._restoringDefaultButtons)return!1;var b=!1;this._closeButton&&a!=this._closeButton&&(this.removeChild(this._closeButton),b=!0);this._resizeButton&&a!=this._resizeButton&&(this.removeChild(this._resizeButton),b=!0);this._helpButton&&a!=this._helpButton&&(this.removeChild(this._helpButton),b=!0);this._refreshButton&&a!=this._refreshButton&&(this.removeChild(this._refreshButton),b=!0);return b},
_restoreDefaultButtons:function(){if(!this._restoringDefaultButtons)this._restoringDefaultButtons=!0,this._refreshButton&&this.addChild(this._refreshButton),this._helpButton&&this.addChild(this._helpButton),this._resizeButton&&this.addChild(this._resizeButton),this._closeButton&&this.addChild(this._closeButton),this._restoringDefaultButtons=!1},layout:function(){this._checkIfSingleChild();this.borderLayout.layout();this.inherited(arguments)},addChild:function(a,b){var d=this._removeDefaultButtons(a);
(!this._isDefaultButton(a)||!d)&&this.inherited(arguments);d&&this._restoreDefaultButtons(a);this.resize()},_setContentFocusAttr:function(a){(this.contentFocus=a)?m.set(this.containerNode,"tabIndex",""+this.tabIndex):m.set(this.containerNode,"tabindex","-1")},_isDefaultButton:function(a){return a==this._closeButton||a==this._resizeButton||a==this._refreshButton||a==this._helpButton},removeChild:function(a){for(var b=0,d=-1,c=null,b=0;b<this._majorActions.length;b++)if(a===this._majorActions[b].widget){d=
b;c=this._majorActions;break}if(0>d)for(b=0;b<this._minorActions.length;b++)if(a===this._minorActions[b].widget){d=b;c=this._minorActions;break}if(0>d)for(b=0;b<this._titleActions.length;b++)if(a===this._titleActions[b].widget){d=b;c=this._titleActions;break}if(0<=d){if(b=c[d].handle)b.remove(),delete c[d].handle;c.splice(d,1)}this.inherited(arguments);if(a&&a==this._enhancedTitle)this._internalSet=!0,this.set("title",""),this._internalSet=!1;this.resize()},_setupChild:function(a){this.inherited(arguments);
var b=f.nullTrim(a.get("region")),c=null;if("title"==b)this.set("title",a);else{if(null==b||0==b.length)b="body";var e=this._regionLookup[b],c=this._actionsLookup[b];if(null==e)e=this._regionLookup.body,c=null;e!=this.containerNode&&((new n.NodeList(a.domNode)).orphan(),o.place(a.domNode,e,"last"),b=null,a.onResize&&(b=h.after(a,"onResize",g.hitch(this,"resize"),!0)),c.push({widget:a,handle:b}),this._updateActionBarVisibility())}},_updateActionBarVisibility:function(){0<this._majorActions.length+
this._minorActions.length?(c.remove(this._headerActionsNode,this.baseClass+"ActionsHidden"),c.remove(this._headerSpacerNode,this.baseClass+"SpacerHidden")):(c.add(this._headerActionsNode,this.baseClass+"ActionsHidden"),c.add(this._headerSpacerNode,this.baseClass+"SpacerHidden"))},resize:function(a,b){if(this._idxStarted){this.inherited(arguments);var d=k.getStaticSize(this._leftTitleNode),f=k.getStaticSize(this._rightTitleNode),g=k.getStaticSize(this._leftActionsNode),h=k.getStaticSize(this._rightActionsNode),
i=d.h>f.h?d.h:f.h,j=g.h>h.h?g.h:h.h;e.set(this._leftTitleNode,{width:d.w+"px",height:d.h+"px"});e.set(this._rightTitleNode,{width:f.w+"px",height:f.h+"px"});e.set(this._leftActionsNode,{width:g.w+"px",height:g.h+"px"});e.set(this._rightActionsNode,{width:h.w+"px",height:h.h+"px"});e.set(this._headerTitleNode,{height:i+"px"});e.set(this._headerActionsNode,{height:j+"px"});this.borderLayout.layout();this._singleChild&&this._singleChild.resize&&(d=p.getContentBox(this.containerNode),this._singleChild.resize({w:d.w,
h:d.h}),d=this.getChildren()[0],c.add(d.domNode,this.baseClass+"-onlyChild"))}},getTitleActionChildren:function(){for(var a=[],b=0;b<this._titleActions.length;b++)a.push(this._titleActions[b].widget);return a},getMajorActionChildren:function(){for(var a=[],b=0;b<this._majorActions.length;b++)a.push(this._majorActions[b].widget);return a},getMinorActionChildren:function(){for(var a=[],b=0;b<this._minorActions.length;b++)a.push(this._minorActions[b].widget);return a},_onShow:function(){this._idxStarted&&
this.inherited(arguments)},_setHrefAttr:function(a){this._idxStarted?(this._href=null,a!=this.href&&this.inherited(arguments)):this._href=a},set:function(a,b){!this._internalSet&&"title"==a?this._setTitleObject(b):this.inherited(arguments)},get:function(a){return!this._internalGet&&"title"==a&&this._enhancedTitle?this._enhancedTitle:this.inherited(arguments)},_setTitleObject:function(a){this._enahncedTitle&&(this.removeChild(this._enhancedTitle),this._enhancedTitle.destroy&&this._enhancedTitle.destroy());
this._titleNode.innerHTML="";if("object"!=k.typeOfObject(a))this._internalSet=!0,this.set("title",""+a),this._internalSet=!1,this._enhancedTitle=null;else{this._enhancedTitle=a;var b=null,b=a instanceof v?a.domNode:a;(new n.NodeList(b)).orphan();o.place(b,this._titleNode,"last");this.resize()}},_closePane:function(a){a&&j.stop(a);this.onClose();this.destroy()},onRefresh:function(){},refreshPane:function(a){a&&j.stop(a);a=this.get("href");if(f.nullTrim(a)){var b=p.getContentBox(this.containerNode);
e.set(this.containerNode,{height:""+b.h+"px"});this._refreshing=!0;b=this.refresh();this.onRefresh(this,a,b)}else this.onRefresh(this)},onDownloadEnd:function(){this.inherited(arguments);this._refreshing=!1;e.set(this.containerNode,{height:null});this.resize();this.autoHeight&&this.borderLayout.setOptimalHeight()},onDownloadError:function(){this.inherited(arguments);this._refreshing=!1;e.set(this.containerNode,{height:null});this.resize();this.autoHeight&&this.borderLayout.setOptimalHeight()},_resizePane:function(a,
b){a&&j.stop(a);switch(b){case "maximize":this.maximizePane();break;case "restore":this.restorePane()}return!1},maximizePane:function(a){if(!a)a=this.domNode.parentNode;if(a){var b=this.domNode.style.position;this._restorePosition=f.nullTrim(b)?b:"";switch(b){case "absolute":break;default:e.set(this.domNode,{position:"relative"})}this._maximizeMixin.maximize(this.domNode,a);this._maximized=!0;this._resizeButton&&(this._resizeButton.set("hovering",!1),this._resizeButton.set("active",!1));this.onMaximize()}},
restorePane:function(){this._maximized&&this._maximizeMixin.restore()},_onRestore:function(){e.set(this.domNode,{position:this._restorePosition});this._maximized=!1;this._resizeButton&&(this._resizeButton.set("hovering",!1),this._resizeButton.set("active",!1));this.onRestore()},onMaximize:function(){},onRestore:function(){},_displayHelp:function(a){a&&j.stop(a);if(f.nullTrim(this.helpURL))if(!this._helpWindow||this._helpWindow.closed)this._openNewHelpWindow();else try{this._helpWindow.location.assign(this.helpURL),
this._helpWindow.focus()}catch(b){this._openNewHelpWindow()}},_openNewHelpWindow:function(){if(f.nullTrim(this.helpURL)&&(this._helpWindow=window.open(this.helpURL,"_blank"),0==this.helpURL.indexOf("http://")||0==this.helpURL.indexOf("https://")))this._helpWindow=null}})});