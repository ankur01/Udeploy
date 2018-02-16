<%--
- Licensed Materials - Property of IBM Corp.
- IBM UrbanCode Deploy
- (c) Copyright IBM Corporation 2011, 2014. All Rights Reserved.
-
- U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
- GSA ADP Schedule Contract with IBM Corp.
--%>
<%@page contentType="text/html" %>
<%@page pageEncoding="UTF-8" %>
<%@page import="com.urbancode.commons.webext.util.InstalledVersion"%>
<%@page import="com.urbancode.ds.ServerConstants"%>
<%@page import="com.urbancode.air.i18n.TranslateUtil"%>

<%@taglib prefix="c"   uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib prefix="fn"  uri="http://java.sun.com/jsp/jstl/functions"%>
<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@taglib prefix="ah3" uri="http://www.urbancode.com/anthill3/tags" %>

<%
  String versionStr = "";
  try {
      InstalledVersion version = InstalledVersion.getInstance();
      versionStr = version.getVersion();
  }
  catch (Throwable t) {
  }
  pageContext.setAttribute("webAppVersion", versionStr);
  pageContext.setAttribute("productName", ServerConstants.PRODUCT_NAME_NORMAL);

  String loginErrorMsg = (String)pageContext.getSession().getAttribute("loginErrorMsg");
  pageContext.setAttribute("loginErrorMsg", loginErrorMsg);
%>


<!DOCTYPE html>
<html class="fullHeight">
  <head>
    <title>${productName}: <%= TranslateUtil.getInstance().getValue("Log In") %></title>
    
    <c:import url="/WEB-INF/jsps/snippets/importResources.jsp" />

    <c:url var="staticBase" value="/static/${fn:escapeXml(webAppVersion)}"/>
    <c:set var="webextBase" value="${staticBase}/lib/webext/"/>
   
    <link rel="shortcut icon" href="${staticBase}/images/uDeploy.ico"/>
    <link rel="stylesheet" type="text/css" href="${webextBase}css/webext/login.css" />

    <script type="text/javascript">
    /* <![CDATA[ */
      require(["dojo/ready",
               "dojo/dom-class",
               "dijit/form/TextBox",
               "dijit/form/CheckBox",
               "dijit/form/Button"],
              function(
                      ready,
                      domClass,
                      TextBox,
                      CheckBox,
                      Button) {
        ready(function () {
            var usernameInput = new TextBox({
                name: "username",
                placeHolder: "<%= TranslateUtil.getInstance().getValue("User name") %>"
            }, "usernameField");
            var usernameInput = new TextBox({
                name: "password",
                type: "password",
                placeHolder: "<%= TranslateUtil.getInstance().getValue("Password") %>"
            }, "passwordField");
            var rememberMeInput = new CheckBox({
                name: "rememberMe",
                value: "true"
            }, "rememberMe");
            var submitButton = new Button({
                label: "<%= TranslateUtil.getInstance().getValue("Log in") %>",
                type: "submit",
                style: {
                    marginLeft: "0px"
                }
            }, "submitButton");
            domClass.add(submitButton.domNode, "idxButtonSpecial");

            document.getElementById("requestedHash").value = window.location.hash;
        });
      });
    /* ]]> */
    </script>
  </head>
  <body class="oneui loginPage fullHeight">
    <div class="idxHeaderContainer">
      <div class="idxHeaderBlueLip"></div>
    </div>
    
    <div class="loginFramePositioner">
      <div class="loginFrame">
      
        <span class="productName">UrbanCode Deploy</span>, 
        <span class="productVersion">${webAppVersion}</span>

        <div class="formSpacer"></div>
        <div class="formSpacer"></div>

        <c:url var="authenticateUrl" value="/tasks/LoginTasks/login"/>
        <form method="post" action="${fn:escapeXml(authenticateUrl)}" autocomplete="off">
          <c:if test="${loginErrorMsg != null}">
            <div class="loginError">
              <p>
                <span class="error">${loginErrorMsg}</span>
              </p>
            </div>
          </c:if>
          
          <div id="usernameField"></div>
          
          <div class="formSpacer"></div>
          <div class="formSpacer"></div>
          
          <div id="passwordField"></div>

          <div class="formSpacer"></div>
          <div class="formSpacer"></div>
          
          <div id="rememberMe"></div>
          <label for="rememberMe"><%= TranslateUtil.getInstance().getValue("Keep me logged in") %></label>

          <div class="formSpacer"></div>
          <div class="formSpacer"></div>
          
          <div id="submitButton" class="idxButtonSpecial"></div>
          <input type="hidden" name="requestedHash" value="" id="requestedHash"/>

          <div class="formSpacer"></div>
          <div class="formSpacer"></div>
          <div class="formSpacer"></div>

          <div class="legal">
            <%= TranslateUtil.getInstance().getValue("&copy; Copyright 2015 &nbsp;IBM Corporation.") %>
            
          </div>
        </form>
      </div>
    </div>
  </body>
</html>

