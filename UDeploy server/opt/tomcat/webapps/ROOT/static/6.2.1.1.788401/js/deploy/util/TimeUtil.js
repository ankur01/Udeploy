/*
* Licensed Materials - Property of IBM Corp.
* IBM UrbanCode Deploy
* (c) Copyright IBM Corporation 2016. All Rights Reserved.
*
* U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
* GSA ADP Schedule Contract with IBM Corp.
*/
define([],
  function() {

    return {
        formatToHrsAndMinsString : function(timeInMS) {
            var hoursLeft = Math.floor(timeInMS / (1000*60*60));
            var hoursLeftCaption = "";
            if (hoursLeft > 1) {
                hoursLeftCaption = hoursLeft + " " + i18n("hours") + " ";
            }
            else if (hoursLeft === 1) {
                hoursLeftCaption = hoursLeft  + " " + i18n("hour") + " ";
            }
            var minutesPart = timeInMS - hoursLeft*(1000*60*60);
            var minutesLeft = Math.floor(minutesPart / (1000*60));
            var minutesLeftCaption = "";
            if (minutesLeft > 1) {
                minutesLeftCaption = minutesLeft + " " + i18n("minutes");
            }
            else if (minutesLeft === 1) {
                minutesLeftCaption = minutesLeft + " " + i18n("minute");
            }
            return hoursLeftCaption + minutesLeftCaption;
        }
    };

});
