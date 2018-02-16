/*
* Licensed Materials - Property of IBM Corp.
* IBM UrbanCode Deploy
* (c) Copyright IBM Corporation 2011, 2014. All Rights Reserved.
*
* U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
* GSA ADP Schedule Contract with IBM Corp.
*/
/*global mxCellState, mxConnector, mxUtils*/
(function() {

    var mxCellStateOriginal = mxCellState.prototype.setCursor;
    mxCellState.prototype.setCursor = function(cursor) {
        if (!cursor) {
            cursor = '';
        }
        mxCellStateOriginal(cursor);
    };

    /*
     * Workaround for IE VML bug where opacity will be set to "100".
     * Valid range for opacity is [0,1] or a percentage [0,100].
     */
    var mxConnectorReconfigureOrig = mxConnector.prototype.reconfigure;
    mxConnector.prototype.reconfigure = function(){

        var origOpacity = this.opacity;
        var override = mxUtils.isVml(this.node) && (origOpacity === null || origOpacity === undefined);
        if (override) {
            // override to make funciton use "100%" instead of do its own (invalid) default of "100"
            this.opacity = '100';
        }
        try {
            mxConnectorReconfigureOrig.apply(this, arguments);
        }
        finally {
            if (override) {
                this.opacity = origOpacity;
            }
        }
    };

}());
