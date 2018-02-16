/*
* Licensed Materials - Property of IBM Corp.
* IBM UrbanCode Deploy
* (c) Copyright IBM Corporation 2011, 2016. All Rights Reserved.
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
        "dojo/_base/fx",
        "dijit/form/Button",
        "dojo/dom-construct",
        "dojo/dom-class",
        "dojo/dom-style",
        "dojo/on",
        "dojo/query",
        "dojo/store/Memory",
        "js/webext/widgets/select/WebextSelect",
        "js/webext/widgets/Alert",
        "js/webext/widgets/ColumnForm",
        "js/webext/widgets/FormDelegates",
        "js/webext/widgets/DomNode",
        "js/webext/widgets/RestSelect",
        "deploy/widgets/settings/CleanupProgressBar",
        "dojo/NodeList-dom"
        ],
function(
        _TemplatedMixin,
        _Widget,
        array,
        declare,
        xhr,
        fx,
        Button,
        domConstruct,
        domClass,
        domStyle,
        on,
        query,
        Memory,
        WebextSelect,
        Alert,
        ColumnForm,
        FormDelegates,
        DomNode,
        RestSelect,
        CleanupProgressBar
) {
    return declare('deploy.widgets.settings.SystemSettings',  [_Widget, _TemplatedMixin], {
        templateString:
            '<div class="systemSettings">'+
            '  <div data-dojo-attach-point="formAttach"></div>'+
            '  <div data-dojo-attach-point="buttonAttach"></div>'+
            '</div>',

        /**
         *
         */
        postCreate: function() {
            this.inherited(arguments);
            var self = this;

            this.existingValues = {};
            if (this.version) {
                this.existingValues = this.version;
            }

            xhr.get({
                url: bootstrap.restUrl+"system/configuration",
                handleAs: "json",
                load: function(data) {
                    var form = new ColumnForm({
                        addData: function(data) {
                            if (data.historyCleanupTimeOfDay) {
                                data.historyCleanupTimeOfDay = util.combineDateAndTime(
                                    new Date(),
                                    data.historyCleanupTimeOfDay)
                                    .valueOf();
                            }
                        },
                        cancelLabel: null,
                        submitUrl: bootstrap.restUrl+"system/configuration",
                        postSubmit: function(data) {
                            //reload the page so that config variable is updated.
                            location.reload(true);
                        },
                        validateFields: function(data) {
                            var result = [];

                            var repoAutoIntegrationPeriod = parseInt(data.repoAutoIntegrationPeriod, 10);
                            if (isNaN(repoAutoIntegrationPeriod)) {
                                result.push(i18n("The automatic version import check period must be an integer."));
                            }
                            else if (repoAutoIntegrationPeriod < 1) {
                                result.push(i18n("The automatic version import check period must be at least 1 second."));
                            }
                            else {
                                data.repoAutoIntegrationPeriod = repoAutoIntegrationPeriod;
                            }

                            var deployMailPort = parseInt(data.deployMailPort, 10);
                            if (isNaN(deployMailPort)) {
                                result.push(i18n("The mail server port number must be an integer."));
                            }
                            else {
                                data.deployMailPort = deployMailPort;
                            }

                            var cleanupHourOfDay = parseInt(data.cleanupHourOfDay, 10);
                            if (isNaN(cleanupHourOfDay)) {
                                result.push(i18n("The cleanup hour must be an integer."));
                            }
                            else if (cleanupHourOfDay < 0 || cleanupHourOfDay > 23) {
                                result.push(i18n("The cleanup hour of day must be an integer between 0 (midnight) and 23 (11 PM)."));
                            }
                            else {
                                data.cleanupHourOfDay = cleanupHourOfDay;
                            }

                            var cleanupDaysToKeep = parseInt(data.cleanupDaysToKeep, 10);
                            if (isNaN(cleanupDaysToKeep)) {
                                result.push(i18n("The cleanup days to keep must be an integer."));
                            }
                            else if (cleanupDaysToKeep < -1 || cleanupDaysToKeep === 0) {
                                result.push(i18n("The cleanup days to keep must be -1 or greater than 0."));
                            }
                            else {
                                data.cleanupDaysToKeep = cleanupDaysToKeep;
                            }

                            var cleanupCountToKeep = parseInt(data.cleanupCountToKeep, 10);
                            if (isNaN(cleanupCountToKeep)) {
                                result.push(i18n("The cleanup version count to keep must be an integer."));
                            }
                            else if (cleanupCountToKeep < -1 || cleanupCountToKeep === 0) {
                                result.push(i18n("The cleanup version count to keep must be -1 or greater than 0."));
                            }
                            else {
                                data.cleanupCountToKeep = cleanupCountToKeep;
                            }

                            if (this.hasField("historyCleanupTimeOfDay")) {

                                if (!new RegExp("^([1-9]|1[0-9]|2[0-3])$")
                                            .test(data.historyCleanupDuration)) {
                                    result.push(i18n("The history cleanup duration must be an " +
                                            "integer between 1 hour and 23 hours (inclusive)."));
                                }

                                if (!new RegExp("^[0-9]+$").test(data.historyCleanupDaysToKeep)) {
                                    result.push(i18n("The history cleanup days to keep must be an " +
                                            "integer, 0 or greater."));
                                }
                            }

                            if (data.winRSAgent === null || data.winRSAgent === "") {
                                data.winRSAgent = "NONE";
                            }

                            return result;
                        }
                    });
                    self.addField = function(options){
                        var field = form.addField(options);
                        if (field && field.widget.fieldRow){
                            var row = field.widget.fieldRow;
                            if (options.className){
                                domClass.add(row, options.className);
                            }
                            if (options.type === "SectionLabel"){
                                domClass.add(row, "section-label-row");
                            }
                            if (options.type === "Select" || options.type === "FilteringSelect"){
                                domClass.add(row, "select-widget-row");
                            }
                            if (options.type === "Text" || options.type === "Secure"){
                                domClass.add(row, "text-widget-row");
                            }
                            if (options.type === "Switch"){
                                domClass.add(row, "switch-widget-row");
                            }
                            if (options.icon){
                                var iconNode = field.widget.domAttach;
                                domConstruct.create("div", {
                                    className: "inline-block settings-icon general-settings-section-header " + options.icon + "-icon"
                                }, iconNode, "first");
                            }
                        }
                        return field;
                    };

                    var formContainer = domConstruct.create("div", {
                        className: "form-container"
                    }, form.formAttach, "first");
                    var column1 = domConstruct.create("div", {
                        className: "settings-column inline-block"
                    }, formContainer);
                    var column2 = domConstruct.create("div", {
                        className: "settings-column inline-block"
                    }, formContainer);


                    ///////////////////////////////////////////////////////////////////////////////
                    // General Settings
                    ///////////////////////////////////////////////////////////////////////////////
                    var generalSettingsContainer = domConstruct.create("div", {
                        className: "inline-block settings-section"
                    }, column1);
                    var generalSettings = domConstruct.create("div", {
                        className: "settings-section-inner general-settings"
                    }, generalSettingsContainer);

                    self.addField({
                        type: "SectionLabel",
                        value: i18n("General Settings"),
                        style: {
                            fontWeight: "bold",
                            marginTop: "15px"
                        },
                        attachPoint: generalSettings,
                        icon: "general-settings"
                    });

                    self.addField({
                        name: "externalURL",
                        label: i18n("External Agent URL"),
                        description: i18n("URL for agents to request information from the %s server.", bootstrap.productName),
                        value: data.externalURL,
                        required: true,
                        type: "Text",
                        textDir: "ltr",
                        bidiDynamicSTT: "URL",
                        attachPoint: generalSettings
                    });

                    self.addField({
                        name: "externalUserURL",
                        label: i18n("External User URL"),
                        description: i18n("URL for users to access the %s web UI.", bootstrap.productName),
                        value: data.externalUserURL,
                        required: true,
                        type: "Text",
                        bidiDynamicSTT: "URL",
                        textDir: "ltr",
                        attachPoint: generalSettings
                    });

                    self.addField({
                        name: "enableMaintenanceMode",
                        label: i18n("Enable Maintenance Mode"),
                        description: i18n("This option will prevent users from starting processes while enabled."),
                        value: data.enableMaintenanceMode,
                        type: "Switch",
                        color: "orange",
                        attachPoint: generalSettings
                    });

                    self.addField({
                        name: "validateAgentIp",
                        label: i18n("Validate Agent IP"),
                        description: i18n("This setting enables validation of agent IPs and hostnames. The first time an agent connects, its IP and hostname will be saved. In subsequent connections, if either has changed, the agent will be prevented from coming online."),
                        value: data.validateAgentIp,
                        type: "Switch",
                        attachPoint: generalSettings
                    });

                    self.addField({
                        name: "skipCollectPropertiesForExistingAgents",
                        label: i18n("Skip Property Updates for Existing Agents"),
                        description: i18n("If this is set, agent properties will not be updated when an existing agent reconnects to the server. This means agent properties may become stale, but allows large numbers of agents to come online more quickly at server startup."),
                        value: data.skipCollectPropertiesForExistingAgents,
                        type: "Switch",
                        attachPoint: generalSettings
                    });

                    self.addField({
                        name: "enableUIDebugging",
                        label: i18n("Enable UI Debugging"),
                        description: i18n("This option will change how UI resources are loaded so that it is easier to debug problems with the UI. Enabling this option will reduce UI performance."),
                        value: data.enableUIDebugging,
                        type: "Switch",
                        color: "orange",
                        attachPoint: generalSettings
                    });

                    self.addField({
                        name: "requireCommentForProcessChanges",
                        label: i18n("Require a Comment For Process Design Changes"),
                        description: i18n("When this option is enabled, the user must provide a comment when saving changes to any process design."),
                        value: data.requireCommentForProcessChanges,
                        type: "Switch",
                        attachPoint: generalSettings
                    });

                    self.addField({
                        name: "isCreateDefaultChildren",
                        label: i18n("Create Default Children for Plugins"),
                        description: i18n("When this option is enabled, empty groups are created when plugins use the auto discovery feature."),
                        value: data.isCreateDefaultChildren,
                        type: "Switch",
                        attachPoint: generalSettings
                    });

                    form.addField({
                        name: "enforceDeployedVersionIntegrity",
                        label: i18n("Enforce Deployed Version Integrity"),
                        description: i18n("When this option is enabled, versions which have been involved in a deployment cannot have their artifacts altered; such as adding version files using the CLI client."),
                        value: data.enforceDeployedVersionIntegrity,
                        type: "Switch",
                        attachPoint: generalSettings
                    });

                    var localeSelect = new RestSelect({
                        restUrl: bootstrap.restUrl+"security/userPreferences/availableLocales",
                        getLabel: function(item) {
                            return item.displayName;
                        },
                        getValue: function(item) {
                            return item.value;
                        },
                        allowNone: false,
                        value: data.defaultLocale,
                        escapeHTMLLabel: false,
                        attachPoint: generalSettings
                    });
                    self.addField({
                        name: "defaultLocale",
                        label: i18n("Default Locale"),
                        description: i18n("This value is only used when the user has not set a locale in preferences and when the browser has set no accept-language."),
                        required: true,
                        widget: localeSelect,
                        attachPoint: generalSettings
                    });

                    self.addField({
                        name: "defaultSnapshotLockType",
                        label: i18n("Default Snapshot Lock Type"),
                        description: i18n("The default snapshot locking mode for environments which have specified to lock snapshots."),
                        required: true,
                        value: data.defaultSnapshotLockType,
                        type: "Select",
                        className: "default-snapshot-dropdown",
                        allowedValues: [{
                            label: i18n("Component Versions and Configuration"),
                            value: "ALL"
                        },{
                            label: i18n("Only Component Versions"),
                            value: "VERSIONS"
                        },{
                            label: i18n("Only Configuration"),
                            value: "CONFIGURATION"
                        }],
                        attachPoint: generalSettings
                    });

                    self.addField({
                        name: "repoAutoIntegrationPeriod",
                        label: i18n("Automatic Version Import Check Period (seconds)"),
                        description: i18n("The number of seconds between polls for new versions for all components with this option turned on. Requires a server restart to take effect. It is not recommend to set this to less than 15."),
                        value: data.repoAutoIntegrationPeriod/1000,
                        required: true,
                        type: "Text",
                        textDir: "ltr",
                        attachPoint: generalSettings
                    });

                    var useIntegrationTag = data.integrationTag !== undefined;

                    self.addField({
                        name: "useTagForIntegration",
                        label: i18n("Use Agent Tag For Integration"),
                        description: i18n("Use an agent tag to specify a group of agents to run version imports on instead of using a specific agent"),
                        type: "Switch",
                        value: useIntegrationTag,
                        onChange: function(value) {
                            if (value) {
                                self.removeIntegrationAgentField();
                                self.addIntegrationTagField(form, data.integrationTag, generalSettings);
                            }
                            else {
                                self.removeIntegrationTagField();
                                self.addIntegrationAgentField(form, data.artifactAgent, data.artifactAgentName, generalSettings);
                            }
                        },
                        attachPoint: generalSettings
                    });

                    if (useIntegrationTag) {
                        self.addIntegrationTagField(form, data.integrationTag, generalSettings);
                    }
                    else {
                        self.addIntegrationAgentField(form, data.artifactAgent, data.artifactAgentName, generalSettings);
                    }

                    ///////////////////////////////////////////////////////////////////////////////
                    // WinRS Agent Install Settings
                    ///////////////////////////////////////////////////////////////////////////////
                    var winRSAgentInstallContainer = domConstruct.create("div", {
                        className: "inline-block settings-section"
                    }, column2);
                    var winRSAgentInstall = domConstruct.create("div", {
                        className: "settings-section-inner win-rs-agent-install"
                    }, winRSAgentInstallContainer);

                    var winRSAgentInstallHeader = self.addField({
                        type: "SectionLabel",
                        value: i18n("WinRS Agent Install Settings"),
                        style: {
                            fontWeight: "bold",
                            marginTop: "15px"
                        },
                        attachPoint: winRSAgentInstall,
                        icon: "winrs-agent-install"
                    });

                    self.addWinRSAgentField(form, data.winRSAgent, winRSAgentInstall);


                    ///////////////////////////////////////////////////////////////////////////////
                    // Mail Server Settings
                    ///////////////////////////////////////////////////////////////////////////////
                    var mailServerSettingsContainer = domConstruct.create("div", {
                        className: "inline-block settings-section"
                    }, column2);
                    var mailServerSettings = domConstruct.create("div", {
                        className: "settings-section-inner mail-server-settings"
                    }, mailServerSettingsContainer);

                    var mailServerSettingsHeader = self.addField({
                        type: "SectionLabel",
                        value: i18n("Mail Server Settings"),
                        style: {
                            fontWeight: "bold",
                            marginTop: "15px"
                        },
                        attachPoint: mailServerSettings,
                        icon: "mail-server"
                    });

                    self.addField({
                        name: "deployMailHost",
                        label: i18n("Mail Server Host"),
                        description: i18n("Hostname of the mail server for notifications. Leave this blank to disable notifications."),
                        value: data.deployMailHost,
                        required: false,
                        type: "Text",
                        textDir: "ltr",
                        bidiDynamicSTT: "URL",
                        attachPoint: mailServerSettings
                    });

                    self.addField({
                        name: "deployMailPort",
                        label: i18n("Mail Server Port"),
                        description: i18n("SMTP port for email notifications."),
                        value: data.deployMailPort,
                        required: false,
                        type: "Text",
                        textDir: "ltr",
                        attachPoint: mailServerSettings
                    });

                    self.addField({
                        name: "deployMailSecure",
                        label: i18n("Secure Mail Server Connection"),
                        description: i18n("Whether the SMTP connection should be secured or not."),
                        value: data.deployMailSecure,
                        required: false,
                        type: "Switch",
                        attachPoint: mailServerSettings
                    });

                    self.addField({
                        name: "deployMailSender",
                        label: i18n("Mail Server Sender Address"),
                        description: i18n("Address to use for the \"from\" address for email notifications."),
                        value: data.deployMailSender,
                        required: false,
                        type: "Text",
                        textDir: "ltr",
                        bidiDynamicSTT: "URL",
                        attachPoint: mailServerSettings
                    });

                    self.addField({
                        name: "deployMailUsername",
                        label: i18n("Mail Server Username"),
                        description: i18n("Username to use for sending email notifications."),
                        value: data.deployMailUsername,
                        required: false,
                        type: "Text",
                        textDir: "ltr",
                        attachPoint: mailServerSettings
                    });

                    self.addField({
                        name: "deployMailPassword",
                        label: i18n("Mail Server Password"),
                        description: i18n("Password to use for sending email notifications."),
                        value: data.deployMailPassword,
                        required: false,
                        type: "Secure",
                        attachPoint: mailServerSettings
                    });


                    ///////////////////////////////////////////////////////////////////////////////
                    // Artifact Cleanup Settings
                    ///////////////////////////////////////////////////////////////////////////////
                    var artifactCleanupSettingsContainer = domConstruct.create("div", {
                        className: "inline-block settings-section"
                    }, column1);
                    var artifactCleanupSettings = domConstruct.create("div", {
                        className: "settings-section-inner artifact-cleanup-settings"
                    }, artifactCleanupSettingsContainer);

                    var artifactCleanupSettingsHeader = self.addField({
                        type: "SectionLabel",
                        value: i18n("Component Version Cleanup"),
                        style: {
                            fontWeight: "bold",
                            marginTop: "15px"
                        },
                        attachPoint: artifactCleanupSettings,
                        icon: "artifact-cleanup"
                    });

                    self.addField({
                        name: "cleanupHourOfDay",
                        label: i18n("Daily Cleanup Start Time"),
                        description: i18n("The hour to start the component version cleanup.  " +
                            " This value must be an integer between 0 (midnight) and 23 (11 PM)."),
                        value: data.cleanupHourOfDay,
                        required: true,
                        type: "Text",
                        textDir: "ltr",
                        attachPoint: artifactCleanupSettings
                    });

                    self.addField({
                        name: "cleanupDaysToKeep",
                        label: i18n("Default Component Version Retention (days)"),
                        description: i18n("The number of days to retain component versions. " +
                            "To retain component versions indefinitely, enter -1."),
                        value: data.cleanupDaysToKeep,
                        required: true,
                        type: "Text",
                        textDir: "ltr",
                        attachPoint: artifactCleanupSettings
                    });

                    self.addField({
                        name: "cleanupCountToKeep",
                        label: i18n("Default Number of Versions to Retain"),
                        description: i18n("The number of versions to retain for each component. " +
                            " To retain all versions of a component, enter -1."),
                        value: data.cleanupCountToKeep,
                        required: true,
                        type: "Text",
                        textDir: "ltr",
                        attachPoint: artifactCleanupSettings
                    });

                    self.addField({
                        name: "cleanupArchivePath",
                        label: i18n("Archive Path"),
                        description: i18n("Path to write a zip containing the artifacts of each version cleaned up. If this is blank, archives will not be written."),
                        value: data.cleanupArchivePath,
                        required: false,
                        type: "Text",
                        bidiDynamicSTT: "FILE_PATH",
                        attachPoint: artifactCleanupSettings
                    });

                    // Add button to preview version cleanup.
                    var cleanupPreviewButton = new Button({
                        label: i18n("Preview Version Cleanup"),
                        showTitle: false,
                        onClick: function() {
                            var hour = data.cleanupHourOfDay;
                            self.showCleanupPreview(hour);
                        }
                    });
                    self.addField({
                        name: "_cleanupPreview",
                        label: "",
                        widget: cleanupPreviewButton,
                        attachPoint: artifactCleanupSettings
                    });

                    ///////////////////////////////////////////////////////////////////////////////
                    // Process History Cleanup Settings
                    ///////////////////////////////////////////////////////////////////////////////

                    var processHistoryCleanupSettingsContainer = domConstruct.create("div", {
                        className: "inline-block settings-section"
                    }, column1);
                    var processHistoryCleanupSettings = domConstruct.create("div", {
                        className: "settings-section-inner artifact-cleanup-settings"
                    }, processHistoryCleanupSettingsContainer);

                    var processHistoryCleanupSettingsHeader = self.addField({
                        type: "SectionLabel",
                        value: i18n("Deployment History Cleanup"),
                        style: {
                            fontWeight: "bold",
                            marginTop: "15px"
                        },
                        attachPoint: processHistoryCleanupSettings,
                        icon: "artifact-cleanup" //TODO
                    });

                    var processHistoryCleanupSettingsHeaderRow =
                            processHistoryCleanupSettingsHeader.widget.fieldRow;
                    domStyle.set(processHistoryCleanupSettingsHeaderRow, 'position', 'relative');
                    var headerValueColumn = query(
                        '.labelsAndValues-valueCell',
                        processHistoryCleanupSettingsHeaderRow);
                    //this is to accomodate the new cleanup progress bar
                    headerValueColumn.style('float', 'left');
                    headerValueColumn.style('width', '40%');
                    var progressBarContainer = domConstruct.create("div",
                        {className: "progressBarContainer"},
                        processHistoryCleanupSettingsHeaderRow,
                        "last");
                    domStyle.set(progressBarContainer, 'overflow', 'hidden');
                    self.addProgressBar(progressBarContainer);

                    var historyCleanupEnabledSwitch = self.addField({
                        name: "historyCleanupEnabled",
                        label: i18n("Enable Deployment History Cleanup"),
                        description: i18n("Turn on this setting to enable deployment history cleanup. " +
                            "If enabled, deployment history records are deleted according to the values " +
                            "that you set."),
                        value: data.historyCleanupEnabled,
                        type: "Switch",
                        attachPoint: processHistoryCleanupSettings
                    });

                    var historyCleanupTimeOfDayField = self.addField({
                        name: "historyCleanupTimeOfDay",
                        label: i18n("Daily Cleanup Start Time"),
                        description: i18n("The hour to start the daily deployment history cleanup."),
                        value: new Date(data.historyCleanupTimeOfDay),
                        required: true,
                        type: "Time",
                        attachPoint: processHistoryCleanupSettings
                    });
                    domClass.add(historyCleanupTimeOfDayField.widget.fieldRow, "historyCleanupTimePicker");

                    var historyCleanupDurationField = self.addField({
                        name: "historyCleanupDuration",
                        label: i18n("Daily Cleanup Duration (hours)"),
                        description: i18n("The maximum number of hours per day that the cleanup process runs."),
                        value: data.historyCleanupDuration,
                        required: true,
                        type: "Text",
                        textDir: "ltr",
                        attachPoint: processHistoryCleanupSettings
                    });

                    var historyCleanupDaysToKeepField = self.addField({
                        name: "historyCleanupDaysToKeep",
                        label: i18n("Days to Retain Deployment History"),
                        description: i18n("The default number of days to retain application deployment " +
                            "history on environments,  if the number of days is not specified directly " +
                            "in the environment settings. Valid range is 0 or greater."),
                        value: data.historyCleanupDaysToKeep,
                        required: true,
                        type: "Text",
                        textDir: "ltr",
                        attachPoint: processHistoryCleanupSettings
                    });

                    var updateProcessHistoryCleanupFields = function(historyCleanupSwitchIsOn) {
                        historyCleanupTimeOfDayField.widget.set('disabled', !historyCleanupSwitchIsOn);
                        historyCleanupDurationField.widget.set('disabled', !historyCleanupSwitchIsOn);
                        historyCleanupDaysToKeepField.widget.set('disabled', !historyCleanupSwitchIsOn);
                    };

                    historyCleanupEnabledSwitch.widget.onChange = updateProcessHistoryCleanupFields;

                    if (data.historyCleanupEnabled) {
                        updateProcessHistoryCleanupFields(true);
                    }
                    else {
                        updateProcessHistoryCleanupFields(false);
                    }

                    ///////////////////////////////////////////////////////////////////////////////
                    // Security Settings
                    ///////////////////////////////////////////////////////////////////////////////
                    //historyCleanupVisible installation config is removed so always use column2
                    var securityColumn = column2;

                    var securitySettingsContainer = domConstruct.create("div", {
                        className: "inline-block settings-section"
                    }, securityColumn);
                    var securitySettings = domConstruct.create("div", {
                        className: "settings-section-inner security-settings"
                    }, securitySettingsContainer);
                    self.securitySettings = securitySettings;

                    var securitySettingsHeader = self.addField({
                        type: "SectionLabel",
                        value: i18n("Security"),
                        style: {
                            fontWeight: "bold",
                            marginTop: "15px"
                        },
                        attachPoint: securitySettings,
                        icon: "security-general-settings"
                    });

                    self.addField({
                        name: "minimumPasswordLength",
                        label: i18n("Minimum Password Length"),
                        description: i18n("The minimum length of passwords allowed to be created."),
                        value: data.minimumPasswordLength,
                        required: true,
                        type: "Text",
                        textDir: "ltr",
                        attachPoint: securitySettings
                    });

                    self.addField({
                        name: "requireComplexPasswords",
                        label: i18n("Require Complex Passwords"),
                        description: i18n("This will make new passwords created through the ui or CLI to be validated that the password is complex. To pass validation, it must use 2 of the 4 character classes: upper, lower,digits, and special. It must still be as long or longer than the password minimum length."),
                        value: data.requireComplexPasswords,
                        type: "Switch",
                        attachPoint: securitySettings
                    });


                    ///////////////////////////////////////////////////////////////////////////////
                    // Legacy Configuration Options
                    ///////////////////////////////////////////////////////////////////////////////
                    var legacyConfigurationOptionsContainer = domConstruct.create("div", {
                        className: "inline-block settings-section"
                    }, column2);
                    var legacyConfigurationOptions = domConstruct.create("div", {
                        className: "settings-section-inner legacy-configuration-options"
                    }, legacyConfigurationOptionsContainer);

                    var legacyConfigurationOptionsHeader = self.addField({
                        type: "SectionLabel",
                        value: i18n("Legacy Configuration Options"),
                        style: {
                            fontWeight: "bold",
                            marginTop: "15px"
                        },
                        attachPoint: legacyConfigurationOptions,
                        icon: "legacy-configuration"
                    });

                    self.addField({
                        name: "enableInactiveLinks",
                        label: i18n("Enable \"Show Inactive\" Links"),
                        description: i18n("If checked, links under lists of objects which formerly supported inactivation will show to allow users to display inactive objects."),
                        value: data.enableInactiveLinks,
                        type: "Switch",
                        attachPoint: legacyConfigurationOptions
                    });

                    self.addField({
                        name: "enablePromptOnUse",
                        label: i18n("Enable \"Prompt On Use\""),
                        description: i18n("If checked, the option to set \"Prompt On Use\" for properties in workflow steps will be displayed."),
                        value: data.enablePromptOnUse,
                        type: "Switch",
                        attachPoint: legacyConfigurationOptions
                    });

                    self.addField({
                        name: "enableAllowFailure",
                        label: i18n("Enable \"Allow Failure\""),
                        description: i18n("If checked, the option to set \"Allow Failure\" on steps in a workflow will be displayed."),
                        value: data.enableAllowFailure,
                        type: "Switch",
                        attachPoint: legacyConfigurationOptions
                    });

                    self.addField({
                        name: "failProcessesWithUnresolvedProperties",
                        label: i18n("Fail Processes With Unresolved Properties"),
                        description: i18n("If this is enabled, any running process which comes across a property it cannot resolve will automatically fail."),
                        value: data.failProcessesWithUnresolvedProperties,
                        type: "Switch",
                        attachPoint: legacyConfigurationOptions
                    });


                    ///////////////////////////////////////////////////////////////////////////////
                    // Licensing
                    ///////////////////////////////////////////////////////////////////////////////
                    var licensingSettingsContainer = domConstruct.create("div", {
                        className: "inline-block settings-section"
                    }, column2);
                    var licensingSettings = domConstruct.create("div", {
                        className: "settings-section-inner licensing-settings"
                    }, licensingSettingsContainer);

                    var licensingSettingsHeader = self.addField({
                        type: "SectionLabel",
                        value: i18n("Licensing"),
                        style: {
                            fontWeight: "bold",
                            marginTop: "15px"
                        },
                        attachPoint: licensingSettings,
                        icon: "licensing"
                    });

                    self.addField({
                        name: "agentAutoLicense",
                        label: i18n("Automatic Agent Licensing"),
                        description: i18n("When this box is checked, the server will attempt to license any " +
                            "Agents coming online with Authorized licenses."),
                        value: data.agentAutoLicense,
                        type: "Switch",
                        readOnly: data.serverLicenseType !== "Server Agent",
                        attachPoint: licensingSettings
                    });

                    self.addField({
                        name: "serverLicenseType",
                        label: i18n("Server License Type"),
                        description: i18n("This is automatically determined based on information obtained by " +
                            "the RCL server. Session: Agents will consume floating licenses when used in deployments. " +
                            "Agent Server: Agents will be licensed as soon as they connect the the server and will hold " +
                            "their licenses until they are deleted. Agents can be assigned a permanent license on the " +
                            "Agents tab. Managed Capacity: PVU-based licensing. No License: The license type could not " +
                            "be determined, check your connection to the RCL server."),
                        value: data.serverLicenseType,
                        type: "Text",
                        readOnly: true,
                        textDir: "ltr",
                        attachPoint: licensingSettings
                    });

                    if (bootstrap.serverLicenseType === "SERVER_PATTERNS") {
                        self.addField({
                            name: "serverLicenseBackupType",
                            label: i18n("Server License Backup Type"),
                            description: i18n("The license to use for agents that are not provisioned by Patterns."),
                            value: data.serverLicenseBackupType,
                            type: "Text",
                            textDir: "ltr",
                            readOnly: true,
                            attachPoint: licensingSettings
                        });
                    }

                    self.addField({
                        name: "rclServerUrl",
                        label: i18n("RCL Server Path"),
                        description: i18n("Path to Rational Licensing Server. A list of paths must be separated by " +
                                "colons on *nix systems and semicolons on Windows systems. Note: A server restart " +
                                "will be required when changing between RCL servers. Format: port@hostname"),
                        value: data.rclServerUrl,
                        type: "Text",
                        bidiDynamicSTT: "EMAIL",
                        attachPoint: licensingSettings
                    });

                    form.placeAt(self.formAttach);

                    // Add button to download the license log
                    var btnLicenseLog = new Button({
                        label: i18n("Download License Log"),
                        showTitle: false,
                        onClick: function() {
                            util.downloadFile(bootstrap.restUrl+"license/log");
                        }
                    });
                    self.addField({
                        name: "downloadLicenseButton",
                        label: "",
                        widget: btnLicenseLog,
                        attachPoint: licensingSettings
                    });
                }
            });
        },

        showCleanupPreview: function(hour) {
            var self = this;

            var cleanupPreviewContainer = domConstruct.create("div", {
                "style": {
                    "overflowY": "auto",
                    "maxHeight": "200px",
                    "maxWidth": "350px",
                    "paddingRight": "30px"
                }
            });

            var date = new Date();
            var tomorrowDate = new Date(
                    date.getFullYear(), date.getMonth(), date.getDate()+1, hour, 0, 0, 0);

            domConstruct.create("div", {
                "innerHTML": i18n("The following versions will be archived next time cleanup "+
                        "is run at %s local server time, according to the "+
                        "configuration of the system, each component, and each "+
                        "environment.<br><br>If you have changed the settings on this "+
                        "page, you'll need to save before those changes are reflected on "+
                        "this list.", util.timeOnlyFormat(tomorrowDate.getTime())),
                "style": {
                    "marginBottom": "10px"
                }
            }, cleanupPreviewContainer);

            var cleanupPreviewAlert = new Alert({
                title: i18n("Version Cleanup Preview"),
                messageDom: cleanupPreviewContainer
            });

            domConstruct.create("span", {
                innerHTML: i18n("Component to Preview:"),
                className: "inlineBlock",
                style: {
                    marginRight: "8px",
                    fontWeight: "bold"
                }
            }, cleanupPreviewContainer);

            var componentSelect = new FormDelegates().getDelegate("FilteringSelect")({
                url: bootstrap.restUrl+"deploy/component"
            });
            componentSelect.placeAt(cleanupPreviewContainer);

            var previewResultsContainer = domConstruct.create("div", {
                "style": {
                    "margin-top": "10px",
                    "margin-bottom": "8px"
                }
            }, cleanupPreviewContainer);

            on(componentSelect, "change", function(componentId) {
                domConstruct.empty(previewResultsContainer);

                if (componentId) {
                    domConstruct.create("div", {
                        "innerHTML": i18n("Loading...")
                    }, previewResultsContainer);

                    xhr.get({
                        url: bootstrap.restUrl+"cleanup/archivableVersions/"+componentId,
                        handleAs: "json",
                        load: function(data) {
                            domConstruct.empty(previewResultsContainer);

                            if (data.length === 0) {
                                domConstruct.create("div", {
                                    "innerHTML": i18n("No versions found to archive."),
                                    "style": {
                                        "fontWeight": "bold"
                                    }
                                }, previewResultsContainer);
                            }
                            else {
                                var componentLabel = domConstruct.create("div", {
                                    "innerHTML": i18n("Versions to archive:"),
                                    "style": {
                                        "fontWeight": "bold"
                                    }
                                }, previewResultsContainer);

                                array.forEach(data, function(version) {
                                    domConstruct.create("div", {
                                        "innerHTML": i18n("%s (Created %s)", version.name.escape(), util.dateFormatShort(version.created)),
                                        "style": {
                                            "paddingLeft": "60px"
                                        }
                                    }, previewResultsContainer);
                                });
                            }
                        },
                        error: function(response) {
                            var cleanupErrorAlert = new Alert({
                                messages: [i18n("Error getting cleanup preview:"),
                                           "",
                                           util.escape(response.responseText)]
                            });
                        }
                    });
                }
            });
        },

        /**
         *
         */
        addIntegrationAgentField: function(form, agentId, agentName, attachPoint) {
            var integration = this.addField({
                name: "artifactAgent",
                label: i18n("Agent for Version Imports"),
                description: i18n("The name of the agent to run source configuration steps on."),
                type: "TableFilterSelect",
                url: bootstrap.restUrl+"agent",
                placeHolder: agentName,
                defaultQuery: {
                    filterFields: "requiredActions",
                    filterType_requiredActions: "eq",
                    filterValue_requiredActions: security.agent.manageVersionImports
                },
                value: agentId,
                attachPoint: attachPoint
            });
            this.integrationAgentField = integration.widget.fieldRow;
        },
        /**
         *
         */
        addWinRSAgentField: function(form, agentName, attachPoint) {
            this.addField({
                name: "winRSAgent",
                label: i18n("WinRS Agent"),
                description: i18n("The name of the agent to use for running agent installation processes on Windows machines. This agent must be installed on a Windows machine."),
                type: "TableFilterSelect",
                url: bootstrap.restUrl+"agent",
                defaultQuery: {
                    filterFields: "requiredActions",
                    filterType_requiredActions: "eq",
                    filterValue_requiredActions: security.general.editBasicSettings
                },
                value: agentName,
                allowNone: true,
                attachPoint: attachPoint
            });
        },

        /**
         *
         */
        addIntegrationTagField: function(form, tagName, attachPoint) {
            var tags = [];
            xhr.get({
                url: bootstrap.restUrl+"tag/type/Agent",
                sync: true,
                handleAs: "json",
                load: function(results) {
                    tags = results;
                }
            });
            var mStore = new Memory( { "data": tags, "idProperty": "name" } );

            var tagSelect = new WebextSelect({
                store: mStore,
                searchAttr: "name",
                value: tagName,
                noDataMessage: i18n("No tags found."),
                autoComplete: false,
                selectOnClick: true,
                pageSize: "10"
            });

            var integration = this.addField({
                name: "integrationTag",
                label: i18n("Agent Tag for version imports"),
                widget: tagSelect,
                description: i18n("The tag to use for Version Imports on this component"),
                attachPoint: attachPoint
            });
            this.integrationTagField = integration.widget.fieldRow;
        },

        /**
         *
         */
        removeIntegrationAgentField: function() {
            domConstruct.destroy(this.integrationAgentField);
        },

        /**
         *
         */
        removeIntegrationTagField: function() {
            domConstruct.destroy(this.integrationTagField);
        },

        addProgressBar: function(attachPoint) {
            var self = this;
            this._cleanupProgressBar = new CleanupProgressBar({
                show: function() {
                    fx.animateProperty({
                        node: self._cleanupProgressBar.progressBar,
                        properties: { right: {end: 0, units: '%' } },
                        duration: 800
                    }).play();
                },
                hide: function() {
                    fx.animateProperty({
                        node: self._cleanupProgressBar.progressBar,
                        properties: { right: {end: -100, units: '%' } },
                        duration: 800
                    }).play();
                }
            });
            this._cleanupProgressBar.disableProgressDetailsTimeInfo(true);
            this._cleanupProgressBar.setLabel(i18n("Cleanup in Progress") + " - ");
            this._cleanupProgressBar.placeAt(attachPoint);
            this._cleanupProgressBar.showProgress();
        }
    });
});
