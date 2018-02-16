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
        "dojo/dom-class",
        "dojo/dom-construct",
        "dojo/on",
        "js/webext/widgets/Dialog",
        "deploy/widgets/component/ComponentFileTable"
        ],
function(
        _TemplatedMixin,
        _Widget,
        Array,
        declare,
        xhr,
        domClass,
        domConstruct,
        on,
        Dialog,
        ComponentFileTable
) {
    /**
     *
     */
    return declare([_Widget, _TemplatedMixin], {
        templateString: 
            '<div class="snapshotFiles">'+
                '<div data-dojo-attach-point="tableAttach"></div>'+
            '</div>',

        /**
         *
         */
        postCreate: function() {
            this.inherited(arguments);
            var self = this;
            this.componentFileTables = [];
            xhr.get({
                url: bootstrap.restUrl+"deploy/snapshot/"+self.snapshot1.id+"/compareFiles/"+self.snapshot2.id,
                handleAs: "json",
                load: function(data) {
                    Array.forEach(data, function (item) {
                        if (item.tooMany) {
                            domConstruct.place('<div class="containerLabel">File Difference Report for '+item.component+'</div><div class="innerContainer" style="width: 1000px;"><div><br>' + item.tooMany + '<br></div></div>', self.tableAttach);
                        }
                        else {
                            var fileCompare = new ComponentFileTable({
                                component: item.component,
                                version: item.version1,
                                otherVersion: item.version2,
                                title1: "Snapshot: "+self.snapshot1.name + " ",
                                title2: "Snapshot: "+self.snapshot2.name + " "
                            });
                            self.componentFileTables.push(fileCompare);
                            fileCompare.placeAt(self.tableAttach);
                        }
                    });
                }
            });
        },

        /**
         *
         */
        destroy: function () {
             dojo.empty(this.tableAttach);
        }
    });
});
