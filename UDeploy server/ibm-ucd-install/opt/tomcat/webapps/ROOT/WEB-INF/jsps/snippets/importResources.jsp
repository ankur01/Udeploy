<%--
- Licensed Materials - Property of IBM Corp.
- IBM UrbanCode Deploy
- (c) Copyright IBM Corporation 2011, 2014. All Rights Reserved.
-
- U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by
- GSA ADP Schedule Contract with IBM Corp.
--%>
<%@page pageEncoding="UTF-8"%>
<%@page import="com.urbancode.commons.webext.util.InstalledVersion"%>
<%@page import="com.urbancode.ds.subsys.system.SystemConfiguration"%>
<%@page import="com.urbancode.air.i18n.TranslateUtil"%>


<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@taglib prefix="ah3" uri="http://www.urbancode.com/anthill3/tags" %>

<%
  String versionStr = "";
  Boolean debug = false;

  try {
      InstalledVersion version = InstalledVersion.getInstance();
      versionStr = version.getVersion();
  }
  catch (Throwable t) {
  }

  if (SystemConfiguration.getInstance().isEnableUIDebugging()) {
      debug = true;
  }
  else if (versionStr != null && versionStr.equals("dev")) {
      debug = true;
  }

  pageContext.setAttribute("versionStr", versionStr);
  pageContext.setAttribute("debug", debug);
  pageContext.setAttribute("locale", TranslateUtil.getInstance().getCurrentLocale().toString());
%>

<c:url var="baseUrl" value="/"/>
<c:set var="contentBase" value="${baseUrl}static/${versionStr}/"/>
<c:set var="cssBase" value="${contentBase}css/"/>
<c:set var="webextBase" value="${contentBase}lib/webext/"/>
<c:set var="dojoBase" value="${contentBase}lib/dojo/"/>

<link rel="stylesheet" type="text/css" href="${dojoBase}dojo/resources/dojo.css"/>
<link rel="stylesheet" type="text/css" href="${dojoBase}dijit/themes/dijit.css"/>
<link rel="stylesheet" type="text/css" href="${dojoBase}dijit/themes/dijit_rtl.css"/>
<link rel="stylesheet" type="text/css" href="${contentBase}lib/idx/themes/oneui/oneui.css"/>

<link rel="stylesheet" type="text/css" href="${dojoBase}dojox/form/resources/CheckedMultiSelect.css" />
<link rel="stylesheet" type="text/css" href="${dojoBase}dojox/layout/resources/ResizeHandle.css" />
<link rel="stylesheet" type="text/css" href="${dojoBase}dojox/widget/Wizard/Wizard.css" />
<link rel="stylesheet" type="text/css" href="${webextBase}css/webext/webext-common.css"/>
<link rel="stylesheet" type="text/css" href="${webextBase}css/webext/webext-widgets.css"/>

<link rel="stylesheet" type="text/css" href="${contentBase}css/deploy/icons.css" />
<link rel="stylesheet" type="text/css" href="${contentBase}css/deploy/udeploy.css" />

<% if ("true".equals(request.getParameter("isRTL"))) { %>
    <link rel="stylesheet" type="text/css" href="${webextBase}/css/webext/webext-common_rtl.css"/>
    <link rel="stylesheet" type="text/css" href="${webextBase}/css/webext/webext-widgets_rtl.css"/>
    <link rel="stylesheet" type="text/css" href="${contentBase}/css/deploy/icons_rtl.css" />
    <link rel="stylesheet" type="text/css" href="${contentBase}/css/deploy/udeploy_rtl.css" />
<% } %>
<!--[if IE]>
<script type="text/javascript">
  if (("undefined" !== typeof JSON)
          && (JSON.stringify(document.createElement("input").value)!== '""' ) ) {
      var _stringify = JSON.stringify;
      JSON.stringify = function(o, f, s) {
          var replacer = function(key, value) {
              if (value === "" ) {
                  // Fix IE8 stringify bug for input values
                  return "";
              }
              // normal behavior
              return f ? f(key,value) : value;
          }
          return _stringify(o, replacer, s);
      }
  }
</script>
<![endif]-->



<script type="text/javascript">
    mxBasePath = "${contentBase}lib/mxgraph";

    var defaultLocale = ${ah3:toJson(locale)};
    if (defaultLocale === "en_US") {
        defaultLocale = "en";
    }
    defaultLocale = defaultLocale.toLowerCase();
    defaultLocale = defaultLocale.replace(/_/g, '-');

    var dojoConfig = {
        async: true,
        baseUrl: "${dojoBase}dojo",
        bindEncoding: "UTF-8",
        isDebug: ${ah3:toJson(versionStr == 'dev')},
        locale: defaultLocale,
        parseOnLoad: true,
        paths: {
            "js": ${ah3:toJson(webextBase)}+"js",
            "idx": ${ah3:toJson(contentBase)}+"lib/idx",
            "deploy": ${ah3:toJson(contentBase)}+"js/deploy"
        }
    };
</script>
<%
  if (debug) {
%>
    <script type="text/javascript" src="${dojoBase}dojo/dojo.js"></script>
<%
  }
  else {
%>
    <script type="text/javascript" src="${contentBase}ucdjs-pack.js"></script>
<%
  }
%>

<script type="text/javascript" src="${contentBase}lib/mxgraph/js/mxClient.js"></script>
<script type="text/javascript" src="${contentBase}lib/ace/ace.js"></script>
<script type="text/javascript" src="${contentBase}js/deploy/mxClientPatch.js"></script>
<script type="text/javascript" src="${contentBase}lib/jquery/jquery-1.7.1.min.js"></script>
<script type="text/javascript" src="${contentBase}lib/highcharts/js/highcharts.js"></script>
