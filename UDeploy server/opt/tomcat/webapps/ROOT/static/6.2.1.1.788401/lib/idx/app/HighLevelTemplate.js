//>>built
define("idx/app/HighLevelTemplate","dojo/_base/declare,dojo/_base/array,dojo/_base/lang,dojo/dom-class,dojo/dom-attr,dojo/dom-construct,dijit/registry,dijit/layout/BorderContainer,dijit/layout/ContentPane,dijit/_Widget,idx/layout/ToggleSplitter".split(","),function(g,h,d,i,j,e,k,l,f){return d.getObject("idx.oneui.layout",!0).HighLevelTemplate=g("idx.app.HighLevelTemplate",[l],{gutters:!1,header:null,_regionRoleMap:{top:"banner",center:"main",leading:"navigation",trailing:"complementary",bottom:"contentinfo"},
buildRendering:function(){this.inherited(arguments);if(this.header){var a=k.byId(this.header);a&&"idx.app.Header"==a.declaredClass&&(e.place(a.domNode,this.domNode,"first"),a.region||a.set("region","top"))}},startup:function(){if(!this._started){var a,b;h.some(this.getChildren(),function(c){c&&"top"==c.region?a=c:c&&"center"==c.region&&(b=c);if(a&&b)return!0});a||(a=new f({region:"top",style:"height: 75px"}),this.addChild(a));b||(b=new f({region:"center"}),this.addChild(b));this.inherited(arguments)}},
_setupChild:function(a){var b=a.region;if(b){dijit.layout._LayoutWidget.prototype._setupChild.apply(this,arguments);i.add(a.domNode,this.baseClass+"Pane");j.set(a.domNode,"role",this._regionRoleMap[b]);var c=this.isLeftToRight();"leading"==b&&(b=c?"left":"right");"trailing"==b&&(b=c?"right":"left");if((a.splitter||a.gutter||this.gutters)&&!a._splitterWidget)c=new (d.getObject(a.splitter?"toggle"==a.splitter?"idx.layout.ToggleSplitter":"dijit.layout._Splitter":"dijit.layout._Gutter"))({id:a.id+"_splitter",
container:this,child:a,region:b,live:this.liveSplitters}),c.isSplitter=!0,a._splitterWidget=c,e.place(c.domNode,a.domNode,"after"),c.startup();a.region=b}}})});