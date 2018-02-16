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
        "dojo/_base/declare",
        "dojo/_base/xhr",
        "dojo/json",
        "deploy/widgets/applicationProcessRequest/RequestConfigurationChanges"
        ],
function(
        declare,
        xhr,
        JSON,
        RequestConfigurationChanges
) {
    /**
     *
     */
    return declare([RequestConfigurationChanges], {

        /**
         *
         */
        makeRequest: function() {
            var self = this;
            
            var requestData = {
                applicationProcessId: this.applicationProcess.id,
                environmentId: this.environment.id,
                snapshotId: this.snapshot.id
            };
            
            xhr.put({
                url: bootstrap.restUrl+"deploy/application/"+this.snapshot.application.id+"/previewProcessPropertyChanges",
                handleAs: "json",
                putData: JSON.stringify(requestData),
                load: function(data) {
                    self.makeTable(data);
                }
            });
        }
    });
});
