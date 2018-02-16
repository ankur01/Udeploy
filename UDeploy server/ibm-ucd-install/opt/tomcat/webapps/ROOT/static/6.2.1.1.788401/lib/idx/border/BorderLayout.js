//>>built
define("idx/border/BorderLayout",["dojo/_base/declare","dojo/dom-style","dojo/dom-geometry","../util","./BorderDesign"],function(l,i,m,j,k){return l("idx.border.BorderLayout",null,{design:null,frameNode:null,topNode:null,bottomNode:null,leftNode:null,rightNode:null,centerNode:null,constructor:function(a){this.design=a.design instanceof k?a.design:new k(a.design,a.leftToRight);this.frameNode=a.frameNode;this.topNode=a.topNode;this.bottomNode=a.bottomNode;this.leftNode=a.leftNode;this.rightNode=a.rightNode;
this.centerNode=a.centerNode;var b={position:"absolute",margin:"0px"};this.style(this.topNode,b);this.style(this.bottomNode,b);this.style(this.leftNode,b);this.style(this.rightNode,b);i.set(this.centerNode,b);this._nodeLookup={header:this.topNode,top:this.topNode,left:this.leftNode,center:this.centerNode,right:this.rightNode,footer:this.bottomNode,bottom:this.bottomNode};if(null!=a.leftToRight)this._nodeLookup.leader=a.leftToRight?this.leftNode:this.rightNode,this._nodeLookup.trailer=a.leftToRight?
this.rightNode:this.leftNode},style:function(a,b){a&&i.set(a,b)},marginBox:function(a){return!a?{w:0,h:0}:m.getMarginBox(a)},layout:function(){var a=this.marginBox(this.topNode),b=this.marginBox(this.leftNode),d=this.marginBox(this.rightNode),e=this.marginBox(this.bottomNode),a={left:b.w+"px",right:d.w+"px",top:a.h+"px",bottom:e.h+"px"};this.style(this.centerNode,a);for(edge in a){b={};d=this._nodeLookup[edge];e=this.design[edge+"Styler"];for(side in e){var c=e[side];a[c]&&(c=a[c]);b[side]=c}this.style(d,
b)}},setOptimalWidth:function(a){a=this.computeOptimalWidth(a);i.set(this.centerNode,{width:""});i.set(this.frameNode,{width:a+"px"});this.layout()},computeOptimalWidth:function(a){for(var b=this.design.wideners,d=0,e=0,d=0;d<b.length;d++){var c=0,g=b[d];if(!a||!(0<g.length&&"center"==g[0])){for(var f=0,c=0;c<g.length;c++){var h=this._nodeLookup[g[c]];h&&(h=j.getStaticSize(h),f+=h.w)}f>e&&(e=f)}}return e},setOptimalHeight:function(a){a=this.computeOptimalHeight(a);i.set(this.centerNode,{height:""});
i.set(this.frameNode,{height:a+"px"});this.layout()},computeOptimalHeight:function(a){for(var b=this.design.heighteners,d=0,e=0,d=0;d<b.length;d++){var c=0,g=b[d];if(!a||!(0<g.length&&"center"==g[0])){for(var f=0,c=0;c<g.length;c++){var h=this._nodeLookup[g[c]];h&&(h=j.getStaticSize(h),f+=h.h)}f>e&&(e=f)}}return f},setOptimalSize:function(){var a=this.computeOptimalWidth(),b=this.computeOptimalHeight();i.set(this.centerNode,{height:"",width:""});i.set(this.frameNode,{width:a+"px",height:b+"px"});
this.layout()}})});