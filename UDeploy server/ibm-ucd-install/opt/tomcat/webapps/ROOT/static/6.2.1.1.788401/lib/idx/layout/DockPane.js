//>>built
define("idx/layout/DockPane","dojo/_base/declare,dojo/_base/lang,dojo/_base/array,dojo/_base/window,dojo/_base/html,dojo/_base/event,dojo/_base/connect,dojo/keys,dijit/registry,idx/html,idx/util,idx/layout/TitlePane,idx/layout/_Dockable".split(","),function(g,h,k,l,b,d,m,e,n,o,f,i,j){return g("idx.layout.DockPane",[i,j],{doLayout:!0,hideIcon:!0,scrollOpacity:!1,buildRendering:function(){this.inherited(arguments);this.dragNode=this.titleBarNode;b.addClass(this.titleBarNode,"idxDockPaneTitle");b.addClass(this.hideNode,
"idxDockPaneContentOuter");b.addClass(this.focusNode,"idxDockPaneTitleFocus")},postCreate:function(){this.inherited(arguments);this.connect(this._wipeIn,"onEnd","onOpen");this.connect(this._wipeOut,"onEnd","onClose")},startup:function(){this.inherited(arguments);if(this.scrollOpacity)this._scrollConnect=this.connect(this.titleBarNode,f.isMozilla?"DOMMouseScroll":"onmousewheel",h.hitch(this,"_onWheel"))},onOpen:function(){},onClose:function(){},onDock:function(a){if("top"==a||"bottom"==a)this.set("toggleable",
!1),this.set("doLayout",!0),this.open||this.toggle(),this._setDockedStyle();dojo.removeClass(this.titleBarNode,"dijitTitlePaneTitleHover")},_setDockedStyle:function(){var a=b.contentBox(this.domNode.parentNode),c=b.marginBox(this.titleBarNode).h;b.marginBox(this.hideNode,{h:a.h-c-3});b.style(this.hideNode,"overflow","auto")},resize:function(){this.inherited(arguments);("top"==this.dockArea||"bottom"==this.dockArea)&&this._setDockedStyle();7===f.isIE&&b.marginBox(this.titleBarNode,{w:b.contentBox(this.domNode).w})},
_resetDockedStyle:function(){b.style(this.hideNode,"height","auto")},onUndock:function(a){this.inherited(arguments);this._resetDockedStyle();this.set("toggleable",!0);this.set("doLayout",!1);this.set("open",!0);b.style(this.domNode,"height","")},_onShow:function(){this.inherited(arguments);this.onDock(this.dockArea)},_onTitleClick:function(a){d.stop(a)},_onDragMouseUp:function(a){!this._dragging&&this.toggleable&&this.toggle();this.inherited(arguments)},_onTitleKey:function(){},_onKey:function(a){var b=
a.keyCode;a.ctrlKey&&"float"==this.dockArea?b==e.UP_ARROW?(this._setOpacity(1),d.stop(a)):b==e.DOWN_ARROW&&(this._setOpacity(-1),d.stop(a)):this.inherited(arguments)},_onWheel:function(a){var a=a||window.event,b=0;a.wheelDelta?b=a.wheelDelta:a.detail&&(b=-1*a.detail);this._setOpacity(b);d.stop(a);return!1},_setOpacity:function(a){var c=b.style(this.domNode,"opacity"),c=Math.min(1,Math.max(0.1,c-0+(0<a?0.1:-0.1)));b.style(this.domNode,"opacity",c)}})});