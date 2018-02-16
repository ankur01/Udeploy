/*
* Licensed Materials - Property of IBM Corp.
* IBM UrbanCode Deploy
* (c) Copyright IBM Corporation 2011, 2014. All Rights Reserved.
*
* U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
* GSA ADP Schedule Contract with IBM Corp.
*/
/*global define, require */
define(["dojo/_base/declare",
        "deploy/widgets/rightPanel/RightPanelAgents"
        ],
        function(
            declare,
            RightPanel
        ){
    /**
     * Right Panel Agents With No Resource
     *
     * Widget for displaying a hovering side panel on the right side of the window with a drag and
     * drop table containing agents with no resource.
     *
     * Use: new RightPanelAgentsWithNoResource(options);
     *
     * options: {
     *  parent: reference to the parent (this) using this widget.
     * }
     */
    return declare('deploy.widgets.resource.RightPanelAgentsWithNoResource',  [RightPanel], {
        header: i18n("Agents With No Resource"),
        subheader: i18n("Drag and drop agents into resources"),
        url: bootstrap.restUrl + "agent/noResource"
    });
});
