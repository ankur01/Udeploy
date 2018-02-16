/*
* Licensed Materials - Property of IBM Corp.
* IBM UrbanCode Deploy
* (c) Copyright IBM Corporation 2011, 2014. All Rights Reserved.
*
* U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
* GSA ADP Schedule Contract with IBM Corp.
*/
/*global define, require */

define([
        "dijit/_TemplatedMixin",
        "dijit/_Widget",
        "dojo/_base/array",
        "dojo/_base/declare",
        "dojo/_base/xhr",
        "js/webext/widgets/ColumnForm"
        ],
function(
        _TemplatedMixin,
        _Widget,
        array,
        declare,
        xhr,
        ColumnForm
) {
    return declare([_Widget, _TemplatedMixin], {
        templateString:
            '<div class="editUser">'+
            '  <div data-dojo-attach-point="formAttach"></div>'+
            '</div>',

        /**
         * 
         */
        postCreate: function() {
            this.inherited(arguments);
            var self = this;
            
            this.existingValues = {};
            if (this.resourceRole) {
                this.existingValues = this.resourceRole;
            }
            
            this.form = new ColumnForm({
                submitUrl: bootstrap.baseUrl+"security/resourceRole" + (this.resourceRole ? "/"+this.resourceRole.id : ""),
                submitMethod: this.resourceRole ? "PUT" : "POST",
                cancelLabel: null,
                addData: function(data) {
                    data.resourceType = self.resourceType.id;
                },
                postSubmit: function(data) {
                    if (self.callback !== undefined) {
                        self.callback(true, data.id);
                    }
                },
                onCancel: function() {
                    if (self.callback !== undefined) {
                        self.callback();
                    }
                }
            });
            
            this.form.addField({
                name: "name",
                label: i18n("Name"),
                required: true,
                type: "Text",
                value: this.existingValues.name
            });
            
            this.form.addField({
                name: "description",
                label: i18n("Description"),
                required: false,
                type: "Text",
                value: this.existingValues.description
            });
            
            this.form.placeAt(this.formAttach);
        }
    });
});