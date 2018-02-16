package org.apache.jsp.WEB_002dINF.jsps.snippets;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import com.urbancode.commons.webext.util.InstalledVersion;
import com.urbancode.ds.subsys.system.SystemConfiguration;
import com.urbancode.air.i18n.TranslateUtil;

public final class importResources_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {

static private org.apache.jasper.runtime.ProtectedFunctionMapper _jspx_fnmap_0;

static {
  _jspx_fnmap_0= org.apache.jasper.runtime.ProtectedFunctionMapper.getMapForFunction("ah3:toJson", com.urbancode.anthill3.web.functions.Functions.class, "toJson", new Class[] {java.lang.Object.class});
}

  private static final JspFactory _jspxFactory = JspFactory.getDefaultFactory();

  private static java.util.List _jspx_dependants;

  private org.apache.jasper.runtime.TagHandlerPool _005fjspx_005ftagPool_005fc_005furl_0026_005fvar_005fvalue_005fnobody;
  private org.apache.jasper.runtime.TagHandlerPool _005fjspx_005ftagPool_005fc_005fset_0026_005fvar_005fvalue_005fnobody;

  private javax.el.ExpressionFactory _el_expressionfactory;
  private org.apache.AnnotationProcessor _jsp_annotationprocessor;

  public Object getDependants() {
    return _jspx_dependants;
  }

  public void _jspInit() {
    _005fjspx_005ftagPool_005fc_005furl_0026_005fvar_005fvalue_005fnobody = org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool(getServletConfig());
    _005fjspx_005ftagPool_005fc_005fset_0026_005fvar_005fvalue_005fnobody = org.apache.jasper.runtime.TagHandlerPool.getTagHandlerPool(getServletConfig());
    _el_expressionfactory = _jspxFactory.getJspApplicationContext(getServletConfig().getServletContext()).getExpressionFactory();
    _jsp_annotationprocessor = (org.apache.AnnotationProcessor) getServletConfig().getServletContext().getAttribute(org.apache.AnnotationProcessor.class.getName());
  }

  public void _jspDestroy() {
    _005fjspx_005ftagPool_005fc_005furl_0026_005fvar_005fvalue_005fnobody.release();
    _005fjspx_005ftagPool_005fc_005fset_0026_005fvar_005fvalue_005fnobody.release();
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

      if (_jspx_meth_c_005furl_005f0(_jspx_page_context))
        return;
      if (_jspx_meth_c_005fset_005f0(_jspx_page_context))
        return;
      if (_jspx_meth_c_005fset_005f1(_jspx_page_context))
        return;
      if (_jspx_meth_c_005fset_005f2(_jspx_page_context))
        return;
      if (_jspx_meth_c_005fset_005f3(_jspx_page_context))
        return;
      out.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${dojoBase}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("dojo/resources/dojo.css\"/>\n");
      out.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${dojoBase}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("dijit/themes/dijit.css\"/>\n");
      out.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${dojoBase}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("dijit/themes/dijit_rtl.css\"/>\n");
      out.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${contentBase}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("lib/idx/themes/oneui/oneui.css\"/>\n");
      out.write("\n");
      out.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${dojoBase}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("dojox/form/resources/CheckedMultiSelect.css\" />\n");
      out.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${dojoBase}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("dojox/layout/resources/ResizeHandle.css\" />\n");
      out.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${dojoBase}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("dojox/widget/Wizard/Wizard.css\" />\n");
      out.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${webextBase}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("css/webext/webext-common.css\"/>\n");
      out.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${webextBase}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("css/webext/webext-widgets.css\"/>\n");
      out.write("\n");
      out.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${contentBase}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("css/deploy/icons.css\" />\n");
      out.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${contentBase}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("css/deploy/udeploy.css\" />\n");
      out.write("\n");
 if ("true".equals(request.getParameter("isRTL"))) { 
      out.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${webextBase}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("/css/webext/webext-common_rtl.css\"/>\n");
      out.write("    <link rel=\"stylesheet\" type=\"text/css\" href=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${webextBase}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("/css/webext/webext-widgets_rtl.css\"/>\n");
      out.write("    <link rel=\"stylesheet\" type=\"text/css\" href=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${contentBase}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("/css/deploy/icons_rtl.css\" />\n");
      out.write("    <link rel=\"stylesheet\" type=\"text/css\" href=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${contentBase}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("/css/deploy/udeploy_rtl.css\" />\n");
 } 
      out.write("<!--[if IE]>\n");
      out.write("<script type=\"text/javascript\">\n");
      out.write("  if ((\"undefined\" !== typeof JSON)\n");
      out.write("          && (JSON.stringify(document.createElement(\"input\").value)!== '\"\"' ) ) {\n");
      out.write("      var _stringify = JSON.stringify;\n");
      out.write("      JSON.stringify = function(o, f, s) {\n");
      out.write("          var replacer = function(key, value) {\n");
      out.write("              if (value === \"\" ) {\n");
      out.write("                  // Fix IE8 stringify bug for input values\n");
      out.write("                  return \"\";\n");
      out.write("              }\n");
      out.write("              // normal behavior\n");
      out.write("              return f ? f(key,value) : value;\n");
      out.write("          }\n");
      out.write("          return _stringify(o, replacer, s);\n");
      out.write("      }\n");
      out.write("  }\n");
      out.write("</script>\n");
      out.write("<![endif]-->\n");
      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("<script type=\"text/javascript\">\n");
      out.write("    mxBasePath = \"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${contentBase}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("lib/mxgraph\";\n");
      out.write("\n");
      out.write("    var defaultLocale = ");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${ah3:toJson(locale)}", java.lang.String.class, (PageContext)_jspx_page_context, _jspx_fnmap_0, false));
      out.write(";\n");
      out.write("    if (defaultLocale === \"en_US\") {\n");
      out.write("        defaultLocale = \"en\";\n");
      out.write("    }\n");
      out.write("    defaultLocale = defaultLocale.toLowerCase();\n");
      out.write("    defaultLocale = defaultLocale.replace(/_/g, '-');\n");
      out.write("\n");
      out.write("    var dojoConfig = {\n");
      out.write("        async: true,\n");
      out.write("        baseUrl: \"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${dojoBase}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("dojo\",\n");
      out.write("        bindEncoding: \"UTF-8\",\n");
      out.write("        isDebug: ");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${ah3:toJson(versionStr == 'dev')}", java.lang.String.class, (PageContext)_jspx_page_context, _jspx_fnmap_0, false));
      out.write(",\n");
      out.write("        locale: defaultLocale,\n");
      out.write("        parseOnLoad: true,\n");
      out.write("        paths: {\n");
      out.write("            \"js\": ");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${ah3:toJson(webextBase)}", java.lang.String.class, (PageContext)_jspx_page_context, _jspx_fnmap_0, false));
      out.write("+\"js\",\n");
      out.write("            \"idx\": ");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${ah3:toJson(contentBase)}", java.lang.String.class, (PageContext)_jspx_page_context, _jspx_fnmap_0, false));
      out.write("+\"lib/idx\",\n");
      out.write("            \"deploy\": ");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${ah3:toJson(contentBase)}", java.lang.String.class, (PageContext)_jspx_page_context, _jspx_fnmap_0, false));
      out.write("+\"js/deploy\"\n");
      out.write("        }\n");
      out.write("    };\n");
      out.write("</script>\n");

  if (debug) {

      out.write("<script type=\"text/javascript\" src=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${dojoBase}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("dojo/dojo.js\"></script>\n");

  }
  else {

      out.write("<script type=\"text/javascript\" src=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${contentBase}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("ucdjs-pack.js\"></script>\n");

  }

      out.write("<script type=\"text/javascript\" src=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${contentBase}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("lib/mxgraph/js/mxClient.js\"></script>\n");
      out.write("<script type=\"text/javascript\" src=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${contentBase}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("lib/ace/ace.js\"></script>\n");
      out.write("<script type=\"text/javascript\" src=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${contentBase}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("js/deploy/mxClientPatch.js\"></script>\n");
      out.write("<script type=\"text/javascript\" src=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${contentBase}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("lib/jquery/jquery-1.7.1.min.js\"></script>\n");
      out.write("<script type=\"text/javascript\" src=\"");
      out.write((java.lang.String) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${contentBase}", java.lang.String.class, (PageContext)_jspx_page_context, null, false));
      out.write("lib/highcharts/js/highcharts.js\"></script>\n");
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
    // /WEB-INF/jsps/snippets/importResources.jsp(42,0) name = var type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005furl_005f0.setVar("baseUrl");
    // /WEB-INF/jsps/snippets/importResources.jsp(42,0) name = value type = null reqTime = true required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005furl_005f0.setValue("/");
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
    // /WEB-INF/jsps/snippets/importResources.jsp(43,0) name = var type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005fset_005f0.setVar("contentBase");
    // /WEB-INF/jsps/snippets/importResources.jsp(43,0) name = value type = null reqTime = true required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005fset_005f0.setValue((java.lang.Object) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${baseUrl}static/${versionStr}/", java.lang.Object.class, (PageContext)_jspx_page_context, null, false));
    int _jspx_eval_c_005fset_005f0 = _jspx_th_c_005fset_005f0.doStartTag();
    if (_jspx_th_c_005fset_005f0.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
      _005fjspx_005ftagPool_005fc_005fset_0026_005fvar_005fvalue_005fnobody.reuse(_jspx_th_c_005fset_005f0);
      return true;
    }
    _005fjspx_005ftagPool_005fc_005fset_0026_005fvar_005fvalue_005fnobody.reuse(_jspx_th_c_005fset_005f0);
    return false;
  }

  private boolean _jspx_meth_c_005fset_005f1(PageContext _jspx_page_context)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  c:set
    org.apache.taglibs.standard.tag.rt.core.SetTag _jspx_th_c_005fset_005f1 = (org.apache.taglibs.standard.tag.rt.core.SetTag) _005fjspx_005ftagPool_005fc_005fset_0026_005fvar_005fvalue_005fnobody.get(org.apache.taglibs.standard.tag.rt.core.SetTag.class);
    _jspx_th_c_005fset_005f1.setPageContext(_jspx_page_context);
    _jspx_th_c_005fset_005f1.setParent(null);
    // /WEB-INF/jsps/snippets/importResources.jsp(44,0) name = var type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005fset_005f1.setVar("cssBase");
    // /WEB-INF/jsps/snippets/importResources.jsp(44,0) name = value type = null reqTime = true required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005fset_005f1.setValue((java.lang.Object) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${contentBase}css/", java.lang.Object.class, (PageContext)_jspx_page_context, null, false));
    int _jspx_eval_c_005fset_005f1 = _jspx_th_c_005fset_005f1.doStartTag();
    if (_jspx_th_c_005fset_005f1.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
      _005fjspx_005ftagPool_005fc_005fset_0026_005fvar_005fvalue_005fnobody.reuse(_jspx_th_c_005fset_005f1);
      return true;
    }
    _005fjspx_005ftagPool_005fc_005fset_0026_005fvar_005fvalue_005fnobody.reuse(_jspx_th_c_005fset_005f1);
    return false;
  }

  private boolean _jspx_meth_c_005fset_005f2(PageContext _jspx_page_context)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  c:set
    org.apache.taglibs.standard.tag.rt.core.SetTag _jspx_th_c_005fset_005f2 = (org.apache.taglibs.standard.tag.rt.core.SetTag) _005fjspx_005ftagPool_005fc_005fset_0026_005fvar_005fvalue_005fnobody.get(org.apache.taglibs.standard.tag.rt.core.SetTag.class);
    _jspx_th_c_005fset_005f2.setPageContext(_jspx_page_context);
    _jspx_th_c_005fset_005f2.setParent(null);
    // /WEB-INF/jsps/snippets/importResources.jsp(45,0) name = var type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005fset_005f2.setVar("webextBase");
    // /WEB-INF/jsps/snippets/importResources.jsp(45,0) name = value type = null reqTime = true required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005fset_005f2.setValue((java.lang.Object) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${contentBase}lib/webext/", java.lang.Object.class, (PageContext)_jspx_page_context, null, false));
    int _jspx_eval_c_005fset_005f2 = _jspx_th_c_005fset_005f2.doStartTag();
    if (_jspx_th_c_005fset_005f2.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
      _005fjspx_005ftagPool_005fc_005fset_0026_005fvar_005fvalue_005fnobody.reuse(_jspx_th_c_005fset_005f2);
      return true;
    }
    _005fjspx_005ftagPool_005fc_005fset_0026_005fvar_005fvalue_005fnobody.reuse(_jspx_th_c_005fset_005f2);
    return false;
  }

  private boolean _jspx_meth_c_005fset_005f3(PageContext _jspx_page_context)
          throws Throwable {
    PageContext pageContext = _jspx_page_context;
    JspWriter out = _jspx_page_context.getOut();
    //  c:set
    org.apache.taglibs.standard.tag.rt.core.SetTag _jspx_th_c_005fset_005f3 = (org.apache.taglibs.standard.tag.rt.core.SetTag) _005fjspx_005ftagPool_005fc_005fset_0026_005fvar_005fvalue_005fnobody.get(org.apache.taglibs.standard.tag.rt.core.SetTag.class);
    _jspx_th_c_005fset_005f3.setPageContext(_jspx_page_context);
    _jspx_th_c_005fset_005f3.setParent(null);
    // /WEB-INF/jsps/snippets/importResources.jsp(46,0) name = var type = java.lang.String reqTime = false required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005fset_005f3.setVar("dojoBase");
    // /WEB-INF/jsps/snippets/importResources.jsp(46,0) name = value type = null reqTime = true required = false fragment = false deferredValue = false expectedTypeName = null deferredMethod = false methodSignature = null
    _jspx_th_c_005fset_005f3.setValue((java.lang.Object) org.apache.jasper.runtime.PageContextImpl.proprietaryEvaluate("${contentBase}lib/dojo/", java.lang.Object.class, (PageContext)_jspx_page_context, null, false));
    int _jspx_eval_c_005fset_005f3 = _jspx_th_c_005fset_005f3.doStartTag();
    if (_jspx_th_c_005fset_005f3.doEndTag() == javax.servlet.jsp.tagext.Tag.SKIP_PAGE) {
      _005fjspx_005ftagPool_005fc_005fset_0026_005fvar_005fvalue_005fnobody.reuse(_jspx_th_c_005fset_005f3);
      return true;
    }
    _005fjspx_005ftagPool_005fc_005fset_0026_005fvar_005fvalue_005fnobody.reuse(_jspx_th_c_005fset_005f3);
    return false;
  }
}
