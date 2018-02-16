//>>built
define("idx/dnd/Avatar",["dojo/main","dojo/dnd/common","dojo/string","dojo/i18n!./nls/Avatar"],function(b,g,e,c){b.declare("idx.dnd.Avatar",null,{constructor:function(a){this.manager=a;this.construct()},construct:function(){var a=b.create("div",{"class":"idxDndAvatar",style:{position:"absolute",zIndex:"1999",margin:"0px"}});b.create("div",{"class":"dropIndicator dijitInline"},a);var f=b.create("div",{"class":"idxDndAvatarBody dijitInline",style:{opacity:0.9}},a),d=this._generateText(),d=this.manager.copy?
1===d?c.copyOneText:e.substitute(c.copyText,{num:'<span class="itemNumber">'+d+"</span>"}):1===d?c.moveOneText:e.substitute(c.moveText,{num:'<span class="itemNumber">'+d+"</span>"});b.create("span",{"class":"dndType",innerHTML:d},f);this.node=a},destroy:function(){b.destroy(this.node);this.node=!1},update:function(){b[(this.manager.canDropFlag?"add":"remove")+"Class"](this.node,"idxDndAvatarCanDrop");b.query("idxDndAvatarBody itemNumber",this.node).forEach(function(a){a.innerHTML=this._generateText()},
this)},_generateText:function(){var a=0;b.forEach(this.manager.nodes,function(c){a+=b.query(".dijitLeaf",c).length});return a}});return idx.dnd.Avatar});