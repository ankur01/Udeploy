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
        "js/webext/widgets/ColumnForm",
        "js/webext/widgets/RestSelect"
        ],
function(
        _TemplatedMixin,
        _Widget,
        array,
        declare,
        ColumnForm,
        RestSelect
) {
    return declare('deploy.widgets.security.authentication.EditAuthenticationRealm',  [_Widget, _TemplatedMixin], {
        templateString:
            '<div class="editAuthenticationRealm">'+
            '  <div data-dojo-attach-point="formAttach"></div>'+
            '</div>',

        /**
         * 
         */
        postCreate: function() {
            this.inherited(arguments);
            var self = this;
            
            this.existingValues = {
                properties: {}
            };
            if (this.authenticationRealm) {
                this.existingValues = this.authenticationRealm;
            }
            this.extraPropertyNames = [];
            
            this.form = new ColumnForm({
                submitUrl: bootstrap.baseUrl+"security/authenticationRealm"+(this.authenticationRealm ? "/"+this.authenticationRealm.id : ""),
                submitMethod: this.authenticationRealm ? "PUT" : "POST",
                addData: function(data) {
                    if (self.authenticationRealm) {
                        data.existingId = self.authenticationRealm.id;
                    }
                    
                    data.properties = {};
                    array.forEach(self.extraPropertyNames, function(extraPropertyName) {
                        var propName = "property/"+extraPropertyName;
                        var propValue = data[propName];
                        
                        data.properties[extraPropertyName] = propValue;
                        delete data[propName];
                    });
                },
                postSubmit: function(data) {
                    if (self.callback !== undefined) {
                        var newId = data ? data.id : null;
                        self.callback(true, newId);
                    }
                },
                cancelLabel:null
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

            this.form.addField({
                name: "allowedAttempts",
                label: i18n("Allowed Login Attempts"),
                description: i18n("The number of invalid login attempts before a user account is locked.  Leave blank or enter 0 to allow an unlimited number of attempts."),
                type: "Number",
                textDir: "ltr",
                value: this.existingValues.allowedAttempts
            });
            
            if (this.existingValues.id === "20000000000000000000000000000001") {
                this.form.addField({
                    name: "loginClassName",
                    type: "Invisible",
                    value: this.existingValues.loginModuleClassName
                });
                this.form.addField({
                    name: "authorizationRealm",
                    type: "Invisible",
                    value: this.existingValues.authorizationRealmId
                });
            }
            else {
                this.form.addField({
                    name: "loginClassName",
                    label: i18n("Type"),
                    value: this.existingValues.loginModuleClassName,
                    type: "Select",
                    required: true,
                    onChange: function(value) {
                        self.typeChanged(value);
                    },
                    allowedValues: [{
                        label: i18n("LDAP or Active Directory"),
                        value: "com.urbancode.security.authentication.ldap.LdapLoginModule"
                    },{
                        label: i18n("Single Sign-On"),
                        value: "com.urbancode.security.authentication.sso.SingleSignOnLoginModule"
                    },{
                        label: i18n("Internal Storage"),
                        value: "com.urbancode.security.authentication.internal.InternalLoginModule"
                    }]
                });
                this.typeChanged(this.existingValues.loginModuleClassName || "com.urbancode.security.authentication.ldap.LdapLoginModule"); //THIS IS THE PROBLEM!!!
            }
            
            this.form.placeAt(this.formAttach);
        },
        
        typeChanged: function(value) {
            var self = this;

            if (this.form.hasField("authorizationRealms")) {
                this.form.removeField("authorizationRealms");
            }
            array.forEach(this.extraPropertyNames, function(extraPropertyName) {
                if (self.form.hasField("property/"+extraPropertyName)) {
                    self.form.removeField("property/"+extraPropertyName);
                }
                if (self.form.hasField(extraPropertyName)) {
                    self.form.removeField(extraPropertyName);
                }
            });
            this.extraPropertyNames = [];
            
            // change the display of fields
            if ("com.urbancode.security.authentication.ldap.LdapLoginModule" === value) {
                self.showLDAPFields();
            }
            else if ("com.urbancode.security.authentication.internal.InternalLoginModule" === value) {
                self.showInternalFields();
            }
            else if ("com.urbancode.security.authentication.sso.SingleSignOnLoginModule" === value) {
                self.showSSOFields();
            }
        },
        
        /**
         * Show fields specific to LDAP realms
         */
        showLDAPFields: function() {
            var self = this;

            this.form.addField({
                name: "authorizationRealms",
                label: i18n("Authorization Realm"),
                required: true,
                type: "TableFilterMultiSelect",
                url: bootstrap.baseUrl + "security/authorizationRealm",
                value: self.existingValues.authorizationRealms,
                allowNone: false,
                defaultQuery: {
                    filterFields: "authorizationModuleClassName",
                    filterType_authorizationModuleClassName: "ne",
                    filterValue_authorizationModuleClassName: "com.urbancode.security.authorization.sso.SingleSignOnAuthorizationModule"
                }
            });

            // add ldap fields
            self.form.addField({
                name: "property/context-factory",
                label: i18n("Context Factory"),
                description: i18n("The context factory class to use to connect. This may vary depending upon your specific Java implementation. The default for Sun Java implementations: com.sun.jndi.ldap.LdapCtxFactory"),
                required: true,
                type: "Invisible", // No reason the user should have to worry about this
                value: self.existingValues.properties['context-factory'] || 'com.sun.jndi.ldap.LdapCtxFactory'
            });
            this.extraPropertyNames.push("context-factory");
            
            self.form.addField({
                name: "property/url",
                label: i18n("LDAP URL"),
                description: i18n("The URL of the LDAP server. It should begin with 'ldap://' or 'ldaps://'. Failover servers can be added by separating the URLs with a space. Example: ldap://ldap.mydomain.com:389 ldap://ldap.mydomain2.com"),
                required: true,
                type: "Text",
                textDir: "ltr",
                placeholder: "ldap(s)://example.com",
                value: self.existingValues.properties.url
            });
            this.extraPropertyNames.push("url");

            
            //
            // LDAP search connection type - anonymous or user/password
            //
            self.form.addField({
                name: "_connectionInsertPoint",
                type: "Invisible"
            });
            this.extraPropertyNames.push("_connectionInsertPoint");

            var connectionTypeChanged = function(value) {
                if (self.form.hasField("property/connection-name")) {
                    self.form.removeField("property/connection-name");
                    self.form.removeField("property/connection-password");
                }
                if (value) {
                    self.form.addField({
                        type: "Invisible",
                        name: "property/connection-name",
                        value: ""
                    });
                    self.form.addField({
                        type: "Invisible",
                        name: "property/connection-password",
                        value: ""
                    });
                }
                else {
                    self.form.addField({
                        name: "property/connection-name",
                        label: i18n("Search Connection DN"),
                        description: i18n("The complete directory name to use when binding to LDAP for searches. If not specified, an anonymous connection is made."),
                        required: true,
                        type: "Text",
                        textDir: "ltr",
                        placeholder:  "cn=admin,dc=mydomain,dc=com",
                        value: self.existingValues.properties['connection-name']
                    }, "_connectionInsertPoint");

                    self.form.addField({
                        name: "property/connection-password",
                        label: i18n("Search Connection Password"),
                        description: i18n("The password to use when binding to LDAP for searches.  Used with the Search Connection DN field."),
                        type: "Secure",
                        value: self.existingValues.properties['connection-password']
                    }, "_connectionInsertPoint");
                }
            };
            
            var anonymousConnection = !self.existingValues.properties['connection-name'];
            self.form.addField({
                name: "anonymousConnection",
                type: "Checkbox",
                value: anonymousConnection,
                onChange: connectionTypeChanged,
                label: i18n("Search Anonymously"),
                description: i18n("Select if LDAP accepts anonymous queries. If cleared, specify the LDAP directory with the Search Connection DN field, and associated password. Checked by default.")
            }, "_connectionInsertPoint");
            connectionTypeChanged(anonymousConnection);
            
            this.extraPropertyNames.push("anonymousConnection");
            this.extraPropertyNames.push("connection-password");
            this.extraPropertyNames.push("connection-name");
            
            
            //
            // LDAP search type - pattern or base/filter
            //
            self.form.addField({
                name: "searchTypeLabel",
                type: "Label",
                label: "",
                value: i18n("Specify how to search LDAP. (See documentation for examples.)")
            });
            this.extraPropertyNames.push("searchTypeLabel");

            self.form.addField({
                name: "_searchInsertPoint",
                type: "Invisible"
            });
            this.extraPropertyNames.push("_searchInsertPoint");

            var searchTypeChanged = function(value) {
                if (self.form.hasField("property/user-base")) {
                    self.form.removeField("property/user-base");
                    self.form.removeField("property/user-search");
                    self.form.removeField("property/user-search-subtree");
                }
                if (self.form.hasField("property/user-pattern")) {
                    self.form.removeField("property/user-pattern");
                }
                
                if (value === "searchPattern") {
                    self.form.addField({
                        type: "Invisible",
                        name: "property/user-base",
                        value: ""
                    });
                    self.form.addField({
                        type: "Invisible",
                        name: "property/user-search",
                        value: ""
                    });
                    self.form.addField({
                        type: "Invisible",
                        name: "property/user-search-subtree",
                        value: ""
                    });

                    self.form.addField({
                        name: "property/user-pattern",
                        label: i18n("User DN Pattern"),
                        description: i18n("When you search a single directory, the name is substituted in place of {0} in the pattern, for example, cn={0},ou=employees,dc=yourcompany,dc=com."),
                        required: true,
                        type: "Text",
                        textDir: "ltr",
                        placeholder:  "cn={0},ou=employees,dc=mydomain,dc=com",
                        value: self.existingValues.properties['user-pattern']
                    }, "_searchInsertPoint");
                }
                else if (value === "searchBase") {
                    self.form.addField({
                        type: "Invisible",
                        name: "property/user-pattern",
                        value: ""
                    });

                    self.form.addField({
                        name: "property/user-base",
                        label: i18n("User Search Base"),
                        description: i18n("When you search multiple directories, specify the starting directory that is used for searches, such as ou=employees,dc=mydomain,dc=com."),
                        required: true,
                        type: "Text",
                        textDir: "ltr",
                        placeholder: "ou=employees,dc=mydomain,dc=com",
                        value: self.existingValues.properties['user-base']
                    }, "_searchInsertPoint");
    
                    self.form.addField({
                        name: "property/user-search",
                        label: i18n("User Search Filter"),
                        description: i18n("The LDAP filter expression to use when searching for user directory entries. The username is put in place of {0} in the search pattern. If this is an attribute and not part of the user DN, wrap in parentheses. E.g. uid={0} or (sAMAccountName={0})"),
                        type: "Text",
                        textDir: "ltr",
                        placeholder: "uid={0}",
                        required: true,
                        value: self.existingValues.properties['user-search']
                    }, "_searchInsertPoint");
    
                    self.form.addField({
                        name: "property/user-search-subtree",
                        label: i18n("Search User Subtree"),
                        description: i18n("Search the full subtree for the user, as opposed to a single-level search only covering users directly inside the specified search base."),
                        type: "Checkbox",
                        value: self.existingValues.properties['user-search-subtree'] || true
                    }, "_searchInsertPoint");
                }
            };
            
            var searchType;
            if (self.existingValues.properties["user-base"]) {
                searchType = "searchBase";
            }
            else if (self.existingValues.properties["user-pattern"]) {
                searchType = "searchPattern";
            }
            
            self.form.addField({
                name: "userSearchType",
                type: "Radio",
                label: "",
                value: searchType,
                required: true,
                allowedValues: [{
                    "label": i18n("LDAP users may exist in many directories; search across LDAP using a criteria."),
                    "value": "searchBase"
                },{
                    "label": i18n("LDAP users exist in a single directory; use a pattern to create the DN for users."),
                    "value": "searchPattern"
                }],
                onChange: searchTypeChanged
            }, "_searchInsertPoint");
            searchTypeChanged(searchType);
            this.extraPropertyNames.push("user-pattern");
            this.extraPropertyNames.push("user-base");
            this.extraPropertyNames.push("user-search");
            this.extraPropertyNames.push("user-search-subtree");
            this.extraPropertyNames.push("userSearchType");

            self.form.addField({
                name: "attributesLabel",
                type: "Label",
                label: "",
                value: i18n("Enter the names of attributes in LDAP which contain the following information (optional)")
            });
            this.extraPropertyNames.push("attributesLabel");
            
            self.form.addField({
                name: "property/name-attribute",
                label: i18n("Name Attribute"),
                description: i18n("The attribute name containing user names."),
                required: false,
                type: "Text",
                textDir: "ltr",
                placeholder: "cn",
                value: self.existingValues.properties['name-attribute']
            });
            this.extraPropertyNames.push("name-attribute");

            self.form.addField({
                name: "property/email-attribute",
                label: i18n("Email Attribute"),
                description: i18n("The attribute name containing the users' email."),
                required: false,
                type: "Text",
                textDir: "ltr",
                placeholder: i18n("email"),
                value: self.existingValues.properties['email-attribute']
            });
            this.extraPropertyNames.push("email-attribute");
        },
        
        /**
         * Show fields specific to internal realms
         */
        showInternalFields: function() {
            this.form.addField({
                name: "authorizationRealms",
                label: i18n("Authorization Realm"),
                required: true,
                type: "TableFilterMultiSelect",
                url: bootstrap.baseUrl + "security/authorizationRealm",
                value: this.existingValues.authorizationRealms,
                allowNone: false,
                defaultQuery: {
                    filterFields: "authorizationModuleClassName",
                    filterType_authorizationModuleClassName: "eq",
                    filterValue_authorizationModuleClassName: "com.urbancode.security.authorization.internal.InternalAuthorizationModule"
                }
            });
        },
        
        /**
         * Show fields specific to SSO realms
         */
        showSSOFields: function() {
            var self = this;

            this.form.addField({
                name: "authorizationRealms",
                label: i18n("Authorization Realm"),
                required: true,
                type: "TableFilterMultiSelect",
                url: bootstrap.baseUrl + "security/authorizationRealm",
                value: self.existingValues.authorizationRealms,
                allowNone: false,
                defaultQuery: {
                    filterFields: "authorizationModuleClassName",
                    filterType_authorizationModuleClassName: "ne",
                    filterValue_authorizationModuleClassName: "com.urbancode.security.authorization.ldap.LdapAuthorizationModule"
                }
            });

            self.form.addField({
                type: "Label",
                label: "",
                name: "headersLabel",
                value: i18n("The SSO authentication integration works by looking for request headers to be set by the SSO mechanism. Please provide the names of headers which contain the necessary information.")
            });
            this.extraPropertyNames.push("headersLabel");
            
            self.form.addField({
               name: "property/user-header",
               label: i18n("User Header Name"),
               description: i18n("The name of the header that contains the list of users."),
               required: true,
               type: "Text",
               textDir: "ltr",
               placeholder: "HTTP_USERNAME",
               value: self.existingValues.properties['user-header']
            });
            this.extraPropertyNames.push("user-header");
            
            self.form.addField({
                name: "property/email-header",
                label: i18n("Email Header Name"),
                description: i18n("The name of the header that contains the list of user email addresses."),
                required: false,
                type: "Text",
                placeholder: "HTTP_EMAIL",
                value: self.existingValues.properties['email-header']
            });
            this.extraPropertyNames.push("email-header");

            self.form.addField({
                name: "property/fullname-header",
                label: i18n("Full Name Header Name"),
                description: i18n("The name of the header that contains the user's full name."),
                required: false,
                type: "Text",
                placeholder: "HTTP_FULLNAME",
                value: self.existingValues.properties['fullname-header']
            });
            this.extraPropertyNames.push("fullname-header");
            
            self.form.addField({
                name: "property/logout-url",
                label: i18n("Logout URL"),
                description: i18n("The URL where users are redirected after they log out of IBM UrbanCode Deploy."),
                required: true,
                type: "Text",
                textDir: "ltr",
                placeholder: "https://www.example.com",
                value: self.existingValues.properties['logout-url']
             });
            this.extraPropertyNames.push("logout-url");
        }
    });
});