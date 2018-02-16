/*
* Licensed Materials - Property of IBM Corp.
* IBM UrbanCode Deploy
* (c) Copyright IBM Corporation 2011, 2014. All Rights Reserved.
*
* U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
* GSA ADP Schedule Contract with IBM Corp.
*/
define ([
         "dojo/_base/declare",
         "deploy/widgets/property/PropSheetDiffReportTable"
         ],
function(
         declare,
         PropSheetDiffReportTable
         ) {
    return declare([PropSheetDiffReportTable], {
        leftColumnName: i18n("Local"),
        rightColumnName: i18n("Discovered")
    });
});