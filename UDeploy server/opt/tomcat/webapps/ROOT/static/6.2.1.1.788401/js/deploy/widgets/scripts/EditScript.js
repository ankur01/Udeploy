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
        "dojo/has",
        "dojo/_base/sniff",
        "dojo/dom-construct",
        "deploy/widgets/scripts/Editor",
        "js/webext/widgets/ColumnForm"
        ],
function(
        _TemplatedMixin,
        _Widget,
        declare,
        has,
        sniff,
        domConstruct,
        Editor,
        ColumnForm
) {
    return declare('deploy.widgets.scripts.EditScript',  [_Widget, _TemplatedMixin], {
        templateString:
            '<div class="editScript">'+
            '  <div data-dojo-attach-point="formAttach"></div>'+
            '</div>',

        _sampleScript:
            'var exit = properties.get(\'exitCode\');\n\n' +
            'scanner.register("regex", function(lineNumber, line) {\n' +
            '     var thing = \'do stuff\';\n' +
            '});\n\n' +
            'if (exit == 0) {\n' +
            '    properties.put(\'Status\', \'Success\');\n' +
            '}\n' +
            'else {\n' +
            '     properties.put(\'Status\', \'Failure\');\n' +
            '}\n',

        /**
         * 
         */
        postCreate: function() {
            this.inherited(arguments);
            var self = this;
            
            if (this.script) {
                this.existingValues = this.script;
            }
            else if (this.source) {
                this.existingValues = this.source;
                
                this.existingValues.name = undefined;
                this.existingValues.id = undefined;
            }
            
            this.form = new ColumnForm({
                submitUrl: bootstrap.restUrl+"script/postprocessing",
                postSubmit: function(data) {
                    if (self.callback !== undefined) {
                        self.callback(data);
                    }
                },
                addData: function(data) {
                    if (self.script && self.script.id) {
                        data.id = self.script.id;
                    }
                },
                onCancel: function() {
                    if (self.callback !== undefined) {
                        self.callback();
                    }
                }
            });
            
            var name = "";
            var description = "";
            var body = "";
            
            if (this.existingValues) {
                name = this.existingValues.name;
                description = this.existingValues.description;
                body = this.existingValues.body;
            }
            
            this.form.addField({
                name: "name",
                label: i18n("Name"),
                required: true,
                type: "Text",
                value: name
            });
            
            this.form.addField({
                name: "description",
                label: i18n("Description"),
                type: "Text",
                value: description
            });

            var type = "CodeEditor";
            if (has('ie') < 9) {
                // if IE < 9 we need to fallback to textarea
                type = "Text Area";
            }

            this.form.addField({
                name: "body",
                label: i18n("Script Body"),
                required: true,
                description: i18n("Specify the post processing script to be run here(JavaScript).<br/> You will have" +
                    " access to the output properties from the step in a java.util.Properties " +
                    "variable name <b>properties</b>. <br>The properties will have a special property for" +
                    " the exit code of the process called <b>exitCode</b>.<br/>It will also have a special" +
                    " property for the final status called <b>Status</b>. A status of <b>Success</b> is the" +
                    " only status that wont result in the step failing. <br/>There will also" +
                    " be a variable called <b>scanner</b> " +
                    "which can be used to scan the output log of the step. It has these public " +
                    "methods:  <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;register(String regex, function call) -> this will register a new" +
                    " function to be called whenever the regex is matched. <br/>" +
                    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;addLOI(Integer lineNumber) -> this will add a specific line to the lines " +
                    " of interest list. These will be highlighted in the LogViewer after the " +
                    " process has finished. This is implicitly called anytime the scanner " +
                    " matches a line. <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;getLinesOfInterest() -> this will return a " +
                    "java.util.List<Integer> that is the list of lines of interest. This can be" +
                    " used for removing lines when necessary.<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;scan() -> this tells the scanner" +
                    " to go ahead and scan the log. Should be invoked after all regexs are registered."),
                type: type,
                value: body || this._sampleScript,
                textDir: "ltr",
                language: "javascript"
            });

            this.form.placeAt(this.formAttach);
        },

        startup: function() {
            this.inherited(arguments);
            // We need to manually call the startup() function of the code editor
            dojo.forEach(this.form.fieldsArray, function(field) {
                if (field.type === 'CodeEditor') {
                    field.widget.startup();
                }
            });
        }
    });
});