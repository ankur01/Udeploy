//>>built
require({cache:{"url:idx/widget/templates/_CheckBoxTreeNode.html":'<div class="dijitTreeNode" role="presentation"\r\n\t><div data-dojo-attach-point="rowNode" class="dijitTreeRow dijitInline" role="presentation"\r\n\t\t><div data-dojo-attach-point="indentNode" class="dijitInline"></div\r\n\t\t><img src="${_blankGif}" alt="" data-dojo-attach-point="expandoNode" class="dijitTreeExpando" role="presentation"\r\n\t\t/><span data-dojo-attach-point="expandoNodeText" class="dijitExpandoText" role="presentation"\r\n\t\t></span\r\n\t\t><span data-dojo-attach-point="contentNode"\r\n\t\t\tclass="dijitTreeContent" role="presentation"\r\n\t\t\t><input dojoType="idx.form.TriStateCheckBox" states="false,true" data-dojo-attach-point="checkboxNode" tabindex="-1"></input\r\n\t\t\t><img src="${_blankGif}" alt="" data-dojo-attach-point="iconNode" class="dijitIcon dijitTreeIcon" role="presentation"\r\n\t\t\t/><span data-dojo-attach-point="labelNode" class="dijitTreeLabel" role="treeitem" tabindex="-1" aria-selected="false"></span>\r\n\t\t</span\r\n\t></div>\r\n\t<div data-dojo-attach-point="containerNode" class="dijitTreeContainer" role="presentation" style="display: none;"></div>\r\n</div>'}});
define("idx/widget/_CheckBoxTreeNode","dojo/_base/declare,dojo/_base/array,dojo/dom-style,dojo/keys,dijit/_WidgetsInTemplateMixin,dojo/text!./templates/_CheckBoxTreeNode.html,dijit/Tree".split(","),function(g,d,h,f,i,j){return g("idx.widget._CheckBoxTreeNode",[dijit._TreeNode,i],{templateString:j,lastState:!1,cssStateNodes:{labelNode:"dijitTreeLabel"},postCreate:function(){h.set(this.checkboxNode.iconNode,{display:"none"});this.set("lastState",!1);this.connect(this.labelNode,"onkeypress","_labelKeyPressHandler");
this.checkboxNode._handleOnChange=dojo.hitch(this.checkboxNode,function(a,b){if(void 0==this._lastValueReported&&(null===b||!this._onChangeActive))this._resetValue=this._lastValueReported=a;this._pendingOnChange=this._pendingOnChange||typeof a!=typeof this._lastValueReported||0!=this.compare(a,this._lastValueReported);if((this.intermediateChanges||b||void 0===b)&&this._pendingOnChange)this._lastValueReported=a,this._pendingOnChange=!1,this.onChange(a)});this.connect(this.checkboxNode,"onClick",function(){this.updateState(this.checkboxNode.get("checked"));
this.tree.focusNode(this)});this.connect(this.checkboxNode,"onChange",function(){this._onNodeStateChange(this.checkboxNode.get("checked"));this.tree._itemStatus[this.tree.model.getIdentity(this.item)]=this.checkboxNode.get("checked")})},updateState:function(a){void 0==a&&(a=this.checkboxNode.get("checked"));this.checkboxNode.set("checked",a);this.set("lastState",a);this.updateChildren();this.updateParent();!0===a?this.setSelected(!0):this.setSelected(!1)},updateChildren:function(){var a=this.getChildren();
if(a&&0<a.length)!0==this.checkboxNode.checked?d.forEach(a,function(a){a.checkboxNode.set("checked",!0);a.updateChildren()}):!1==this.checkboxNode.checked?d.forEach(a,function(a){a.checkboxNode.set("checked",!1);a.updateChildren()}):d.forEach(a,function(a){a.checkboxNode.set("checked",a.get("lastState"));a.updateChildren()});else{var b=this,e=function(a){b.tree.model.getChildren(a,function(a){for(var c=0;c<a.length;c++)b.tree._itemStatus[b.tree.model.getIdentity(a[c])]=b.checkboxNode.checked,e(a[c])})};
e(b.item)}},updateParent:function(){var a=this.tree.getNodesByItem(this.getParent()?this.getParent().item:null);a&&a[0]&&(a=a[0],a.update(),a.updateParent())},update:function(){for(var a=this.getChildren(),b=0,e=0,c=0;c<a.length;c++){var d=a[c].checkboxNode.get("checked");a[c].set("lastState",d);switch(d){case !0:b++;break;case "mixed":e++}}0<b&&b==a.length?(this.checkboxNode.set("states",[!1,!0]),this.checkboxNode.set("checked",!0)):0==b&&0==e?(this.checkboxNode.set("states",[!1,!0]),this.checkboxNode.set("checked",
!1)):(this.checkboxNode.set("states",[!1,"mixed",!0]),this.checkboxNode.set("checked","mixed"));this.set("lastState",this.checkboxNode.get("checked"))},_onNodeStateChange:function(a){this.tree._onNodeStateChange(this,a)},setSelected:function(a){this.labelNode.setAttribute("aria-selected",a)},_labelKeyPressHandler:function(a){if(a.keyCode==f.SPACE||a.keyCode==f.ENTER||" "===a.keyCode)this.checkboxNode.click(),this.updateState(this.checkboxNode.get("checked"))}})});