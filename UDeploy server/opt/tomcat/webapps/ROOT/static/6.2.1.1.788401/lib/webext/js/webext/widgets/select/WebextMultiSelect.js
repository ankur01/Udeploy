/*
* Licensed Materials - Property of IBM Corp.
* IBM UrbanCode Build
* IBM UrbanCode Deploy
* IBM UrbanCode Release
* IBM AnthillPro
* (c) Copyright IBM Corporation 2002, 2014. All Rights Reserved.
*
* U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
* GSA ADP Schedule Contract with IBM Corp.
*/
/*global define, require */

define([
        "dojo/_base/array",
        "dojo/_base/declare",
        "dojo/_base/event",
        "dojo/aspect",
        "dojo/dom-class",
        "dojo/dom-construct",
        "dojo/dom-geometry",
        "dojo/dom-style",
        "dojo/mouse",
        "dojo/on",
        "dojo/json",
        "dojo/when",
        "dijit/form/CheckBox",
        "js/webext/widgets/select/WebextSelect",
        "js/webext/widgets/Util"
        ],
function(
        array,
        declare,
        event,
        aspect,
        domClass,
        domConstruct,
        domGeom,
        domStyle,
        mouse,
        on,
        JSON,
        when,
        CheckBox,
        WebextSelect,
        Util
) {
    /**
     * WebextMultiSelect - Extends WebextSelect with the ability to select multiple items. See
     * WebextSelect for full documentation of all common features and properties.
     *
     * ~ PROPERTIES ~
     *
     * showClear (boolean): Display link to clear selected items. Default: true.
     * 
     * idAttribute (string): Property name which contains a unique identifier for each object. Default: id
     *
     * clearSelectedItemsLabel (string) : Label for clear selected items button. Default (Clear Selection)
     *
     *
     * ~ FUNCTIONS ~
     *
     * onAdd(item)
     * onRemove(item)
     *     Events fired when items are selected or removed from the selection list
     *     @param item: The data of the selected or removed item.
     *
     * onSelectedRollOver(item, node)
     * onSelectedRollOut(item, node)
     *     Functions when selected item in selected items list is hovered on.
     *     @param item: The data of the selected item.
     *     @param node: The node of the item.
     *
     * formatSelectedItem(selectedItem, item, label, removeItem)
     *    Formats the selected items in the selected items list.
     *    @param selectedItem: The entire selected item node.
     *    @param item: The data associated with the selectedItem.
     *    @param label: The label node.
     *    @param removeItem: The remove item node.
     *
     * clearSelectedItems()
     *    Clears selected items if multiple is specified.
     */
    return declare('js.webext.widgets.select.WebextMultiSelect', [WebextSelect], {
        templateString:
            '<div class="webext-multi-select combo-check-box-select filtering-scroll-select">' +
                '<div class="combo-box-attach" data-dojo-attach-point="comboBoxAttachPoint"></div>' +
                '<div data-dojo-attach-point="clearSelectedItemsAttachPoint"></div>' +
                '<div class="selected-items-list" data-dojo-attach-point="selectedItemsAttachPoint"></div>' +
            '</div>',

        showClear: true,
        idAttribute: "id",

        postCreate: function(){
            var self = this;

            // Mapping of item IDs to the DOM nodes showing the list of selected items.
            this._selectedItems = {};

            // Override so WebextSelect's useless clear button isn't shown
            this.allowNone = false; 

            if (!this.readOnly) {
                var clearSelectedItemsLink = domConstruct.create("div", {
                    innerHTML: this.clearSelectedItemsLabel || i18n("Clear Selection"),
                    className: "linkPointer clear-selected-items"
                });
                domConstruct.place(clearSelectedItemsLink, self.clearSelectedItemsAttachPoint);

                on(clearSelectedItemsLink, "click", function() {
                    array.forEach(self.items.slice(), function(selectedItem) {
                        self.removeItem(selectedItem);
                    });
                });
            }

            this.inherited(arguments);
        },
        
        /**
         * Add an object to our item list and show it in the 'selected items' list.
         */
        addItem: function(item) {
            var self = this;
            
            if (item && item[self.searchAttr]) {
                self.items.push(item);

                var selectedItem = self._createSelectedItem(item, item[self.searchAttr]);
                domConstruct.place(selectedItem, self.selectedItemsAttachPoint);

                if (!self.placeHolder) {
                    self.dropDown.set("placeHolder", i18n("%s Selected", self.items.length));
                }

                // Ensure that we have the has-value class so the 'remove all' button will show.
                domClass.add(self.domNode, "has-value");
                self.onAdd(item);
            }
        },
        
        /**
         * Remove an object from our item list and remove it from the 'selected items' list.
         */
        removeItem: function(item) {
            var self = this;
            
            if (item) {
                // We have to locate the actual object instance from our items array and then
                // remove that, since the item given as the argument here does not === any of
                // the things in self.items.
                var itemFromSelectedItems;
                array.forEach(self.items, function(selectedItem) {
                    if (selectedItem[self.idAttribute] === item[self.idAttribute]) {
                        itemFromSelectedItems = selectedItem;
                    }
                });
                new Util().removeFromArray(self.items, itemFromSelectedItems);
                
                var selectedItem = self._selectedItems[item[self.idAttribute]];
                domConstruct.destroy(selectedItem);

                if (!self.placeHolder) {
                    self.dropDown.set("placeHolder", i18n("%s Selected", self.items.length));
                }

                // If there are no items, remove has-value so we suppress the 'remove all' button
                if (self.items.length === 0) {
                    domClass.remove(self.domNode, "has-value");
                }
                
                self.onRemove(item);
            }
        },

        _setInitialValue: function() {
            var self = this;
            this.items = [];
            
            if (self.value) {
                array.forEach(self.value, function(existingValue) {
                    self.addItem(existingValue);
                });
            }
        },

        /**
         * Override WebextSelect's events because we need to track the added values differently.
         */
        _attachDropDownEvents: function() {
            var self = this;
            aspect.before(self.dropDown, "_setBlurValue", function() {
                self.dropDown.set("value", "", false, "", {});
            });
        },
        
        addOrRemoveItem: function(item) {
            var self = this;
            if (self.itemSelected(item)) {
                self.removeItem(item);
            }
            else {
                self.addItem(item);
            }
        },
        
        _setupStylingInterceptors: function(dropDownScroller) {
            var self = this;
            
            // Intercept the call to create the DOM for the option in the drop-down list so we
            // can apply styling to it
            // Originally defined in _ComboBoxMenuMixin
            aspect.around(dropDownScroller, "_createOption", function(originalFunction) {
                return function(item, labelFunc) {
                    var result = originalFunction.apply(dropDownScroller, arguments);
                    self.formatDropDownLabel(result, item);
                    
                    var checkBox = new CheckBox({
                        checked: self.itemSelected(item)
                    });
                    domConstruct.place(checkBox.domNode, result, "first");

                    result.checkBox = checkBox;
                    on(result, "mouseup", function(e) {
                        checkBox.set("checked", !checkBox.get("checked"));
                        self.addOrRemoveItem(item);
                        event.stop(e);
                    });
                    on(checkBox, "click", function(e) {
                        checkBox.set("checked", !checkBox.get("checked"));
                        event.stop(e);
                    });
                    
                    return result;
                };
            });
        },
        
        /**
         * Creates a single selected item to display in the selected items list.
         */
        _createSelectedItem: function(item, label){
            var self = this;
            var selectedItem = domConstruct.create("div", {
                className: "selected-item-container",
                title: label
            });
            this.own(on(selectedItem, mouse.enter, function(){
                self.onSelectedRollOver(item, selectedItem);
            }));
            this.own(on(selectedItem, mouse.leave, function(){
                self.onSelectedRollOut(item, selectedItem);
            }));
            
            var removeItem = null;
            if (!self.readOnly) {
                removeItem = domConstruct.create("div", {
                    className: "remove-selected-item",
                    innerHTML: "X"
                }, selectedItem);

                this.own(on(removeItem, "click", function() {
                    self.removeItem(item);
                }));
            }
            
            var labelItem = domConstruct.create("div", {
                className: "selected-item-label",
                innerHTML: label.escape()
            }, selectedItem);
            
            if (this.dropDown){
                var maxWidth = domGeom.position(this.dropDown.domNode).w;
                // Selected item is as wide as the drop down.
                domStyle.set(labelItem, "max-width", maxWidth - 22 + "px");
            }

            this.formatSelectedItem(selectedItem, item, labelItem, removeItem);
            
            self._selectedItems[item[self.idAttribute]] = selectedItem;
            return selectedItem;
        },
        
        /**
         * Indicates whether the given object is already included in the list of selected items.
         */
        itemSelected: function(item) {
            var self = this;
            
            var result = false;
            array.forEach(this.items, function(selectedItem) {
                if (selectedItem[self.idAttribute] === item[self.idAttribute]) {
                    result = true;
                }
            });
            
            return result;
        },
        
        /**
         * Formats the selected items in the selected item list.
         * @param selectedItem: The entire selected item node.
         * @param item: The data associated with the selectedItem.
         * @param label: The label node.
         * @param removeItem: The remove item node.
         */
        formatSelectedItem: function(selectedItem, item, label, removeItem){},

        /**
         * Functions when selected item is hover on.
         * @param item: The data of the selected item.
         * @param node: The node of the item.
         */
        onSelectedRollOver: function(item, node){},
        onSelectedRollOut: function(item, node){},
        
        /**
         * Event handlers for adding/removing selected items.
         */
        onAdd: function(item){},
        onRemove: function(item){},
        
        // Defer to the dropdown to get value
        _getValueAttr: function() {
            var self = this;
            var result = [];
            
            array.forEach(self.items, function(selectedItem) {
                result.push(selectedItem[self.idAttribute]);
            });
            
            return result;
        },
        
        _setValueAttr: function(value) {
            var self = this;
            var finVal = value;
            // Value in some cases is a JSON array passed as a string and this segment is necessary to handle the string representation
            if (typeof value === "string" && value !== "") {
                finVal = JSON.parse(value,true);

                // We need to make "faux" items for setting the value
                array.forEach(finVal, function(id) {
                    // This forces the store to retrieve the object so we can get the searchAttr
                    when(self.store.get(id), function(item) {
                        var obj = {
                        };
                        obj[self.idAttribute] = id;
                        obj[self.searchAttr] = item[self.searchAttr];
                        self.addItem(obj);
                    });
                });
            }
            else {
                WebextSelect.prototype._setValueAttr.call(self, value);
            }
        }
    });
});
