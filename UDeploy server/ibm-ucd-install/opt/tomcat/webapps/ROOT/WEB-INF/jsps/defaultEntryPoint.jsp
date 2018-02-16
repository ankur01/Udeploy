<%--
- Licensed Materials - Property of IBM Corp.
- IBM UrbanCode Deploy
- (c) Copyright IBM Corporation 2011, 2014. All Rights Reserved.
-
- U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
- GSA ADP Schedule Contract with IBM Corp.
--%>
<%@page import="com.urbancode.commons.util.crypto.FIPSHelper"%>
<%@page import="com.urbancode.ds.subsys.system.SystemConfiguration"%>
<%@page contentType="text/html;charset=UTF-8" %>
<%@page pageEncoding="UTF-8" %>
<%@page import="com.urbancode.commons.web.WebConfig"%>
<%@page import="com.urbancode.commons.webext.util.InstalledVersion"%>
<%@page import="com.urbancode.ds.ServerConstants"%>
<%@page import="com.urbancode.security.SecurityUser"%>
<%@page import="com.urbancode.ds.web.filter.AuthenticationFilter"%>
<%@page import="com.urbancode.ds.security.SecuritySchemaHelper"%>
<%@page import="com.urbancode.ds.subsys.deploy.config.Application"%>
<%@page import="com.urbancode.ds.subsys.deploy.config.Component"%>
<%@page import="com.urbancode.ds.subsys.deploy.config.environment.Environment"%>
<%@page import="com.urbancode.ds.subsys.resource.domain.Resource"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@taglib prefix="ah3" uri="http://www.urbancode.com/anthill3/tags" %>
<%@page import="com.urbancode.air.i18n.TranslateUtil"%>
<%@page import="com.urbancode.ds.pattern.DateUtil"%>

<%
  String versionStr = "";
  try {
      InstalledVersion version = InstalledVersion.getInstance();
      versionStr = version.getVersion();
  }
  catch (Throwable t) {
  }
  pageContext.setAttribute("versionStr", versionStr);

  SecurityUser user = (SecurityUser) session.getAttribute(AuthenticationFilter.USER_SESSION_ATTRIB);
  if (user == null) {
     // redirect to login
     String redirectURL = WebConfig.getInstance().getLoginFormTaskMethod();
     response.sendRedirect(redirectURL);
  }
  else {
    String btd = SystemConfiguration.getInstance().getBaseTextDir();
    if ("Contextual".equals(btd)) {
        btd = "auto";
    }
    else if ("LTR".equals(btd)) {
        btd = "ltr";
    }
    else if ("RTL".equals(btd)) {
        btd = "rtl";
    }
    else {
        btd = "";
    }
    pageContext.setAttribute("baseTextDir", btd);

    pageContext.setAttribute("calendar", SystemConfiguration.getInstance().getCalendar());

    pageContext.setAttribute("username", user.getName());

    String actualName = user.getActualName();
    if (actualName != null && actualName.length() > 0) {
        pageContext.setAttribute("userFullName", actualName);
    }
    else {
        pageContext.setAttribute("userFullName", user.getName());
    }

    pageContext.setAttribute("productName", ServerConstants.PRODUCT_NAME_NORMAL);
    pageContext.setAttribute("serverLicenseType", SystemConfiguration.getInstance().getServerLicenseType());
    pageContext.setAttribute("serverLicenseBackupType", SystemConfiguration.getInstance().getServerLicenseBackupType());

    pageContext.setAttribute("locale", TranslateUtil.getInstance().getCurrentLocale());

    String language = TranslateUtil.getInstance().getCurrentLocale().getLanguage();
    pageContext.setAttribute("language", language);
    boolean isCJK = "zh".equals(language) || "ko".equals(language) || "ja".equals(language);
    pageContext.setAttribute("isCJK", isCJK);
    boolean isRTL = "ar".equals(language) || "he".equals(language) || "iw".equals(language);

    pageContext.setAttribute("isRTL", isRTL);
    pageContext.setAttribute("datePattern", DateUtil.getInstance().getCurrentDatePattern());
    pageContext.setAttribute("timePattern", DateUtil.getInstance().getCurrentTimePattern());

    pageContext.setAttribute("isFIPSModeEnabled", FIPSHelper.isFipsRequested());
%>

<c:url var="baseUrl" value="/"/>
<c:url var="contentUrl" value="/static/${versionStr}/"/>
<c:url var="favIconUrl" value="/static/${versionStr}/images/uDeploy.ico"/>
<c:url var="navigationUrl" value="/rest/navigation"/>

<%-- CONTENT --%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <%-- Force use of the last version IE available --%>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <title>${productName}</title>
    <link rel="shortcut icon" href="${fn:escapeXml(favIconUrl)}"/>

    <c:import url="/WEB-INF/jsps/snippets/importResources.jsp" >
        <c:param name="isRTL" value="${isRTL}"/>
    </c:import>

    <script type="text/javascript">
    /* <![CDATA[ */

      // Global and utility variables.
      var appState = {};
      var bootstrap = null;
      var util = null;
      var navBar = null;
      var config = null;
      var formatters = null;
      var i18nData = {};

      require(["dojo/ready",
               "dojo/dom",
               "dojo/dom-style",
               "dojo/dom-class",
               "dojo/dom-construct",
               "dojo/json",
               "dojo/on",
               "dojo/mouse",
               "dojo/_base/array",
               "dojox/layout/ContentPane",
               "js/webext/widgets/Bootstrap",
               "js/webext/widgets/NavigationBar",
               "js/webext/widgets/TabManager",
               "js/webext/widgets/Util",
               "deploy/widgets/Formatters",
               "deploy/widgets/GetStartedPopup",
               "deploy/widgets/vc/VCUtil",
               "deploy/widgets/FormDelegateRegistry",
               "deploy/widgets/navigation/LoadingIndicator",
               "dojox/html/entities",
               "idx/app/Header",
               "idx/widget/Menu",
               "dijit/focus",
               "dijit/Menu",
               "dijit/MenuItem",
               "dijit/PopupMenuItem",
               "dijit/DropDownMenu",
               "dijit/Dialog"],
              function (
                      ready,
                      dom,
                      domStyle,
                      domClass,
                      domConstruct,
                      JSON,
                      on,
                      mouse,
                      array,
                      ContentPane,
                      Bootstrap,
                      NavigationBar,
                      TabManager,
                      Util,
                      Formatters,
                      GetStartedPopup,
                      VCUtil,
                      FormDelegateRegistry,
                      LoadingIndicator,
                      entities,
                      Header,
                      idxMenu,
                      focusUtil,
                      Menu,
                      MenuItem,
                      PopupMenuItem,
                      DropDownMenu,
                      Dialog) {
        ready(function () {
            var __id__ = "topPageHeader";
            var userMenu = new Menu();
            var helpMenu = new idxMenu();

            util = new Util();
            util.vc = new VCUtil();

            var userIcon = '<div class="userIcon inlineBlock"></div>';
            var header = new Header({
                primaryTitle: ${ah3:toJson(productName)},
                user: {
                    messageName: userIcon + util.escape(${ah3:toJson(userFullName)}),
                    displayName: util.escape(${ah3:toJson(userFullName)}),
                    actions: userMenu
                },
                help: helpMenu,
                secondaryBannerType: "lightGray",
                contentTabsInline: true
            }, __id__);

            formatters = Formatters;

            bootstrap = new Bootstrap({
                initialState: {},
                username: ${ah3:toJson(username)},
                baseUrl: ${ah3:toJson(baseUrl)},
                contentUrl: ${ah3:toJson(contentUrl)},
                webextUrl: ${ah3:toJson(contentUrl)} + "lib/webext/",
                contentIdentifier: ${ah3:toJson(versionStr)},
                configUrl: ${ah3:toJson(navigationUrl)},
                restApiUrl: ${ah3:toJson(contentUrl)} + "docs/rest/index.html",
                toolsUrl: ${ah3:toJson(baseUrl)} + "#tools",
                productName: ${ah3:toJson(productName)},
                expectedSessionCookieName: "UCD_SESSION_KEY",
                serverLicenseType: "${serverLicenseType}",
                serverLicenseBackupType: "${serverLicenseBackupType}",
                isFIPSModeEnabled: ${isFIPSModeEnabled}
            });

            var timePattern = ${ah3:toJson(timePattern)};
            var datePattern = ${ah3:toJson(datePattern)};
            util.setupTimeDateFormat(timePattern,datePattern);

            var baseTextDir = ${ah3:toJson(baseTextDir)};
            util.setBaseTextDir(baseTextDir);

            var calendar = ${ah3:toJson(calendar)};
            util.setCalendar(calendar);

            util.loadI18n(${ah3:toJson(locale)}, function() {
                util.loadConfig(null, function() {
                    require(["dojo/ready",
                             "deploy/widgets/navigation/Applications",
                             "deploy/widgets/navigation/Calendar",
                             "deploy/widgets/navigation/Components",
                             "deploy/widgets/navigation/Configuration",
                             "deploy/widgets/navigation/Dashboard",
                             "deploy/widgets/navigation/Processes",
                             "deploy/widgets/navigation/ProcessRequests",
                             "deploy/widgets/navigation/Resources",
                             "deploy/widgets/navigation/Security",
                             "deploy/widgets/navigation/Settings",
                             "deploy/widgets/navigation/Reports"], function(ready) {
                        ready(function() {
                            var click = function(href, notBaseUrl){
                                if (notBaseUrl){
                                    window.location = href;
                                }
                                else {
                                    window.location = bootstrap.baseUrl + href;
                                }
                            };

                            var myProfileMenu = new Menu();
                            domClass.add(myProfileMenu.domNode, "my-profile-menu  oneuiHeaderGlobalActionsMenu");

                            var myTeamsMenuItem = new MenuItem({
                                label: i18n("My Teams"),
                                onClick: function(){
                                    click("#myprofile/teams");
                                }
                            });
                            myProfileMenu.addChild(myTeamsMenuItem);

                            var preferencesMenuItem = new MenuItem({
                                label: i18n("Preferences"),
                                onClick: function(){
                                    click("#myprofile/preferences");
                                }
                            });
                            myProfileMenu.addChild(preferencesMenuItem);

                            var myProfileMenuItem = new PopupMenuItem({
                                label: i18n("My Profile"),
                                popup: myProfileMenu
                            });
                            userMenu.addChild(myProfileMenuItem);

                            on(myProfileMenu.domNode, mouse.enter, function(){
                                domClass.add(myProfileMenuItem.domNode, "dijitMenuItemHover");
                                on(myProfileMenu.domNode, mouse.leave, function(){
                                    domClass.remove(myProfileMenuItem.domNode, "dijitMenuItemHover");
                                });
                            });

                            userMenu.startup();

                            var signOutMenuItem = new MenuItem({
                                label: i18n("Sign Out"),
                                onClick: function(){
                                    click("${fn:escapeXml(baseUrl)}tasks/LoginTasks/logout", true);
                                }
                            });
                            userMenu.addChild(signOutMenuItem);

                            var helpMenuItem = new MenuItem();
                            domConstruct.create("a", {
                                "innerHTML": i18n("Help"),
                                "href":
"http://www.ibm.com/support/knowledgecenter/SS4GSP_6.2.1",
                                "target": "_blank"
                            }, helpMenuItem.containerNode);
                            helpMenu.addChild(helpMenuItem);

                            var getStartedMenuItem = new MenuItem();
                            domConstruct.create("a", {
                                "innerHTML": i18n("Getting Started")
                            }, getStartedMenuItem.containerNode);
                            on(getStartedMenuItem.domNode, "click", function() {
                                if (gsPopup) {
                                    gsPopup.open(true);
                                }
                                dijit.popup.close(helpMenu);
                                focusUtil.curNode && focusUtil.curNode.blur();
                                focusUtil.focus(gsPopup.domNode);
                            });
                            helpMenu.addChild(getStartedMenuItem);

                            var toolsMenuItem = new MenuItem();
                            domConstruct.create("a", {
                                "innerHTML": i18n("Tools"),
                                "href": "#tools"
                            }, toolsMenuItem.containerNode);
                            helpMenu.addChild(toolsMenuItem);

                            var aboutMenuItem = new MenuItem();
                            var aboutLink = domConstruct.create("a", {
                                "innerHTML": i18n("About")
                            }, aboutMenuItem.containerNode);
                            on(aboutMenuItem.domNode, "click", function() {
                                var aboutFrame = new Dialog({
                                    className: "about-popup",
                                    closeable: true
                                });

                                var aboutcloseButton = domConstruct.create("div", {
                                    className: "close-popup-button",
                                    title: i18n("Close")
                                }, aboutFrame.titleNode);
                                on(aboutcloseButton, "click", function(){
                                    aboutFrame.hide();
                                });

                                var aboutProductName = domConstruct.create("div", {
                                    className: "product-name",
                                    innerHTML: "IBM UrbanCode Deploy"
                                }, aboutFrame.containerNode);

                                var aboutProductVersion = domConstruct.create("div", {
                                    className: "product-version",
                                    innerHTML: i18n("version %s", ${ah3:toJson(versionStr)})
                                }, aboutFrame.containerNode);

                                var aboutProductDescription = domConstruct.create("div", {
                                    className: "product-description",
                                    innerHTML: i18n("© Copyright "+
                                            "IBM Corp. 2011, 2015. All Rights Reserved.")+"<br/><br/>"+
                                            i18n("U.S. Government Users Restricted Rights: Use, "+
                                            "duplication or disclosure restricted by GSA ADP "+
                                            "Schedule Contract with IBM Corp.")
                                }, aboutFrame.containerNode);

                                aboutFrame.show();
                                on(dom.byId("dijit_DialogUnderlay_0"), "click", function(){
                                    aboutFrame.hide();
                                });

                            });
                            helpMenu.addChild(aboutMenuItem);

                            var topLevelManager = new TabManager({
                                tabSet: config.getTabSet("main"),
                                tab: config.getTabSet("main").tabs[0],
                                isTopLevelTabs: true
                            });
                            topLevelManager.placeAt("topLevelTabs");
                            topLevelManager.startup();

                            navBar = new NavigationBar({
                                topLevelTabManager: topLevelManager
                            });
                            navBar.startup();

                            if (window.location.hash.length === 0) {
                                navBar.setHash("", false, true);
                            }

                            var loadingIndicator = new LoadingIndicator();

                            navBar.startManager();

                            var answersContainer = domConstruct.create("li", {
                                "class": "idxHeaderPrimaryAction"
                            }, header._globalActionsNode);
                            var dwLink = domConstruct.create("a", {
                                href: "http://developer.ibm.com/answers/?community=urbancode",
                                target: "_blank",
                                title: i18n("Questions? We have answers! Ask us on developerWorks."),
                                className: "idxHeaderUserIcon general-icon dw-icon"
                            }, answersContainer);

                            // Get Started popup
                            var gsPopup = new GetStartedPopup({
                                name: "gs"
                            });

                        });
                    });
                });
            });

            // This is used by automated testing to scrape code coverage data from the UI.
            on(dom.byId("coverageData"), "click", function() {
                if (__coverage__) {
                    dom.byId("coverageData").innerHTML = JSON.stringify(__coverage__);
                    __coverage__ = {};
                }
            });
        });
      });
    /* ]]> */
    </script>
  </head>

  <body class="oneui ${isCJK ? 'cjk' : ''} ${isRTL ? 'rtl-ui' : ''}" id="body" dir="${isRTL ? 'rtl': 'ltr'}" lang="${language}">
    <div id="topPageHeader"></div>
    <div class="topLevelTabs" id="topLevelTabs"></div>

    <div class="window-wrapper">
      <div class="secondary-nav">
        <div class="breadcrumb" id="_webext_breadcrumbs"></div>
      </div>

      <div class="page-content">
        <div class="inner-page-content">
          <div class="_webext_detail_header" id="_webext_detail_header"></div>
          <div id="secondLevelTabs"></div>
          <div data-dojo-type="dojox.layout.ContentPane" id="_webext_content" class="_webext_content" style="padding: 0px;"></div>
        </div>
      </div>
      <div class="footer-spacer"></div>
    </div>
    <div class="page-footer">
      <div class="footer-content"></div>
    </div>

    <iframe id="formTarget" name="formTarget" style="display: none;" onLoad="require(['dojo/_base/connect'], function(connect){connect.publish('formTarget',['formTargetLoaded'])})"></iframe>

    <!-- DOM Node for testing coverage data -->
    <div id="coverageData" style="display: inline-block;
          width: 1px; height: 1px; overflow: hidden;
          position: fixed; top: 0px; left: 0px; z-index: 100000;"></div>
  </body>
</html>
<%
  }
%>
