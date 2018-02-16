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
        "dojo/_base/declare",
        "dojo/_base/xhr",
        "js/webext/widgets/ColumnForm",
        "js/webext/widgets/Alert",
        "deploy/widgets/security/TeamSelector"
        ],
function(
        _TemplatedMixin,
        _Widget,
        declare,
        xhr,
        ColumnForm,
        Alert,
        TeamSelector
) {
    return declare([_Widget, _TemplatedMixin], {
        templateString:
            '<div class="editResourceTemplate">'+
            '  <div data-dojo-attach-point="formAttach"></div>'+
            '</div>',

        /**
         * 
         */
        postCreate: function() {
            this.inherited(arguments);
            var self = this;

            this.readOnly = false;
            if (this.resourceTemplate) {
                this.readOnly = !this.resourceTemplate.security["Edit Basic Settings"];
            }
            
            this.existingValues = {};
            if (this.resourceTemplate) {
                this.existingValues = this.resourceTemplate;
            }
            else {
                if (this.sourceResource) {
                    this.existingValues.name = this.sourceResource.name;
                }

                xhr.get({
                    "url": bootstrap.restUrl + "security/teamsWithCreateAction/Resource Template",
                    "handleAs": "json",
                    "sync": true,
                    "load": function(data) {
                        var extendedSecurity = {"teams": data};
                        self.existingValues.extendedSecurity = extendedSecurity;
                    }
                });
            }

            this.form = new ColumnForm({
                submitUrl: bootstrap.restUrl+"resource/resourceTemplate",
                readOnly: self.readOnly,
                showButtons: !self.readOnly,
                postSubmit: function(data) {
                    if (self.callback !== undefined) {
                        self.callback(data);
                    }
                },
                addData: function(data) {
                    if (self.resourceTemplate) {
                        data.existingId = self.existingValues.id;
                    }
                    if (self.sourceResource) {
                        data.sourceResourceId = self.sourceResource.id;
                    }

                    data.teamMappings = self.teamSelector.teams;
                },
                onError: function(error) {
                    if (error.responseText) {
                        var wrongNameAlert = new Alert({
                            message: util.escape(error.responseText)
                        });
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
                type: "Text",
                value: this.existingValues.description
            });
            
            
            if (this.existingValues.parent || !this.existingValues.id) {
                var defaultQuery = {};
                if (this.application) {
                    // Filter out blueprints from other applications
                    defaultQuery.forApplication = this.application.id;
                }
                this.form.addField({
                    name: "parentId",
                    label: i18n("Parent Template"),
                    description: i18n("A resource template can use another existing template as " +
                            "its parent. If a parent is selected, all resources in the parent " +
                            "template will be inherited by the child, but the child template can " +
                            "still add additional resources as an overlay to the parent template. " +
                            "The parent cannot be changed after creating a resource template."),
                    type: "TableFilterSelect",
                    url: bootstrap.restUrl+"resource/resourceTemplate/couldBeParent",
                    defaultQuery: defaultQuery,
                    readOnly: !!this.existingValues.id,
                    value: this.existingValues.parent ? this.existingValues.parent.id : undefined
                });
            }
            
            if (this.application) {
                this.form.addField({
                    name: "applicationId",
                    type: "Invisible",
                    value: this.application.id
                });
            }

            var currentTeams = [];
            if (!!self.existingValues && !!self.existingValues.extendedSecurity && !!self.existingValues.extendedSecurity.teams) {
                currentTeams = self.existingValues.extendedSecurity.teams;
            }
            this.teamSelector = new TeamSelector({
                resourceRoleType: "Resource Template",
                noneLabel: i18n("Standard Resource Template"),
                teams: currentTeams
            });
            this.form.addField({
                name: "teams",
                label: i18n("Teams"),
                type: "Text",
                description: i18n("In the <b>Teams</b> field, add the teams that should be able to use the new resource template."),
                widget: this.teamSelector
            });

            this.form.placeAt(this.formAttach);
        }
    });
});