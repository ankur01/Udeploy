package org.apache.jsp.WEB_002dINF.jsps;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import com.urbancode.commons.webext.util.InstalledVersion;
import com.urbancode.ds.ServerConstants;
import com.urbancode.air.i18n.TranslateUtil;

public final class login_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {

static private org.apache.jasper.runtime.ProtectedFunctionMapper _jspx_fnmap_0;

static {
  _jspx_fnmap_0= org.apache.jasper.runtime.ProtectedFunctionMapper.getMapForFunction("fn:escapeXml", org.apache.taglibs.standard.functions.Functions.class, "escapeXml", new Class[] {java.lang.String.class});
}

  private static final JspFactory _jspxFactory = JspFactory.getDefaultFactory();

  private static java.util.List _jspx_dependants;

  private org.apache.jasper.runtime.TagHandlerPool _005fjspx_005ftagPool_005fc_005fimport_0026_005furl_005fnobody;
  private org.apache.jasper.runtime.TagHandlerPool _005fjspx_005ftagPool_005fc_005furl_0026_005fvar_005fvalue_005fnobody;
  private org.apache.jasper.runtime.TagHandlerPool _005fjspx_005ftagPool_005fc_005fset_0026_005fvar_005fvalue_005fnobody;
  private org.apache.jasper.runtime.TagHandlerPool _005fjspx_005ftagPool_005fc_005fif_0026_005ftest;

  private javax.el.ExpressionFactory _el_expressionfactory;
  private org.apache.AnnotationProcessor _jsp_annotationprocessor;

  public Object getDependants() {
    return _jspx_dependants;
  }

  public void _jspInit() {
    _005fjspx_005ftagPool_005fc_005fimport_0026_005furl_005fnobody = org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool(getServletConfig());
    _005fjspx_005ftagPool_005fc_005furl_0026_005fvar_005fvalue_005fnobody = org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool(getServletConfig());
    _005fjspx_005ftagPool_005fc_005fset_0026_005fvar_005fvalue_005fnobody = org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool(getServletConfig());
    _005fjspx_005ftagPool_005fc_005fif_0026_005ftest = org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool(getServletConfig());
    _el_expressionfactory = _jspxFactory.getJspApplicationContext(getServletConfig().getServletContext()).getExpressionFactory();
    _jsp_annotationprocessor = (org.apache.AnnotationProcessor) getServletConfig().getServletContext().getAttribute(org.apache.AnnotationProcessor.class.getName());
  }

  public void _jspDestroy() {
    _005fjspx_005ftagPool_005fc_005fimport_0026_005furl_005fnobody.release();
    _005fjspx_005ftagPool_005fc_005furl_0026_005fvar_005fvalue_005fnobody.release();
    _005fjspx_005ftagPool_005fc_005fset_0026_005fvar_005fvalue_005fnobody.release();
    _005fjspx_005ftagPool_005fc_005fif_0026_005ftest.release();
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
  pageContext.setAttribute("webAppVersion", versionStr);
  pageContext.setAttribute("productName", ServerConstants.PRODUCT_NAME_NORMAL);

  String loginErrorMsg = (String)pageContext.getSession().getAttribute("loginErrorMsg");
  pageContext.setAttribute("loginErrorMsg", loginErrorMsg);

      out.write("<!DOCTYPE html>\n");
      out.write("<html class=\"fullHeight\">\n");
      out.write("  <head>\n");
      out.write("    <title>");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${productName}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write(':');
      out.write(' ');
      out.print( TranslateUtil.getInstance().getValue("Log In") );
      out.write("</title>\n");
      out.write("    \n");
      out.write("    ");
      if (_jspx_meth_c_005fimport_005f0(_jspx_page_context))
        return;
      if (_jspx_meth_c_005furl_005f0(_jspx_page_context))
        return;
      if (_jspx_meth_c_005fset_005f0(_jspx_page_context))
        return;
      out.write("<link rel=\"shortcut icon\" href=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${staticBase}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("/images/uDeploy.ico\"/>\n");
      out.write("    <link rel=\"stylesheet\" type=\"text/css\" href=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${webextBase}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("css/webext/login.css\" />\n");
      out.write("\n");
      out.write("    <script type=\"text/javascript\">\n");
      out.write("    /* <![CDATA[ */\n");
      out.write("      require([\"dojo/ready\",\n");
      out.write("               \"dojo/dom-class\",\n");
      out.write("               \"dijit/form/TextBox\",\n");
      out.write("               \"dijit/form/CheckBox\",\n");
      out.write("               \"dijit/form/Button\"],\n");
      out.write("              function(\n");
      out.write("                      ready,\n");
      out.write("                      domClass,\n");
      out.write("                      TextBox,\n");
      out.write("                      CheckBox,\n");
      out.write("                      Button) {\n");
      out.write("        ready(function () {\n");
      out.write("            var usernameInput = new TextBox({\n");
      out.write("                name: \"username\",\n");
      out.write("                placeHolder: \"");
      out.print( TranslateUtil.getInstance().getValue("User name") );
      out.write("\"\n");
      out.write("            }, \"usernameField\");\n");
      out.write("            var usernameInput = new TextBox({\n");
      out.write("                name: \"password\",\n");
      out.write("                type: \"password\",\n");
      out.write("                placeHolder: \"");
      out.print( TranslateUtil.getInstance().getValue("Password") );
      out.write("\"\n");
      out.write("            }, \"passwordField\");\n");
      out.write("            var rememberMeInput = new CheckBox({\n");
      out.write("                name: \"rememberMe\",\n");
      out.write("                value: \"true\"\n");
      out.write("            }, \"rememberMe\");\n");
      out.write("            var submitButton = new Button({\n");
      out.write("                label: \"");
      out.print( TranslateUtil.getInstance().getValue("Log in") );
      out.write("\",\n");
      out.write("                type: \"submit\",\n");
      out.write("                style: {\n");
      out.write("                    marginLeft: \"0px\"\n");
      out.write("                }\n");
      out.write("            }, \"submitButton\");\n");
      out.write("            domClass.add(submitButton.domNode, \"idxButtonSpecial\");\n");
      out.write("\n");
      out.write("            document.getElementById(\"requestedHash\").value = window.location.hash;\n");
      out.write("        });\n");
      out.write("      });\n");
      out.write("    /* ]]> */\n");
      out.write("    </script>\n");
      out.write("  </head>\n");
      out.write("  <body class=\"oneui loginPage fullHeight\">\n");
      out.write("    <div class=\"idxHeaderContainer\">\n");
      out.write("      <div class=\"idxHeaderBlueLip\"></div>\n");
      out.write("    </div>\n");
      out.write("    \n");
      out.write("    <div class=\"loginFramePositioner\">\n");
      out.write("      <div class=\"loginFrame\">\n");
      out.write("      \n");
      out.write("        <span class=\"productName\">UrbanCode Deploy</span>, \n");
      out.write("        <span class=\"productVersion\">");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${webAppVersion}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("</span>\n");
      out.write("\n");
      out.write("        <div class=\"formSpacer\"></div>\n");
      out.write("        <div class=\"formSpacer\"></div>\n");
      out.write("\n");
      out.write("        ");
      if (_jspx_meth_c_005furl_005f1(_jspx_page_context))
        return;
      out.write("<form method=\"post\" action=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${fn:escapeXml(authenticateUrl)}", java.lang.String.class, (PageContext)_jspx_page_context, _jspx_fnmap_0, false));
      out.write("\" autocomplete=\"off\">\n");
      out.write("          ");
      if (_jspx_meth_c_005fif_005f0(_jspx_page_context))
        return;
      out.write("<div id=\"usernameField\"></div>\n");
      out.write("          \n");
      out.write("          <div class=\"formSpacer\"></div>\n");
      out.write("          <div class=\"formSpacer\"></div>\n");
      out.write("          \n");
      out.write("          <div id=\"passwordField\"></div>\n");
      out.write("\n");
      out.write("          <div class=\"formSpacer\"></div>\n");
      out.write("          <div class=\"formSpacer\"></div>\n");
      out.write("          \n");
      out.write("          <div id=\"rememberMe\"></div>\n");
      out.write("          <label for=\"rememberMe\">");
      out.print( TranslateUtil.getInstance().getValue("Keep me logged in") );
      out.write("</label>\n");
      out.write("\n");
      out.write("          <div class=\"formSpacer\"></div>\n");
      out.write("          <div class=\"formSpacer\"></div>\n");
      out.write("          \n");
      out.write("          <div id=\"submitButton\" class=\"idxButtonSpecial\"></div>\n");
      out.write("          <input type=\"hidden\" name=\"requestedHash\" value=\"\" id=\"requestedHash\"/>\n");
      out.write("\n");
      out.write("          <div class=\"formSpacer\"></div>\n");
      out.write("          <div class=\"formSpacer\"></div>\n");
      out.write("          <div class=\"formSpacer\"></div>\n");
      out.write("\n");
      out.write("          <div class=\"legal\">\n");
      out.write("            ");
      out.print( TranslateUtil.getInstance().getValue("&copy; Copyright 2015 &nbsp;IBM Corporation.") );
      out.write("</div>\n");
      out.write("        </form>\n");
      out.write("      </div>\n");
      out.write("    </div>\n");
      out.write("  </body>\n");
      out.write("</html>\n");
      out.write("\n");
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

  private boolean _jspx_meth_c_005fimport_005f0(PageContext _jspx_page_context)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  c:import
    org.apache.taglibs.standard.tag.rt.core.ImportTag _jspx_th_c_005fimport_005f0 = (org.apache.taglibs.standard.tag.rt.core.ImportTag) _005fjspx_005ftagPool_005fc_005fimport_0026_005furl_005fnobody.get(org.apache.taglibs.standard.tag.rt.core.ImportTag.class);
    _jspx_th_c_005fimport_005f0.setPageContext(_jspx_page_context);
    _jspx_th_c_005fimport_005f0.setParent(null);
    // /WEB-INF/jsps/login.jsp(41,4) name = url type = null reqTime = true required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005fimport_005f0.setUrl("/WEB-INF/jsps/snippets/importResources.jsp");
    int[] _jspx_push_body_count_c_005fimport_005f0 = new int[] { 0 };
    try {
      int _jspx_eval_c_005fimport_005f0 = _jspx_th_c_005fimport_005f0.doStartTag();
      if (_jspx_th_c_005fimport_005f0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
        return true;
      }
    } catch (Throwable _jspx_exception) {
      while (_jspx_push_body_count_c_005fimport_005f0[0]-- > 0)
        out = _jspx_page_context.popBody();
      _jspx_th_c_005fimport_005f0.doCatch(_jspx_exception);
    } finally {
      _jspx_th_c_005fimport_005f0.doFinally();
      _005fjspx_005ftagPool_005fc_005fimport_0026_005furl_005fnobody.reuse(_jspx_th_c_005fimport_005f0);
    }
    return false;
  }

  private boolean _jspx_meth_c_005furl_005f0(PageContext _jspx_page_context)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  c:url
    org.apache.taglibs.standard.tag.rt.core.UrlTag _jspx_th_c_005furl_005f0 = (org.apache.taglibs.standard.tag.rt.core.UrlTag) _005fjspx_005ftagPool_005fc_005furl_0026_005fvar_005fvalue_005fnobody.get(org.apache.taglibs.standard.tag.rt.core.UrlTag.class);
    _jspx_th_c_005furl_005f0.setPageContext(_jspx_page_context);
    _jspx_th_c_005furl_005f0.setParent(null);
    // /WEB-INF/jsps/login.jsp(43,4) name = var type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005furl_005f0.setVar("staticBase");
    // /WEB-INF/jsps/login.jsp(43,4) name = value type = null reqTime = true required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005furl_005f0.setValue((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("/static/${fn:escapeXml(webAppVersion)}", java.lang.String.class, (PageContext)_jspx_page_context, _jspx_fnmap_0, false));
    int _jspx_eval_c_005furl_005f0 = _jspx_th_c_005furl_005f0.doStartTag();
    if (_jspx_th_c_005furl_005f0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
      _005fjspx_005ftagPool_005fc_005furl_0026_005fvar_005fvalue_005fnobody.reuse(_jspx_th_c_005furl_005f0);
      return true;
    }
    _005fjspx_005ftagPool_005fc_005furl_0026_005fvar_005fvalue_005fnobody.reuse(_jspx_th_c_005furl_005f0);
    return false;
  }

  private boolean _jspx_meth_c_005fset_005f0(PageContext _jspx_page_context)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  c:set
    org.apache.taglibs.standard.tag.rt.core.SetTag _jspx_th_c_005fset_005f0 = (org.apache.taglibs.standard.tag.rt.core.SetTag) _005fjspx_005ftagPool_005fc_005fset_0026_005fvar_005fvalue_005fnobody.get(org.apache.taglibs.standard.tag.rt.core.SetTag.class);
    _jspx_th_c_005fset_005f0.setPageContext(_jspx_page_context);
    _jspx_th_c_005fset_005f0.setParent(null);
    // /WEB-INF/jsps/login.jsp(44,4) name = var type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005fset_005f0.setVar("webextBase");
    // /WEB-INF/jsps/login.jsp(44,4) name = value type = null reqTime = true required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005fset_005f0.setValue((java.lang.Object) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${staticBase}/lib/webext/", java.lang.Object.class, (PageContext)_jspx_page_context, null, false));
    int _jspx_eval_c_005fset_005f0 = _jspx_th_c_005fset_005f0.doStartTag();
    if (_jspx_th_c_005fset_005f0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
      _005fjspx_005ftagPool_005fc_005fset_0026_005fvar_005fvalue_005fnobody.reuse(_jspx_th_c_005fset_005f0);
      return true;
    }
    _005fjspx_005ftagPool_005fc_005fset_0026_005fvar_005fvalue_005fnobody.reuse(_jspx_th_c_005fset_005f0);
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
    // /WEB-INF/jsps/login.jsp(105,8) name = var type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005furl_005f1.setVar("authenticateUrl");
    // /WEB-INF/jsps/login.jsp(105,8) name = value type = null reqTime = true required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005furl_005f1.setValue("/tasks/LoginTasks/login");
    int _jspx_eval_c_005furl_005f1 = _jspx_th_c_005furl_005f1.doStartTag();
    if (_jspx_th_c_005furl_005f1.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
      _005fjspx_005ftagPool_005fc_005furl_0026_005fvar_005fvalue_005fnobody.reuse(_jspx_th_c_005furl_005f1);
      return true;
    }
    _005fjspx_005ftagPool_005fc_005furl_0026_005fvar_005fvalue_005fnobody.reuse(_jspx_th_c_005furl_005f1);
    return false;
  }

  private boolean _jspx_meth_c_005fif_005f0(PageContext _jspx_page_context)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  c:if
    org.apache.taglibs.standard.tag.rt.core.IfTag _jspx_th_c_005fif_005f0 = (org.apache.taglibs.standard.tag.rt.core.IfTag) _005fjspx_005ftagPool_005fc_005fif_0026_005ftest.get(org.apache.taglibs.standard.tag.rt.core.IfTag.class);
    _jspx_th_c_005fif_005f0.setPageContext(_jspx_page_context);
    _jspx_th_c_005fif_005f0.setParent(null);
    // /WEB-INF/jsps/login.jsp(107,10) name = test type = boolean reqTime = true required = true fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005fif_005f0.setTest(((java.lang.Boolean) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${loginErrorMsg != null}", java.lang.Boolean.class, (PageContext)_jspx_page_context, null, false)).booleanValue());
    int _jspx_eval_c_005fif_005f0 = _jspx_th_c_005fif_005f0.doStartTag();
    if (_jspx_eval_c_005fif_005f0 != javax.servlet.jsp.tagext.Tag.SKIP_BODY) {
      do {
        out.write("<div class=\"loginError\">\n");
        out.write("              <p>\n");
        out.write("                <span class=\"error\">");
        out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${loginErrorMsg}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
        out.write("</span>\n");
        out.write("              </p>\n");
        out.write("            </div>\n");
        out.write("          ");
        int evalDoAfterBody = _jspx_th_c_005fif_005f0.doAfterBody();
        if (evalDoAfterBody != javax.servlet.jsp.tagext.BodyTag.EVAL_BODY_AGAIN)
          break;
      } while (true);
    }
    if (_jspx_th_c_005fif_005f0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
      _005fjspx_005ftagPool_005fc_005fif_0026_005ftest.reuse(_jspx_th_c_005fif_005f0);
      return true;
    }
    _005fjspx_005ftagPool_005fc_005fif_0026_005ftest.reuse(_jspx_th_c_005fif_005f0);
    return false;
  }
}
