//>>built
define("idx/app/registry",["dojo/_base/lang","dojox/rpc/Rest","dojox/data/JsonRestStore"],function(d,f,g){var a=d.getObject("idx.app.registry",!0);a.href="./data/registry.json";a.data=null;a.getData=function(){null==a.data&&a.load();return a.data};a.load=function(){var h={service:f(a.href,!0),allowNoTrailingSlash:!0,syncMode:!0};(new g(h)).fetch({onComplete:function(i){var e=function(a){var c=a;if(d.isArray(a)){var c=[],b;for(b in a)d.isString(b)&&"_"==b.charAt(0)||c.push(e(a[b]))}else if(d.isObject(a))for(b in c=
{},a)"_"!=b.charAt(0)&&(c[b]=e(a[b]));return c};a.data=e(i)},onError:function(a){console.error("idx.app.registry.load "+a.message);alert("idx.app.registry.load "+a.message)}})};return a});