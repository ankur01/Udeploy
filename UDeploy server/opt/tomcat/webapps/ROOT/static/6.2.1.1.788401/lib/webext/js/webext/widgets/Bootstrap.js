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
/*global define */
define([
        "dojo/_base/declare",
        "dojo/_base/lang"
        ],
function(
        declare,
        lang
) {

    return declare([], {

        /**
         * Set all properties passed in from the constructor by the .jsp.
         */
        constructor: function(properties) {
            if (properties) {
                lang.mixin(this, properties);
                if (properties.baseUrl) {
                    var contentPath = "";
                    if (properties.contentIdentifier) {
                        contentPath = "static/"+properties.contentIdentifier+"/";
                    }
                    this.baseUrl = properties.baseUrl;
                    this.contentUrl = properties.baseUrl+contentPath;
                    this.imageUrl = this.baseUrl+contentPath+"images/";
                    this.jsUrl = this.baseUrl+contentPath+"js/";
                    this.restUrl = this.baseUrl+"rest/";
                    this.rest2Url = this.baseUrl+"rest2/";
                    this.tasksUrl = this.baseUrl+"tasks/";
                }
            }
        }
    });
});
