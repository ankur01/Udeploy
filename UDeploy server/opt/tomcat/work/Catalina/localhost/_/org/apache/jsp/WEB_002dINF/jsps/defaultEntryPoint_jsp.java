package org.apache.jsp.WEB_002dINF.jsps;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import com.urbancode.commons.util.crypto.FIPSHelper;
import com.urbancode.ds.subsys.system.SystemConfiguration;
import com.urbancode.commons.web.WebConfig;
import com.urbancode.commons.webext.util.InstalledVersion;
import com.urbancode.ds.ServerConstants;
import com.urbancode.security.SecurityUser;
import com.urbancode.ds.web.filter.AuthenticationFilter;
import com.urbancode.ds.security.SecuritySchemaHelper;
import com.urbancode.ds.subsys.deploy.config.Application;
import com.urbancode.ds.subsys.deploy.config.Component;
import com.urbancode.ds.subsys.deploy.config.environment.Environment;
import com.urbancode.ds.subsys.resource.domain.Resource;
import com.urbancode.air.i18n.TranslateUtil;
import com.urbancode.ds.pattern.DateUtil;

public final class defaultEntryPoint_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {

static private org.apache.jasper.runtime.ProtectedFunctionMapper _jspx_fnmap_0;
static private org.apache.jasper.runtime.ProtectedFunctionMapper _jspx_fnmap_1;

static {
  _jspx_fnmap_0= org.apache.jasper.runtime.ProtectedFunctionMapper.getMapForFunction("fn:escapeXml", org.apache.taglibs.standard.functions.Functions.class, "escapeXml", new Class[] {java.lang.String.class});
  _jspx_fnmap_1= org.apache.jasper.runtime.ProtectedFunctionMapper.getMapForFunction("ah3:toJson", com.urbancode.anthill3.web.functions.Functions.class, "toJson", new Class[] {java.lang.Object.class});
}

  private static final JspFactory _jspxFactory = JspFactory.getDefaultFactory();

  private static java.util.List _jspx_dependants;

  private org.apache.jasper.runtime.TagHandlerPool _005fjspx_005ftagPool_005fc_005furl_0026_005fvar_005fvalue_005fnobody;
  private org.apache.jasper.runtime.TagHandlerPool _005fjspx_005ftagPool_005fc_005fimport_0026_005furl;
  private org.apache.jasper.runtime.TagHandlerPool _005fjspx_005ftagPool_005fc_005fparam_0026_005fvalue_005fname_005fnobody;

  private javax.el.ExpressionFactory _el_expressionfactory;
  private org.apache.AnnotationProcessor _jsp_annotationprocessor;

  public Object getDependants() {
    return _jspx_dependants;
  }

  public void _jspInit() {
    _005fjspx_005ftagPool_005fc_005furl_0026_005fvar_005fvalue_005fnobody = org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool(getServletConfig());
    _005fjspx_005ftagPool_005fc_005fimport_0026_005furl = org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool(getServletConfig());
    _005fjspx_005ftagPool_005fc_005fparam_0026_005fvalue_005fname_005fnobody = org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool(getServletConfig());
    _el_expressionfactory = _jspxFactory.getJspApplicationContext(getServletConfig().getServletContext()).getExpressionFactory();
    _jsp_annotationprocessor = (org.apache.AnnotationProcessor) getServletConfig().getServletContext().getAttribute(org.apache.AnnotationProcessor.class.getName());
  }

  public void _jspDestroy() {
    _005fjspx_005ftagPool_005fc_005furl_0026_005fvar_005fvalue_005fnobody.release();
    _005fjspx_005ftagPool_005fc_005fimport_0026_005furl.release();
    _005fjspx_005ftagPool_005fc_005fparam_0026_005fvalue_005fname_005fnobody.release();
  }

  public void _jspService(HttpServletRequest request, HttpServletResponse response)
        throws java.io.IOException, ServletException {

    PageContext pageContext = null;
    HttpSession session = null;
    ServletContext application = null;
    ServletConfig config = null;
    JspWriter out = null;
    Object page = this;
    JspWriter _jspx_out = null;
    PageContext _jspx_page_context = null;


    try {
      response.setContentType("text/html;charset=UTF-8");
      pageContext = _jspxFactory.getPageContext(this, request, response,
      			null, true, 8192, true);
      _jspx_page_context = pageContext;
      application = pageContext.getServletContext();
      config = pageContext.getServletConfig();
      session = pageContext.getSession();
      out = pageContext.getOut();
      _jspx_out = out;


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

      if (_jspx_meth_c_005furl_005f0(_jspx_page_context))
        return;
      if (_jspx_meth_c_005furl_005f1(_jspx_page_context))
        return;
      if (_jspx_meth_c_005furl_005f2(_jspx_page_context))
        return;
      if (_jspx_meth_c_005furl_005f3(_jspx_page_context))
        return;
      out.write("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n");
      out.write("\n");
      out.write("<html xmlns=\"http://www.w3.org/1999/xhtml\">\n");
      out.write("  <head>\n");
      out.write("    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />\n");
      out.write("    ");
      out.write("<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"/>\n");
      out.write("    <title>");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${productName}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("</title>\n");
      out.write("    <link rel=\"shortcut icon\" href=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${fn:escapeXml(favIconUrl)}", java.lang.String.class, (PageContext)_jspx_page_context, _jspx_fnmap_0, false));
      out.write("\"/>\n");
      out.write("\n");
      out.write("    ");
      if (_jspx_meth_c_005fimport_005f0(_jspx_page_context))
        return;
      out.write("<script type=\"text/javascript\">\n");
      out.write("    /* <![CDATA[ */\n");
      out.write("\n");
      out.write("      // Global and utility variables.\n");
      out.write("      var appState = {};\n");
      out.write("      var bootstrap = null;\n");
      out.write("      var util = null;\n");
      out.write("      var navBar = null;\n");
      out.write("      var config = null;\n");
      out.write("      var formatters = null;\n");
      out.write("      var i18nData = {};\n");
      out.write("\n");
      out.write("      require([\"dojo/ready\",\n");
      out.write("               \"dojo/dom\",\n");
      out.write("               \"dojo/dom-style\",\n");
      out.write("               \"dojo/dom-class\",\n");
      out.write("               \"dojo/dom-construct\",\n");
      out.write("               \"dojo/json\",\n");
      out.write("               \"dojo/on\",\n");
      out.write("               \"dojo/mouse\",\n");
      out.write("               \"dojo/_base/array\",\n");
      out.write("               \"dojox/layout/ContentPane\",\n");
      out.write("               \"js/webext/widgets/Bootstrap\",\n");
      out.write("               \"js/webext/widgets/NavigationBar\",\n");
      out.write("               \"js/webext/widgets/TabManager\",\n");
      out.write("               \"js/webext/widgets/Util\",\n");
      out.write("               \"deploy/widgets/Formatters\",\n");
      out.write("               \"deploy/widgets/GetStartedPopup\",\n");
      out.write("               \"deploy/widgets/vc/VCUtil\",\n");
      out.write("               \"deploy/widgets/FormDelegateRegistry\",\n");
      out.write("               \"deploy/widgets/navigation/LoadingIndicator\",\n");
      out.write("               \"dojox/html/entities\",\n");
      out.write("               \"idx/app/Header\",\n");
      out.write("               \"idx/widget/Menu\",\n");
      out.write("               \"dijit/focus\",\n");
      out.write("               \"dijit/Menu\",\n");
      out.write("               \"dijit/MenuItem\",\n");
      out.write("               \"dijit/PopupMenuItem\",\n");
      out.write("               \"dijit/DropDownMenu\",\n");
      out.write("               \"dijit/Dialog\"],\n");
      out.write("              function (\n");
      out.write("                      ready,\n");
      out.write("                      dom,\n");
      out.write("                      domStyle,\n");
      out.write("                      domClass,\n");
      out.write("                      domConstruct,\n");
      out.write("                      JSON,\n");
      out.write("                      on,\n");
      out.write("                      mouse,\n");
      out.write("                      array,\n");
      out.write("                      ContentPane,\n");
      out.write("                      Bootstrap,\n");
      out.write("                      NavigationBar,\n");
      out.write("                      TabManager,\n");
      out.write("                      Util,\n");
      out.write("                      Formatters,\n");
      out.write("                      GetStartedPopup,\n");
      out.write("                      VCUtil,\n");
      out.write("                      FormDelegateRegistry,\n");
      out.write("                      LoadingIndicator,\n");
      out.write("                      entities,\n");
      out.write("                      Header,\n");
      out.write("                      idxMenu,\n");
      out.write("                      focusUtil,\n");
      out.write("                      Menu,\n");
      out.write("                      MenuItem,\n");
      out.write("                      PopupMenuItem,\n");
      out.write("                      DropDownMenu,\n");
      out.write("                      Dialog) {\n");
      out.write("        ready(function () {\n");
      out.write("            var __id__ = \"topPageHeader\";\n");
      out.write("            var userMenu = new Menu();\n");
      out.write("            var helpMenu = new idxMenu();\n");
      out.write("\n");
      out.write("            util = new Util();\n");
      out.write("            util.vc = new VCUtil();\n");
      out.write("\n");
      out.write("            var userIcon = '<div class=\"userIcon inlineBlock\"></div>';\n");
      out.write("            var header = new Header({\n");
      out.write("                primaryTitle: ");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${ah3:toJson(productName)}", java.lang.String.class, (PageContext)_jspx_page_context, _jspx_fnmap_1, false));
      out.write(",\n");
      out.write("                user: {\n");
      out.write("                    messageName: userIcon + util.escape(");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${ah3:toJson(userFullName)}", java.lang.String.class, (PageContext)_jspx_page_context, _jspx_fnmap_1, false));
      out.write("),\n");
      out.write("                    displayName: util.escape(");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${ah3:toJson(userFullName)}", java.lang.String.class, (PageContext)_jspx_page_context, _jspx_fnmap_1, false));
      out.write("),\n");
      out.write("                    actions: userMenu\n");
      out.write("                },\n");
      out.write("                help: helpMenu,\n");
      out.write("                secondaryBannerType: \"lightGray\",\n");
      out.write("                contentTabsInline: true\n");
      out.write("            }, __id__);\n");
      out.write("\n");
      out.write("            formatters = Formatters;\n");
      out.write("\n");
      out.write("            bootstrap = new Bootstrap({\n");
      out.write("                initialState: {},\n");
      out.write("                username: ");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${ah3:toJson(username)}", java.lang.String.class, (PageContext)_jspx_page_context, _jspx_fnmap_1, false));
      out.write(",\n");
      out.write("                baseUrl: ");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${ah3:toJson(baseUrl)}", java.lang.String.class, (PageContext)_jspx_page_context, _jspx_fnmap_1, false));
      out.write(",\n");
      out.write("                contentUrl: ");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${ah3:toJson(contentUrl)}", java.lang.String.class, (PageContext)_jspx_page_context, _jspx_fnmap_1, false));
      out.write(",\n");
      out.write("                webextUrl: ");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${ah3:toJson(contentUrl)}", java.lang.String.class, (PageContext)_jspx_page_context, _jspx_fnmap_1, false));
      out.write(" + \"lib/webext/\",\n");
      out.write("                contentIdentifier: ");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${ah3:toJson(versionStr)}", java.lang.String.class, (PageContext)_jspx_page_context, _jspx_fnmap_1, false));
      out.write(",\n");
      out.write("                configUrl: ");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${ah3:toJson(navigationUrl)}", java.lang.String.class, (PageContext)_jspx_page_context, _jspx_fnmap_1, false));
      out.write(",\n");
      out.write("                restApiUrl: ");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${ah3:toJson(contentUrl)}", java.lang.String.class, (PageContext)_jspx_page_context, _jspx_fnmap_1, false));
      out.write(" + \"docs/rest/index.html\",\n");
      out.write("                toolsUrl: ");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${ah3:toJson(baseUrl)}", java.lang.String.class, (PageContext)_jspx_page_context, _jspx_fnmap_1, false));
      out.write(" + \"#tools\",\n");
      out.write("                productName: ");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${ah3:toJson(productName)}", java.lang.String.class, (PageContext)_jspx_page_context, _jspx_fnmap_1, false));
      out.write(",\n");
      out.write("                expectedSessionCookieName: \"UCD_SESSION_KEY\",\n");
      out.write("                serverLicenseType: \"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${serverLicenseType}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("\",\n");
      out.write("                serverLicenseBackupType: \"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${serverLicenseBackupType}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("\",\n");
      out.write("                isFIPSModeEnabled: ");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${isFIPSModeEnabled}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("\n");
      out.write("            });\n");
      out.write("\n");
      out.write("            var timePattern = ");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${ah3:toJson(timePattern)}", java.lang.String.class, (PageContext)_jspx_page_context, _jspx_fnmap_1, false));
      out.write(";\n");
      out.write("            var datePattern = ");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${ah3:toJson(datePattern)}", java.lang.String.class, (PageContext)_jspx_page_context, _jspx_fnmap_1, false));
      out.write(";\n");
      out.write("            util.setupTimeDateFormat(timePattern,datePattern);\n");
      out.write("\n");
      out.write("            var baseTextDir = ");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${ah3:toJson(baseTextDir)}", java.lang.String.class, (PageContext)_jspx_page_context, _jspx_fnmap_1, false));
      out.write(";\n");
      out.write("            util.setBaseTextDir(baseTextDir);\n");
      out.write("\n");
      out.write("            var calendar = ");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${ah3:toJson(calendar)}", java.lang.String.class, (PageContext)_jspx_page_context, _jspx_fnmap_1, false));
      out.write(";\n");
      out.write("            util.setCalendar(calendar);\n");
      out.write("\n");
      out.write("            util.loadI18n(");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${ah3:toJson(locale)}", java.lang.String.class, (PageContext)_jspx_page_context, _jspx_fnmap_1, false));
      out.write(", function() {\n");
      out.write("                util.loadConfig(null, function() {\n");
      out.write("                    require([\"dojo/ready\",\n");
      out.write("                             \"deploy/widgets/navigation/Applications\",\n");
      out.write("                             \"deploy/widgets/navigation/Calendar\",\n");
      out.write("                             \"deploy/widgets/navigation/Components\",\n");
      out.write("                             \"deploy/widgets/navigation/Configuration\",\n");
      out.write("                             \"deploy/widgets/navigation/Dashboard\",\n");
      out.write("                             \"deploy/widgets/navigation/Processes\",\n");
      out.write("                             \"deploy/widgets/navigation/ProcessRequests\",\n");
      out.write("                             \"deploy/widgets/navigation/Resources\",\n");
      out.write("                             \"deploy/widgets/navigation/Security\",\n");
      out.write("                             \"deploy/widgets/navigation/Settings\",\n");
      out.write("                             \"deploy/widgets/navigation/Reports\"], function(ready) {\n");
      out.write("                        ready(function() {\n");
      out.write("                            var click = function(href, notBaseUrl){\n");
      out.write("                                if (notBaseUrl){\n");
      out.write("                                    window.location = href;\n");
      out.write("                                }\n");
      out.write("                                else {\n");
      out.write("                                    window.location = bootstrap.baseUrl + href;\n");
      out.write("                                }\n");
      out.write("                            };\n");
      out.write("\n");
      out.write("                            var myProfileMenu = new Menu();\n");
      out.write("                            domClass.add(myProfileMenu.domNode, \"my-profile-menu  oneuiHeaderGlobalActionsMenu\");\n");
      out.write("\n");
      out.write("                            var myTeamsMenuItem = new MenuItem({\n");
      out.write("                                label: i18n(\"My Teams\"),\n");
      out.write("                                onClick: function(){\n");
      out.write("                                    click(\"#myprofile/teams\");\n");
      out.write("                                }\n");
      out.write("                            });\n");
      out.write("                            myProfileMenu.addChild(myTeamsMenuItem);\n");
      out.write("\n");
      out.write("                            var preferencesMenuItem = new MenuItem({\n");
      out.write("                                label: i18n(\"Preferences\"),\n");
      out.write("                                onClick: function(){\n");
      out.write("                                    click(\"#myprofile/preferences\");\n");
      out.write("                                }\n");
      out.write("                            });\n");
      out.write("                            myProfileMenu.addChild(preferencesMenuItem);\n");
      out.write("\n");
      out.write("                            var myProfileMenuItem = new PopupMenuItem({\n");
      out.write("                                label: i18n(\"My Profile\"),\n");
      out.write("                                popup: myProfileMenu\n");
      out.write("                            });\n");
      out.write("                            userMenu.addChild(myProfileMenuItem);\n");
      out.write("\n");
      out.write("                            on(myProfileMenu.domNode, mouse.enter, function(){\n");
      out.write("                                domClass.add(myProfileMenuItem.domNode, \"dijitMenuItemHover\");\n");
      out.write("                                on(myProfileMenu.domNode, mouse.leave, function(){\n");
      out.write("                                    domClass.remove(myProfileMenuItem.domNode, \"dijitMenuItemHover\");\n");
      out.write("                                });\n");
      out.write("                            });\n");
      out.write("\n");
      out.write("                            userMenu.startup();\n");
      out.write("\n");
      out.write("                            var signOutMenuItem = new MenuItem({\n");
      out.write("                                label: i18n(\"Sign Out\"),\n");
      out.write("                                onClick: function(){\n");
      out.write("                                    click(\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${fn:escapeXml(baseUrl)}", java.lang.String.class, (PageContext)_jspx_page_context, _jspx_fnmap_0, false));
      out.write("tasks/LoginTasks/logout\", true);\n");
      out.write("                                }\n");
      out.write("                            });\n");
      out.write("                            userMenu.addChild(signOutMenuItem);\n");
      out.write("\n");
      out.write("                            var helpMenuItem = new MenuItem();\n");
      out.write("                            domConstruct.create(\"a\", {\n");
      out.write("                                \"innerHTML\": i18n(\"Help\"),\n");
      out.write("                                \"href\":\n");
      out.write("\"http://www.ibm.com/support/knowledgecenter/SS4GSP_6.2.1\",\n");
      out.write("                                \"target\": \"_blank\"\n");
      out.write("                            }, helpMenuItem.containerNode);\n");
      out.write("                            helpMenu.addChild(helpMenuItem);\n");
      out.write("\n");
      out.write("                            var getStartedMenuItem = new MenuItem();\n");
      out.write("                            domConstruct.create(\"a\", {\n");
      out.write("                                \"innerHTML\": i18n(\"Getting Started\")\n");
      out.write("                            }, getStartedMenuItem.containerNode);\n");
      out.write("                            on(getStartedMenuItem.domNode, \"click\", function() {\n");
      out.write("                                if (gsPopup) {\n");
      out.write("                                    gsPopup.open(true);\n");
      out.write("                                }\n");
      out.write("                                dijit.popup.close(helpMenu);\n");
      out.write("                                focusUtil.curNode && focusUtil.curNode.blur();\n");
      out.write("                                focusUtil.focus(gsPopup.domNode);\n");
      out.write("                            });\n");
      out.write("                            helpMenu.addChild(getStartedMenuItem);\n");
      out.write("\n");
      out.write("                            var toolsMenuItem = new MenuItem();\n");
      out.write("                            domConstruct.create(\"a\", {\n");
      out.write("                                \"innerHTML\": i18n(\"Tools\"),\n");
      out.write("                                \"href\": \"#tools\"\n");
      out.write("                            }, toolsMenuItem.containerNode);\n");
      out.write("                            helpMenu.addChild(toolsMenuItem);\n");
      out.write("\n");
      out.write("                            var aboutMenuItem = new MenuItem();\n");
      out.write("                            var aboutLink = domConstruct.create(\"a\", {\n");
      out.write("                                \"innerHTML\": i18n(\"About\")\n");
      out.write("                            }, aboutMenuItem.containerNode);\n");
      out.write("                            on(aboutMenuItem.domNode, \"click\", function() {\n");
      out.write("                                var aboutFrame = new Dialog({\n");
      out.write("                                    className: \"about-popup\",\n");
      out.write("                                    closeable: true\n");
      out.write("                                });\n");
      out.write("\n");
      out.write("                                var aboutcloseButton = domConstruct.create(\"div\", {\n");
      out.write("                                    className: \"close-popup-button\",\n");
      out.write("                                    title: i18n(\"Close\")\n");
      out.write("                                }, aboutFrame.titleNode);\n");
      out.write("                                on(aboutcloseButton, \"click\", function(){\n");
      out.write("                                    aboutFrame.hide();\n");
      out.write("                                });\n");
      out.write("\n");
      out.write("                                var aboutProductName = domConstruct.create(\"div\", {\n");
      out.write("                                    className: \"product-name\",\n");
      out.write("                                    innerHTML: \"IBM UrbanCode Deploy\"\n");
      out.write("                                }, aboutFrame.containerNode);\n");
      out.write("\n");
      out.write("                                var aboutProductVersion = domConstruct.create(\"div\", {\n");
      out.write("                                    className: \"product-version\",\n");
      out.write("                                    innerHTML: i18n(\"version %s\", ");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${ah3:toJson(versionStr)}", java.lang.String.class, (PageContext)_jspx_page_context, _jspx_fnmap_1, false));
      out.write(")\n");
      out.write("                                }, aboutFrame.containerNode);\n");
      out.write("\n");
      out.write("                                var aboutProductDescription = domConstruct.create(\"div\", {\n");
      out.write("                                    className: \"product-description\",\n");
      out.write("                                    innerHTML: i18n(\"© Copyright \"+\n");
      out.write("                                            \"IBM Corp. 2011, 2015. All Rights Reserved.\")+\"<br/><br/>\"+\n");
      out.write("                                            i18n(\"U.S. Government Users Restricted Rights: Use, \"+\n");
      out.write("                                            \"duplication or disclosure restricted by GSA ADP \"+\n");
      out.write("                                            \"Schedule Contract with IBM Corp.\")\n");
      out.write("                                }, aboutFrame.containerNode);\n");
      out.write("\n");
      out.write("                                aboutFrame.show();\n");
      out.write("                                on(dom.byId(\"dijit_DialogUnderlay_0\"), \"click\", function(){\n");
      out.write("                                    aboutFrame.hide();\n");
      out.write("                                });\n");
      out.write("\n");
      out.write("                            });\n");
      out.write("                            helpMenu.addChild(aboutMenuItem);\n");
      out.write("\n");
      out.write("                            var topLevelManager = new TabManager({\n");
      out.write("                                tabSet: config.getTabSet(\"main\"),\n");
      out.write("                                tab: config.getTabSet(\"main\").tabs[0],\n");
      out.write("                                isTopLevelTabs: true\n");
      out.write("                            });\n");
      out.write("                            topLevelManager.placeAt(\"topLevelTabs\");\n");
      out.write("                            topLevelManager.startup();\n");
      out.write("\n");
      out.write("                            navBar = new NavigationBar({\n");
      out.write("                                topLevelTabManager: topLevelManager\n");
      out.write("                            });\n");
      out.write("                            navBar.startup();\n");
      out.write("\n");
      out.write("                            if (window.location.hash.length === 0) {\n");
      out.write("                                navBar.setHash(\"\", false, true);\n");
      out.write("                            }\n");
      out.write("\n");
      out.write("                            var loadingIndicator = new LoadingIndicator();\n");
      out.write("\n");
      out.write("                            navBar.startManager();\n");
      out.write("\n");
      out.write("                            var answersContainer = domConstruct.create(\"li\", {\n");
      out.write("                                \"class\": \"idxHeaderPrimaryAction\"\n");
      out.write("                            }, header._globalActionsNode);\n");
      out.write("                            var dwLink = domConstruct.create(\"a\", {\n");
      out.write("                                href: \"http://developer.ibm.com/answers/?community=urbancode\",\n");
      out.write("                                target: \"_blank\",\n");
      out.write("                                title: i18n(\"Questions? We have answers! Ask us on developerWorks.\"),\n");
      out.write("                                className: \"idxHeaderUserIcon general-icon dw-icon\"\n");
      out.write("                            }, answersContainer);\n");
      out.write("\n");
      out.write("                            // Get Started popup\n");
      out.write("                            var gsPopup = new GetStartedPopup({\n");
      out.write("                                name: \"gs\"\n");
      out.write("                            });\n");
      out.write("\n");
      out.write("                        });\n");
      out.write("                    });\n");
      out.write("                });\n");
      out.write("            });\n");
      out.write("\n");
      out.write("            // This is used by automated testing to scrape code coverage data from the UI.\n");
      out.write("            on(dom.byId(\"coverageData\"), \"click\", function() {\n");
      out.write("                if (__coverage__) {\n");
      out.write("                    dom.byId(\"coverageData\").innerHTML = JSON.stringify(__coverage__);\n");
      out.write("                    __coverage__ = {};\n");
      out.write("                }\n");
      out.write("            });\n");
      out.write("        });\n");
      out.write("      });\n");
      out.write("    /* ]]> */\n");
      out.write("    </script>\n");
      out.write("  </head>\n");
      out.write("\n");
      out.write("  <body class=\"oneui ");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${isCJK ? 'cjk' : ''}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${isRTL ? 'rtl-ui' : ''}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("\" id=\"body\" dir=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${isRTL ? 'rtl': 'ltr'}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("\" lang=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${language}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("\">\n");
      out.write("    <div id=\"topPageHeader\"></div>\n");
      out.write("    <div class=\"topLevelTabs\" id=\"topLevelTabs\"></div>\n");
      out.write("\n");
      out.write("    <div class=\"window-wrapper\">\n");
      out.write("      <div class=\"secondary-nav\">\n");
      out.write("        <div class=\"breadcrumb\" id=\"_webext_breadcrumbs\"></div>\n");
      out.write("      </div>\n");
      out.write("\n");
      out.write("      <div class=\"page-content\">\n");
      out.write("        <div class=\"inner-page-content\">\n");
      out.write("          <div class=\"_webext_detail_header\" id=\"_webext_detail_header\"></div>\n");
      out.write("          <div id=\"secondLevelTabs\"></div>\n");
      out.write("          <div data-dojo-type=\"dojox.layout.ContentPane\" id=\"_webext_content\" class=\"_webext_content\" style=\"padding: 0px;\"></div>\n");
      out.write("        </div>\n");
      out.write("      </div>\n");
      out.write("      <div class=\"footer-spacer\"></div>\n");
      out.write("    </div>\n");
      out.write("    <div class=\"page-footer\">\n");
      out.write("      <div class=\"footer-content\"></div>\n");
      out.write("    </div>\n");
      out.write("\n");
      out.write("    <iframe id=\"formTarget\" name=\"formTarget\" style=\"display: none;\" onLoad=\"require(['dojo/_base/connect'], function(connect){connect.publish('formTarget',['formTargetLoaded'])})\"></iframe>\n");
      out.write("\n");
      out.write("    <!-- DOM Node for testing coverage data -->\n");
      out.write("    <div id=\"coverageData\" style=\"display: inline-block;\n");
      out.write("          width: 1px; height: 1px; overflow: hidden;\n");
      out.write("          position: fixed; top: 0px; left: 0px; z-index: 100000;\"></div>\n");
      out.write("  </body>\n");
      out.write("</html>\n");

  }

    } catch (Throwable t) {
      if (!(t instanceof SkipPageException)){
        out = _jspx_out;
        if (out != null && out.getBufferSize() != 0)
          try { out.clearBuffer(); } catch (java.io.IOException e) {}
        if (_jspx_page_context != null) _jspx_page_context.handlePageException(t);
        else log(t.getMessage(), t);
      }
    } finally {
      _jspxFactory.releasePageContext(_jspx_page_context);
    }
  }

  private boolean _jspx_meth_c_005furl_005f0(PageContext _jspx_page_context)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  c:url
    org.apache.taglibs.standard.tag.rt.core.UrlTag _jspx_th_c_005furl_005f0 = (org.apache.taglibs.standard.tag.rt.core.UrlTag) _005fjspx_005ftagPool_005fc_005furl_0026_005fvar_005fvalue_005fnobody.get(org.apache.taglibs.standard.tag.rt.core.UrlTag.class);
    _jspx_th_c_005furl_005f0.setPageContext(_jspx_page_context);
    _jspx_th_c_005furl_005f0.setParent(null);
    // /WEB-INF/jsps/defaultEntryPoint.jsp(93,0) name = var type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005furl_005f0.setVar("baseUrl");
    // /WEB-INF/jsps/defaultEntryPoint.jsp(93,0) name = value type = null reqTime = true required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005furl_005f0.setValue("/");
    int _jspx_eval_c_005furl_005f0 = _jspx_th_c_005furl_005f0.doStartTag();
    if (_jspx_th_c_005furl_005f0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
      _005fjspx_005ftagPool_005fc_005furl_0026_005fvar_005fvalue_005fnobody.reuse(_jspx_th_c_005furl_005f0);
      return true;
    }
    _005fjspx_005ftagPool_005fc_005furl_0026_005fvar_005fvalue_005fnobody.reuse(_jspx_th_c_005furl_005f0);
    return false;
  }

  private boolean _jspx_meth_c_005furl_005f1(PageContext _jspx_page_context)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  c:url
    org.apache.taglibs.standard.tag.rt.core.UrlTag _jspx_th_c_005furl_005f1 = (org.apache.taglibs.standard.tag.rt.core.UrlTag) _005fjspx_005ftagPool_005fc_005furl_0026_005fvar_005fvalue_005fnobody.get(org.apache.taglibs.standard.tag.rt.core.UrlTag.class);
    _jspx_th_c_005furl_005f1.setPageContext(_jspx_page_context);
    _jspx_th_c_005furl_005f1.setParent(null);
    // /WEB-INF/jsps/defaultEntryPoint.jsp(94,0) name = var type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005furl_005f1.setVar("contentUrl");
    // /WEB-INF/jsps/defaultEntryPoint.jsp(94,0) name = value type = null reqTime = true required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005furl_005f1.setValue((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("/static/${versionStr}/", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
    int _jspx_eval_c_005furl_005f1 = _jspx_th_c_005furl_005f1.doStartTag();
    if (_jspx_th_c_005furl_005f1.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
      _005fjspx_005ftagPool_005fc_005furl_0026_005fvar_005fvalue_005fnobody.reuse(_jspx_th_c_005furl_005f1);
      return true;
    }
    _005fjspx_005ftagPool_005fc_005furl_0026_005fvar_005fvalue_005fnobody.reuse(_jspx_th_c_005furl_005f1);
    return false;
  }

  private boolean _jspx_meth_c_005furl_005f2(PageContext _jspx_page_context)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  c:url
    org.apache.taglibs.standard.tag.rt.core.UrlTag _jspx_th_c_005furl_005f2 = (org.apache.taglibs.standard.tag.rt.core.UrlTag) _005fjspx_005ftagPool_005fc_005furl_0026_005fvar_005fvalue_005fnobody.get(org.apache.taglibs.standard.tag.rt.core.UrlTag.class);
    _jspx_th_c_005furl_005f2.setPageContext(_jspx_page_context);
    _jspx_th_c_005furl_005f2.setParent(null);
    // /WEB-INF/jsps/defaultEntryPoint.jsp(95,0) name = var type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005furl_005f2.setVar("favIconUrl");
    // /WEB-INF/jsps/defaultEntryPoint.jsp(95,0) name = value type = null reqTime = true required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005furl_005f2.setValue((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("/static/${versionStr}/images/uDeploy.ico", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
    int _jspx_eval_c_005furl_005f2 = _jspx_th_c_005furl_005f2.doStartTag();
    if (_jspx_th_c_005furl_005f2.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
      _005fjspx_005ftagPool_005fc_005furl_0026_005fvar_005fvalue_005fnobody.reuse(_jspx_th_c_005furl_005f2);
      return true;
    }
    _005fjspx_005ftagPool_005fc_005furl_0026_005fvar_005fvalue_005fnobody.reuse(_jspx_th_c_005furl_005f2);
    return false;
  }

  private boolean _jspx_meth_c_005furl_005f3(PageContext _jspx_page_context)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  c:url
    org.apache.taglibs.standard.tag.rt.core.UrlTag _jspx_th_c_005furl_005f3 = (org.apache.taglibs.standard.tag.rt.core.UrlTag) _005fjspx_005ftagPool_005fc_005furl_0026_005fvar_005fvalue_005fnobody.get(org.apache.taglibs.standard.tag.rt.core.UrlTag.class);
    _jspx_th_c_005furl_005f3.setPageContext(_jspx_page_context);
    _jspx_th_c_005furl_005f3.setParent(null);
    // /WEB-INF/jsps/defaultEntryPoint.jsp(96,0) name = var type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005furl_005f3.setVar("navigationUrl");
    // /WEB-INF/jsps/defaultEntryPoint.jsp(96,0) name = value type = null reqTime = true required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005furl_005f3.setValue("/rest/navigation");
    int _jspx_eval_c_005furl_005f3 = _jspx_th_c_005furl_005f3.doStartTag();
    if (_jspx_th_c_005furl_005f3.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
      _005fjspx_005ftagPool_005fc_005furl_0026_005fvar_005fvalue_005fnobody.reuse(_jspx_th_c_005furl_005f3);
      return true;
    }
    _005fjspx_005ftagPool_005fc_005furl_0026_005fvar_005fvalue_005fnobody.reuse(_jspx_th_c_005furl_005f3);
    return false;
  }

  private boolean _jspx_meth_c_005fimport_005f0(PageContext _jspx_page_context)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  c:import
    org.apache.taglibs.standard.tag.rt.core.ImportTag _jspx_th_c_005fimport_005f0 = (org.apache.taglibs.standard.tag.rt.core.ImportTag) _005fjspx_005ftagPool_005fc_005fimport_0026_005furl.get(org.apache.taglibs.standard.tag.rt.core.ImportTag.class);
    _jspx_th_c_005fimport_005f0.setPageContext(_jspx_page_context);
    _jspx_th_c_005fimport_005f0.setParent(null);
    // /WEB-INF/jsps/defaultEntryPoint.jsp(109,4) name = url type = null reqTime = true required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005fimport_005f0.setUrl("/WEB-INF/jsps/snippets/importResources.jsp");
    int[] _jspx_push_body_count_c_005fimport_005f0 = new int[] { 0 };
    try {
      int _jspx_eval_c_005fimport_005f0 = _jspx_th_c_005fimport_005f0.doStartTag();
      if (_jspx_eval_c_005fimport_005f0 != javax.servlet.jsp.tagext.Tag.SKIP_BODY) {
        if (_jspx_eval_c_005fimport_005f0 != javax.servlet.jsp.tagext.Tag.EVAL_BODY_INCLUDE) {
          out = _jspx_page_context.pushBody();
          _jspx_push_body_count_c_005fimport_005f0[0]++;
          _jspx_th_c_005fimport_005f0.setBodyContent((javax.servlet.jsp.tagext.BodyContent) out);
          _jspx_th_c_005fimport_005f0.doInitBody();
        }
        do {
          if (_jspx_meth_c_005fparam_005f0(_jspx_th_c_005fimport_005f0, _jspx_page_context, _jspx_push_body_count_c_005fimport_005f0))
            return true;
          int evalDoAfterBody = _jspx_th_c_005fimport_005f0.doAfterBody();
          if (evalDoAfterBody != javax.servlet.jsp.tagext.BodyTag.EVAL_BODY_AGAIN)
            break;
        } while (true);
        if (_jspx_eval_c_005fimport_005f0 != javax.servlet.jsp.tagext.Tag.EVAL_BODY_INCLUDE) {
          out = _jspx_page_context.popBody();
          _jspx_push_body_count_c_005fimport_005f0[0]--;
        }
      }
      if (_jspx_th_c_005fimport_005f0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
        return true;
      }
    } catch (Throwable _jspx_exception) {
      while (_jspx_push_body_count_c_005fimport_005f0[0]-- > 0)
        out = _jspx_page_context.popBody();
      _jspx_th_c_005fimport_005f0.doCatch(_jspx_exception);
    } finally {
      _jspx_th_c_005fimport_005f0.doFinally();
      _005fjspx_005ftagPool_005fc_005fimport_0026_005furl.reuse(_jspx_th_c_005fimport_005f0);
    }
    return false;
  }

  private boolean _jspx_meth_c_005fparam_005f0(javax.servlet.jsp.tagext.JspTag _jspx_th_c_005fimport_005f0, PageContext _jspx_page_context, int[] _jspx_push_body_count_c_005fimport_005f0)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  c:param
    org.apache.taglibs.standard.tag.rt.core.ParamTag _jspx_th_c_005fparam_005f0 = (org.apache.taglibs.standard.tag.rt.core.ParamTag) _005fjspx_005ftagPool_005fc_005fparam_0026_005fvalue_005fname_005fnobody.get(org.apache.taglibs.standard.tag.rt.core.ParamTag.class);
    _jspx_th_c_005fparam_005f0.setPageContext(_jspx_page_context);
    _jspx_th_c_005fparam_005f0.setParent((javax.servlet.jsp.tagext.Tag) _jspx_th_c_005fimport_005f0);
    // /WEB-INF/jsps/defaultEntryPoint.jsp(110,8) name = name type = null reqTime = true required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005fparam_005f0.setName("isRTL");
    // /WEB-INF/jsps/defaultEntryPoint.jsp(110,8) name = value type = null reqTime = true required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005fparam_005f0.setValue((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${isRTL}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
    int _jspx_eval_c_005fparam_005f0 = _jspx_th_c_005fparam_005f0.doStartTag();
    if (_jspx_th_c_005fparam_005f0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
      _005fjspx_005ftagPool_005fc_005fparam_0026_005fvalue_005fname_005fnobody.reuse(_jspx_th_c_005fparam_005f0);
      return true;
    }
    _005fjspx_005ftagPool_005fc_005fparam_0026_005fvalue_005fname_005fnobody.reuse(_jspx_th_c_005fparam_005f0);
    return false;
  }
}
