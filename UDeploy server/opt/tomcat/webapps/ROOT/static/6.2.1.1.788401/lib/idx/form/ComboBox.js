//>>built
require({cache:{"url:idx/form/templates/ComboBox.html":'<div id="widget_${id}" class="dijitReset dijitInline idxComposite" dojoAttachPoint="_popupStateNode"\r\n\t><div class="idxLabel dijitInline dijitHidden"\r\n\t\t><span class="idxRequiredIcon">*&nbsp</span\r\n\t\t><label for="${id}" dojoAttachPoint="compLabelNode"\r\n\t\t></label\r\n\t></div\r\n\t><div class="dijitInline"\r\n\t\t><div class="dijit dijitInline dijitReset dijitInlineTable dijitLeft" role="combobox" dojoAttachPoint="stateNode,oneuiBaseNode,_aroundNode"\r\n\t\t\t><div class=\'dijitReset dijitRight dijitButtonNode dijitArrowButton dijitDownArrowButton dijitArrowButtonContainer\' dojoAttachPoint="_buttonNode" role="presentation"\r\n\t\t\t><input class="dijitReset dijitInputField dijitArrowButtonInner" value="&#9660; " type="text" tabIndex="-1" readonly="readonly" role="presentation"\r\n\t\t\t${_buttonInputDisabled}\r\n\t\t\t/></div\r\n\t\t\t><div class="dijitReset dijitInputField dijitInputContainer" dojoAttachPoint="inputContainer" dojoAttachEvent="onmouseenter: _onInputContainerEnter, onmouseleave: _onInputContainerLeave"\r\n\t\t\t\t><input class=\'dijitReset dijitInputInner\' ${!nameAttrSetting}  type="text" autocomplete="off" dojoAttachPoint="textbox,focusNode" role="textbox" aria-haspopup="true" \r\n\t\t\t/></div\r\n\t\t></div\r\n\t\t><div class="idxUnit dijitInline dijitHidden" dojoAttachPoint="compUnitNode"\r\n\t\t></div\r\n\t\t><div class=\'dijitReset dijitValidationContainer dijitInline\' dojoAttachPoint="iconNode"\r\n\t\t\t><div class="dijitValidationIcon"\r\n\t\t\t><input class="dijitReset dijitInputField  dijitValidationInner" value="&#935;" type="text" tabIndex="-1" readonly="readonly" role="presentation"/\r\n\t\t></div></div\r\n\t\t><div class="dijitHidden idxHintOutside" dojoAttachPoint="compHintNode"></div\r\n\t></div\r\n></div>'}});
define("idx/form/ComboBox","dojo/_base/declare,dojo/_base/lang,dojo/_base/window,dojo/_base/event,dojo/_base/Deferred,dojo/dom-class,dojo/data/util/filter,dojo/window,dojo/keys,dijit/form/ComboBox,./_CssStateMixin,./_ComboBoxMenu,./_CompositeMixin,./_ValidationMixin,./TextBox,dojo/text!./templates/ComboBox.html".split(","),function(e,f,q,r,s,a,t,i,u,j,k,l,m,n,o,p){return f.getObject("idx.oneui.form",!0).ComboBox=e("idx.form.ComboBox",[j,k,m,n],{instantValidate:!1,baseClass:"idxComboBoxWrap",oneuiBaseClass:"dijitTextBox dijitComboBox",
templateString:p,dropDownClass:l,cssStateNodes:{_buttonNode:"dijitDownArrowButton"},postCreate:function(){this.extension={input:"_onInput",blur:"_onBlur",focus:"_onFocus"};this.inherited(arguments)},_isEmpty:function(){return/^\s*$/.test(this.value||"")},_openResultList:function(g,a,b){this._fetchHandle=null;if(!this.disabled&&!(this.readOnly||a[this.searchAttr]!==this._lastQuery)){var e=this.dropDown.getHighlightedOption();this.dropDown.clearResultList();if(!g.length&&0==b.start)this.closeDropDown();
else{this._nextSearch=this.dropDown.onPage=f.hitch(this,function(a){g.nextPage(-1!==a);this.focus()});this.dropDown.createOptions(g,b,f.hitch(this,"_getMenuLabelFromItem"));var c=this.dropDown.containerNode.childNodes;this._showResultList();if(!this._lastInput)for(var d=0;d<c.length;d++){var h=this.dropDown.items[c[d].getAttribute("item")];if(h&&this.store.getValue(h,this.searchAttr).toString()==this.displayedValue){this.dropDown._setSelectedAttr(c[d]);i.scrollIntoView(this.dropDown.selected);break}}b.direction?
(1==b.direction?this.dropDown.highlightFirstOption():-1==b.direction&&this.dropDown.highlightLastOption(),e&&this._announceOption(this.dropDown.getHighlightedOption())):this.autoComplete&&!this._prev_key_backspace&&!/^[*]+$/.test(a[this.searchAttr].toString())&&this._announceOption(c[1])}}},_onInputContainerEnter:function(){a.toggle(this.oneuiBaseNode,"dijitComboBoxInputContainerHover",!0)},_onInputContainerLeave:function(){a.toggle(this.oneuiBaseNode,"dijitComboBoxInputContainerHover",!1)},_setReadOnlyAttr:function(a){this.inherited(arguments);
this.dropDown&&this.dropDown.set("readOnly",a)},_setValueAttr:function(){o.prototype._setValueAttr.apply(this,arguments)}})});