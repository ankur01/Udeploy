//>>built
define("idx/widget/checkboxtree/_dndSelector","dojo/_base/declare,dojo/_base/connect,dojo/_base/array,dojo/_base/lang,dojo/_base/event,dojo/_base/window,dojo/mouse,dijit/tree/_dndContainer".split(","),function(g,e,d,f,h,i,j,k){return g("idx.widget.checkboxtree._dndSelector",k,{constructor:function(){this.selection={};this.anchor=null;this.events.push(e.connect(this.tree,"_onNodeStateChange",this,"_onNodeStateChange"),e.connect(this.tree.domNode,"onmousedown",this,"onMouseDown"),e.connect(this.tree.domNode,
"onmouseup",this,"onMouseUp"),e.connect(this.tree.domNode,"onmousemove",this,"onMouseMove"))},singular:!1,candidateNode:null,getSelectedTreeNodes:function(){var a=[],b=this.selection,c;for(c in b)a.push(b[c]);return a},selectNone:function(){this.setSelection([]);return this},destroy:function(){this.inherited(arguments);this.selection=this.anchor=null},addTreeNode:function(a,b){this.setSelection(this.getSelectedTreeNodes().concat([a]));if(b)this.anchor=a;return a},removeTreeNode:function(a){this.setSelection(this._setDifference(this.getSelectedTreeNodes(),
[a]));return a},isTreeNodeSelected:function(a){return a.id&&!!this.selection[a.id]},setSelection:function(a){var b=this.getSelectedTreeNodes();d.forEach(this._setDifference(b,a),f.hitch(this,function(a){a.setSelected(!1);this.anchor==a&&delete this.anchor;delete this.selection[a.id]}));d.forEach(this._setDifference(a,b),f.hitch(this,function(a){a.setSelected(!0);this.selection[a.id]=a}));this._updateSelectionProperties()},_setDifference:function(a,b){d.forEach(b,function(a){a.__exclude__=!0});var c=
d.filter(a,function(a){return!a.__exclude__});d.forEach(b,function(a){delete a.__exclude__});return c},_updateSelectionProperties:function(){var a=this.getSelectedTreeNodes(),b=[],c=[];d.forEach(a,function(a){c.push(a);b.push(a.getTreePath())});a=d.map(c,function(a){return a.item});this.tree._set("paths",b);this.tree._set("path",b[0]||[]);this.tree._set("selectedNodes",c);this.tree._set("selectedNode",c[0]||null);this.tree._set("selectedItems",a);this.tree._set("selectedItem",a[0]||null)},_onNodeStateChange:function(a,
b){var c=this.getSelectedTreeNodes();1==c.length&&!1===c[0].checkboxNode.checked&&this.selectNone();!0==b?this.addTreeNode(a,!0):this.selection[a.id]&&this.removeTreeNode(a)},getItem:function(a){return{data:this.selection[a],type:["treeNode"]}},userSelect:function(a,b,c){if(this.singular)this.anchor==a&&b?this.selectNone():(this.setSelection([a]),this.anchor=a);else if(c&&this.anchor){c=this.anchor;0>this._compareNodes(this.anchor.rowNode,a.rowNode)?b=c:(b=a,a=c);for(nodes=[];b!=a;)nodes.push(b),
b=this.tree._getNextNode(b);nodes.push(a);this.setSelection(nodes)}else this.selection[a.id]&&b?this.removeTreeNode(a):b?this.addTreeNode(a,!0):(this.setSelection([a]),this.anchor=a)},forInSelectedItems:function(a,b){var b=b||i.global,c;for(c in this.selection)a.call(b,this.getItem(c),c,this)},onMouseDown:function(a){if(this.current&&j.isLeft(a))h.stop(a),this.candidateNode=this.current},onMouseMove:function(){},onMouseUp:function(){this.candidateNode=null}})});