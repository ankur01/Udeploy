//>>built
define("idx/mobile/deviceTheme",["dijit","dojo","dojox"],function(){("undefined"===typeof define?function(e,a){a()}:define)(["dojo/_base/config","dojo/_base/lang","dojo/_base/window","require"],function(e,a,f,o){var d=a&&a.getObject("dojox.mobile",!0)||{},a=new function(){if(!f)f=window,f.doc=document,f._no_dojo_dm=d;e=e||f.mblConfig||{};for(var a=f.doc.getElementsByTagName("script"),l=0;l<a.length;l++){var m=a[l],k=m.getAttribute("src")||"";if(k.match(/\/deviceTheme\.js/i)){e.baseUrl=k.replace("deviceTheme.js",
"../../dojo/");if(a=m.getAttribute("data-dojo-config")||m.getAttribute("djConfig")){var a=eval("({ "+a+" })"),n;for(n in a)e[n]=a[n]}break}else if(k.match(/\/dojo\.js/i)){e.baseUrl=k.replace("dojo.js","");break}}this.loadCssFile=function(a){var c=f.doc.createElement("link");c.href=a;c.type="text/css";c.rel="stylesheet";a=f.doc.getElementsByTagName("head")[0];a.insertBefore(c,a.firstChild);d.loadedCssFiles.unshift(c)};this.toUrl=function(a){return o?o.toUrl(a):e.baseUrl+"../"+a};this.setDm=function(a){d=
a};this.themeMap=e.themeMap||[["Android","oneui_android",[]],["iPhone","oneui_ios",[]],["iPad","oneui_ios",[]],[".*","oneui_ios",[]]];d.loadedCssFiles=[];this.loadDeviceTheme=function(a){var c=e.mblThemeFiles||d.themeFiles||["@theme"],g,b;b=this.themeMap;var i=a||e.mblUserAgent||(location.search.match(/theme=(\w+)/)?RegExp.$1:navigator.userAgent);for(g=0;g<b.length;g++)if(i.match(RegExp(b[g][0]))){var i=b[g][1],j=f.doc.documentElement.className,j=j.replace(RegExp(" *"+d.currentTheme+"_theme"),"")+
" "+i+"_theme";f.doc.documentElement.className=j;d.currentTheme=i;g=[].concat(b[g][2]);for(b=0;b<c.length;b++){var h=c[b]instanceof Array||"array"==typeof c[b];!h&&-1!==c[b].indexOf("/")?j=c[b]:(j=h?(c[b][0]||"").replace(/\./g,"/"):"idx/mobile",h=(h?c[b][1]:c[b]).replace(/\./g,"/"),h="themes/"+i+"/"+("@theme"===h?i:0<=h.indexOf("/")||"idx/mobile"!==j?h:"dojox/"+h)+".css",j=j+"/"+h);g.unshift(this.toUrl(j))}for(c=0;c<d.loadedCssFiles.length;c++)i=d.loadedCssFiles[c],i.parentNode.removeChild(i);d.loadedCssFiles=
[];for(b=g.length-1;0<=b;b--)this.loadCssFile(g[b].toString());a&&d.loadCompatCssFiles&&d.loadCompatCssFiles();break}}};a.loadDeviceTheme();return window.deviceTheme=d.deviceTheme=a})});