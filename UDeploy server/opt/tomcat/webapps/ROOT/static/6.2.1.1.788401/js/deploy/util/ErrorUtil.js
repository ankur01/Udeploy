/*
* Licensed Materials - Property of IBM Corp.
* IBM UrbanCode Deploy
* (c) Copyright IBM Corporation 2016. All Rights Reserved.
*
* U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
* GSA ADP Schedule Contract with IBM Corp.
*/
define([
        "js/webext/widgets/Dialog"
        ],
  function(
        Dialog
  ) {

    return {
      showErrorDialog : function(dialogTitle, errorMessage) {
          var errorDialog = new Dialog({
                               title: dialogTitle,
                               content: errorMessage,
                               closable: true,
                               draggable: true
                          });
          errorDialog.show();
      }
    };

});
