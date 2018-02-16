/*
* Licensed Materials - Property of IBM Corp.
* IBM UrbanCode Deploy
* (c) Copyright IBM Corporation 2011, 2014. All Rights Reserved.
*
* U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
* GSA ADP Schedule Contract with IBM Corp.
*/
/*global define, require */
define(['dojo/_base/declare',
        'dojo/_base/xhr',
        'dijit/_WidgetBase',
        'dojo/on',
        'dojo/dom-class',
        'dojo/dom-construct',
        'dojo/DeferredList',
        'dijit/Dialog',
        'dijit/focus',
        'js/webext/widgets/Alert'],
        function (
            declare,
            xhr,
            _WidgetBase,
            on,
            domClass,
            domConstruct,
            DeferredList,
            Dialog,
            focusUtil,
            Alert) {
    /**
     * A widget to show "Getting Started" popup dialog. The popup will be shown if it has not been dismissed
     * by the user and alerts are not being suppressed by the user. This is determined by using user
     * properties set in sec_user_property table. Properties are named with a "dismissed_" prefix
     * followed by the given name of the widget (unless given name already begins with "dismissed_")
     *
     * Supported public properties/functions:
     *  name / String                   (required) The name of the alert. The name is important for determining user
     *                                  preference of when to show or not show the popup. It is saved in the backend.
     *
     *  open / Function                 Function to show the popup
     *
     *  close / Function                Function to hide the popup
     *
     */
    return declare('deploy.widgets.GetStartedPopup',
            [_WidgetBase], {

        name: undefined,
        alertName: undefined,
        dismissUrl: undefined,
        dismissedPrefix: 'dismissed_',
        userIntent: false,
        links: {},

        /**
         * create dialog
         * check backend to determine whether to automatically show the get-started dialog
         * @private
         */
        postCreate: function() {
            var self = this;

            this.createDialog();

            var docLinksUrl = bootstrap.restUrl + 'deploy/docLinks';
            var userPreferencesUrl = bootstrap.restUrl + 'security/userPreferences';
            this.alertName = '';
            if (this.name.indexOf(this.dismissedPrefix) !== 0) {
                this.alertName += this.dismissedPrefix;
            }
            this.alertName += this.name;

            if (!this.dismissUrl) {
                this.dismissUrl = userPreferencesUrl + '/dismissAlert/' + this.alertName;
            }

            var loadPreference = dojo.xhrGet({
                url: userPreferencesUrl,
                handleAs: 'json'
            });

            var loadDocLinks = dojo.xhrGet({
                url: docLinksUrl,
                handleAs: 'json'
            });

            new DeferredList([loadPreference, loadDocLinks]).then(
                function(result) {
                    var pref = result[0][1];
                    self.links = result[1][1];
                    if (!pref.suppressAlerts &&
                        !pref.dismissedUserAlerts[self.alertName]) {
                        self.open(false);
                    }
            });
        },

        /**
         * @private
         */
        createDialog: function() {
            var self = this;
            this.gsDialog = new Dialog({
                className: 'get-started-popup',
                closeable: true
            });

            var getStartedCloseButton = domConstruct.create('div', {
                className: 'close-popup-button',
                title: i18n('Close')
            }, this.gsDialog.titleNode);
            on(getStartedCloseButton, 'click', function() {
                self.close();
            });

            domConstruct.create('div', {
               innerHTML: '<h1 class="title">' + i18n("Getting Started with IBM UrbanCode Deploy") + '</h1>' +
                          '<div class="content">' +
                            '<div class="bottomrow">' +
                              '<div class="badgecontainer tutorial-container" tabindex="1">' +
                                '<div class="secondarytaskbadges tutorial"></div>' +
                                '<div class="secondarytasklbl">' + i18n("TUTORIAL") + '</div>' +
                              '</div>' +
                              '<div class="badgecontainer videos-container" tabindex="2">' +
                                '<div class="secondarytaskbadges videos"></div>' +
                                '<div class="secondarytasklbl">' + i18n("INSTRUCTIONAL VIDEOS") + '</div>' +
                              '</div>' +
                              '<div class="badgecontainer questions-container" tabindex="3">' +
                                '<div class="secondarytaskbadges questions"></div>' +
                                '<div class="secondarytasklbl">' + i18n("QUESTIONS") + '</div>' +
                              '</div>' +
                              '<div class="badgecontainer documentation-container" tabindex="4">' +
                                '<div class="secondarytaskbadges documentation"></div>' +
                                '<div class="secondarytasklbl">' + i18n("DOCUMENTATION") + '</div>' +
                              '</div>' +
                            '</div>' +
                            '<div class="message">' + i18n("Access this Getting Started anytime from the banner help menu") + '</div>' +
                          '</div>'
            }, this.gsDialog.containerNode);

            var clickables = dojo.query('.get-started-popup .badgecontainer');
            dojo.forEach(clickables, function(el) {
                if (domClass.contains(el, 'tutorial-container')) {
                    on(el, 'click, keypress', function(evt) {self.launch(evt, 'tutorial');});
                }
                else if (domClass.contains(el, 'videos-container')) {
                    on(el, 'click, keypress', function(evt) {self.launch(evt, 'video');});
                }
                else if (domClass.contains(el, 'questions-container')) {
                    on(el, 'click, keypress', function(evt) {self.launch(evt, 'question');});
                }
                else if (domClass.contains(el, 'documentation-container')) {
                    on(el, 'click, keypress', function(evt) {self.launch(evt, 'documentation');});
                }
            });
        },

        /**
         * @private
         */
        a11yClick: function(event) {
            if (event.type === 'click') {
                return true;
            }
            if (event.type === 'keypress') {
                var code = event.charCode || event.keyCode;
                if ((code === 32) || (code === 13)) {
                    return true;
                }
            }
            return false;
        },

        /**
         * @private
         */
        launch: function(evt, target) {
            if (this.a11yClick(evt) && this.links[target + 'Url']) {
                window.open(this.links[target + 'Url'], '_blank');
            }
        },

        /**
         * @private
         */
        onDismiss: function() {
            xhr.post({
                url: this.dismissUrl,
                headers: { 'Content-Type': 'application/json' },
                handleAs: 'json',
                error: function(response) {
                    var dismissalError = new Alert({
                        messages: [i18n('Error dismissing get started:'),
                                   '',
                                   util.escape(response.responseText)]
                    });
                }
            });
        },

        /**
         * @public
         */
        open: function(userIntent) {
            this.userIntent = userIntent;
            if (this.gsDialog) {
                this.gsDialog.show();
            }
        },

        /**
         * @public
         */
        close: function() {
            if (this.gsDialog) {
               this.gsDialog.hide();
               if (!this.userIntent) {
                   this.onDismiss();
               }
            }
        }

    });
});
