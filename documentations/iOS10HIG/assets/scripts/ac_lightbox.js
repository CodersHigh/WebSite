
if(typeof(AC)=="undefined"){AC={}}AC.LightBox=function(a){return this.init(a)};
AC.LightBox.prototype={delegate:{},_cachedContent:{},_currentEvent:null,_triggers:null,_screendoor:null,_overlay:null,_overlayHeight:null,_overlayWidth:null,_closeBtnContainer:null,_currentContent:null,_contentURL:null,_hasCSSTransitions:false,_animationTiming:0,_hasOpacity:false,_hasBoxShadow:false,_isiOS:false,_isContentLoded:false,_isDisplaying:false,_scriptFragment:null,init:function(a){var b={triggerClassName:"ac-lightbox",triggerEvent:"click",touchEvent:"touchstart",useScreenDoor:true,closeText:"Close",screendoorOpacity:"0.8",animateShow:true,animateClose:true,animationDuration:"0.4",animationSteps:4,doesRecenter:true};
if(a&&!(a instanceof String)){for(i in a){b[i]=a[i]}}return this.initializeWithOptions(b)
},initializeWithOptions:function(b){this.options={};this.setOptions(b);this._animationTiming=parseFloat((parseFloat(this.options.animationDuration)/parseFloat(this.options.animationSteps))*1000);
this._hasCSSTransitions=AC.Detector.isCSSAvailable("transition");this._hasBoxShadow=AC.Detector.isCSSAvailable("box-shadow");
this._hasOpacity=(typeof document.documentElement.style.opacity!="undefined")?false:true;
this._isiOS=(AC.Detector.iOSVersion());if(this.options.triggerClassName){this._triggers=document.getElementsByClassName(this.options.triggerClassName);
if(!this._triggers){return this}var a=this;var c=function(d){a.show(d)};for(i=0;
(iTrigger=this._triggers[i]);i++){this._addEvent(iTrigger,this.options.triggerEvent,c);
this._addEvent(iTrigger,this.options.touchEvent,c)}}return this},setOptions:function(a){this.options={};
if(typeof a!="undefined"){for(e in a){this.options[e]=a[e]}}},setDelegate:function(a){if(a&&typeof(a)==="object"){this.delegate=a
}return this.delegate},_createScreendoor:function(){if(!this._screendoor){this._screendoor=document.createElement("div");
this._screendoor.className="lightbox-screendoor";if(this.options.useScreenDoor===false){this.options.screendoorOpacity=0
}else{if(this.options.screendoorColor){this._screendoor.style.backgroundColor=this.options.screendoorColor
}}this._screendoor.style.opacity=this.options.screendoorOpacity;this._screendoor.style["-moz-opacity"]=this.options.screendoorOpacity;
this._screendoor.style.filter="alpha(opacity="+this.options.screendoorOpacity*100+")";
if((this.options.animateShow||this.options.animateClose)&&this._hasCSSTransitions){this._screendoor.setVendorPrefixStyle("transition","opacity "+parseFloat(this.options.animationDuration)+"s ease-out 0s")
}var a=this;var b=function(c){a.close(c)};this._addEvent(this._screendoor,this.options.triggerEvent,b);
document.body.appendChild(this._screendoor)}return true},_createOverlay:function(){if(!this._overlay){this._overlay=document.createElement("div");
this._overlay.className="lightbox-frame";this._overlay.className+=(this._hasBoxShadow)?" lightbox-frame-shadow":" lightbox-frame-border";
if(this.options.overlayWidth){this._overlay.style.width=this.options.overlayWidth
}var a=this;var b=function(c){a.close(c)};this._closeBtnContainer=this._createCloseButton();
this._addEvent(this._closeBtnContainer,this.options.triggerEvent,b);this._overlay.appendChild(this._closeBtnContainer);
if(!this._currentContent){this._currentContent=document.createElement("div")}this._currentContent.className+=" lightbox-content";
this._overlay.appendChild(this._currentContent);if((this.options.animateShow||this.options.animateClose)&&this._hasCSSTransitions){this._overlay.setVendorPrefixStyle("transition","opacity "+this.options.animationDuration+"s ease-out 0s")
}document.body.appendChild(this._overlay)}return true},_createCloseButton:function(){var a,c,b;
a=document.createElement("div");a.className="lightbox-close";c=document.createElement("a");
c.href="#close";c.appendChild(document.createTextNode(this.options.closeText));
a.appendChild(c);if(this.delegate&&typeof(this.delegate.createCloseButton)==="function"){if(b=this.delegate.createCloseButton(a)){if(typeof b==="object"&&(b.nodeType==Node.ELEMENT_NODE||b.nodeType==Node.DOCUMENT_FRAGMENT_NODE)){b.style.position="absolute";
b.style.cursor="pointer";return b}}}return a},_setScreendoorHeight:function(){if(this._screendoor){if(document.documentElement){this._screendoor.style.height=document.documentElement.scrollHeight+"px"
}}},_centerOverlay:function(){if(!this._overlayHeight||!this._overlay.offsetHeight!=this._overlayHeight){this._overlayHeight=this._overlay.offsetHeight
}if(!this._overlayWidth||!this._overlay.offsetWidth!=this._overlayWidth){this._overlayWidth=this._overlay.offsetWidth
}var b=(document.documentElement?document.documentElement.clientHeight:window.innerHeight);
var g=(document.documentElement?document.documentElement.clientWidth:window.innerWidth);
var c=(window.pageYOffset&&window.pageYOffset>0)?parseInt(window.pageYOffset):parseInt(document.documentElement.scrollTop);
var a=(window.pageXOffset&&window.pageXOffset>0)?parseInt(window.pageXOffset):parseInt(document.documentElement.scrollLeft);
if(AC.Detector.isMobile()){c+=(b==1140)?40:20}var f=parseInt(((g-this._overlayWidth)/2)+a);
var d=parseInt(((b-this._overlayHeight)/2)+c);this._overlay.style.top=((this._overlayHeight>b))?20+c+"px":d+"px";
this._overlay.style.left=((this._overlayWidth>g)&&f<15)?"15px":f+"px"},_stopEvent:function(a){var b=window.event||a;
if(b.preventDefault){b.preventDefault()}else{if(b.stopPropagation){b.stopPropagation()
}else{b.cancelBubble=true;b.returnValue=false}}},_addEvent:function(b,a,c){if(b.addEventListener){b.addEventListener(a,c,false)
}else{b.attachEvent("on"+a,c)}return b},setCurrentEvent:function(a){this._currentEvent=a;
return this._currentEvent},currentEvent:function(){return this._currentEvent},trackClick:function(a){if(AC.Tracking){var c=a.target||a.srcElement;
while(c&&c.nodeName.toUpperCase()!=="A"&&c.parentNode){c=c.parentNode}if(c&&(typeof(AC.Tracking.pageName)==="function")){var b=(typeof(c.getAttribute)==="function")?c.getAttribute("href"):c.href;
AC.Tracking.trackClick({prop3:AC.Tracking.pageName()+" - overlay - "+b.replace(/^#/,"")},this,"o",AC.Tracking.pageName())
}}},show:function(a){var c=window.event||a;this.setCurrentEvent(c);this._stopEvent(c);
this._createScreendoor();this._createOverlay();this.willShow();var b=this;this._addEvent(document,"keydown",function(d){if(b._isDisplaying){var f=window.event||d;
if(f&&f.keyCode==27){b.close(f)}if(f&&f.keyCode==13){b._stopEvent(f);return false
}}});if(this.options.doesRecenter){this._addEvent(window,"resize",function(){if(b._isDisplaying){b._centerOverlay()
}});if(this._isiOS!==false){this._addEvent(window,"scroll",function(){if(b._isiOS===false&&b._hasCSSTransitions){b._overlay.setVendorPrefixStyle("transition","top "+parseFloat(b.options.animationDuration)+"s ease-out 0s")
}if(b._isDisplaying){b._centerOverlay()}})}}this.trackClick(c)},willShow:function(){var h=(this._currentEvent.target)?this._currentEvent.target:this._currentEvent.srcElement;
var c="";while(h&&h.nodeName.toUpperCase()!=="A"&&h.parentNode){h=h.parentNode}c=(typeof(h.getAttribute)==="function")?h.getAttribute("href"):h.href;
if(c!=this._contentURL){c=c.replace(window.location.protocol+"//"+window.location.host+window.location.pathname,"");
c=c.replace(window.location.search,"");this._contentURL=c;if(c.match(/^#/)){if(this._currentContent){var b;
c=c.replace(/^\#/,"");if(this._cachedContent[c]){b=this._cachedContent[c]}else{var b=document.getElementById(c);
this._cachedContent[c]=b.parentNode.removeChild(b)}if(b){if(this._currentContent.children[b]){this._currentContent.removeChild(b)
}this._currentContent.appendChild(b);b.style.display="block";this._currentContent.style.display="block";
this._isContentLoded=true;this.willAnimateShow()}}}else{if(c.match(/\.html/)){var f=c.split("#");
var d=f[0];if(f.length===2){this._currentContent.id=f[1]}if(this._cachedContent[c]){this._currentContent.innerHTML="";
this._currentContent.appendChild(this._cachedContent[c].cloneNode(true));this._isContentLoded=true;
this.willAnimateShow()}else{var a=this;var g=function(j,k){if(j){a._currentContent.innerHTML="";
a._currentContent.appendChild(j);a._currentContent.style.display="block";a._cachedContent[c]=j.cloneNode(true);
a._scriptFragment=k;a._isContentLoded=true;a.willAnimateShow()}};AC.loadRemoteContent(d,true,true,g,this._currentContent,null)
}}}}else{this.willAnimateShow()}if(this.delegate&&typeof(this.delegate.willShow)==="function"){this.delegate.willShow(this,this._currentContent)
}},willAnimateShow:function(){if(this.delegate&&typeof(this.delegate.willAnimateShow)==="function"){this.delegate.willAnimateShow(this,this._currentContent)
}var a=this;var b=setTimeout(function(){a._displayScreendoor();a._displayOverlay()
},1)},_displayScreendoor:function(){if(this._screendoor){this._setScreendoorHeight();
if(this._isiOS===false&&this.options.animateShow&&this.options.useScreenDoor){var a=this;
if(this._hasCSSTransitions){this._screendoor.style.opacity="0.0";this._screendoor.style.display="block";
var c=setTimeout(function(){clearTimeout(c);c=null;a._screendoor.style.opacity=a.options.screendoorOpacity;
return},1)}else{this._screendoor.style.opacity="0.0";if(this._hasOpacity){this._screendoor.style.filter="alpha(opacity=0)"
}this._screendoor.style.display="block";var b=setInterval(function(){var d=parseFloat(parseFloat(a._screendoor.style.opacity)+parseFloat(parseFloat(a.options.screendoorOpacity)/parseFloat(a.options.animationSteps)));
if(d>parseFloat(a.options.screendoorOpacity)){clearInterval(b);b=null;return}a._screendoor.style.opacity=d+"";
if(a._hasOpacity){a._screendoor.style.filter="alpha(opacity="+(d*100)+")"}},this._animationTiming)
}}else{this._screendoor.style.display="block"}}},_displayOverlay:function(){if(this._overlay){var a=this;
if(this.options.animateShow){if(this._hasCSSTransitions){this._overlay.style.opacity="0.0";
this._overlay.style.display="block";this._centerOverlay();var d=setTimeout(function(){clearTimeout(d);
d=null;a._overlay.style.opacity="1.0"},1);var c=setTimeout(function(){clearTimeout(c);
c=null;a._isDisplaying=true;a.didAnimateShow()},this._animationTiming)}else{this._overlay.style.opacity="0.0";
if(this._hasOpacity){this._overlay.style.filter="alpha(opacity=0)"}this._overlay.style.display="block";
this._centerOverlay();if(this._hasOpacity){this._closeBtnContainer.style.display="none"
}var a=this;var b=setInterval(function(){var f=parseFloat(parseFloat(a._overlay.style.opacity)+parseFloat(1/parseFloat(a.options.animationSteps)));
if(f>1){clearInterval(b);b=null;if(a._hasOpacity){a._overlay.style.filter=null;
a._closeBtnContainer.style.display="block"}a._isDisplaying=true;a.didAnimateShow();
return}a._overlay.style.opacity=f+"";if(a._hasOpacity){a._overlay.style.filter="alpha(opacity="+(f*100)+")"
}},this._animationTiming)}}else{this._overlay.style.display="block";this._centerOverlay();
this._isDisplaying=true;this.didAnimateShow()}}},didAnimateShow:function(){if(this._scriptFragment){AC.loadRemoteContent.insertScriptFragment(this._scriptFragment);
this._scriptFragment=null}if(this.delegate&&typeof(this.delegate.didAnimateShow)==="function"){this.delegate.didAnimateShow(this,this._currentContent)
}this.didShow()},didShow:function(){if(this.delegate&&typeof(this.delegate.didShow)==="function"){this.delegate.didShow(this,this._currentContent)
}},close:function(a){var b=window.event||a;this.setCurrentEvent(b);this._stopEvent(b);
this.willClose()},willClose:function(){if(this.delegate&&typeof(this.delegate.willClose)==="function"){this.delegate.willClose(this,this._currentContent)
}this.willAnimateClose()},willAnimateClose:function(){if(this.delegate&&typeof(this.delegate.willAnimateClose)==="function"){this.delegate.willAnimateClose(this,this._currentContent)
}this._undisplayOverlay();this._undisplayScreendoor()},_undisplayOverlay:function(){if(this._overlay){if(this.options.animateClose){var a=this;
if(this._hasCSSTransitions){this._overlay.style.opacity="0.0";var c=setTimeout(function(){a._overlay.style.display="none";
a._overlay.style.opacity="1.0";clearTimeout(c);c=null},this.options.animationDuration*1000)
}else{if(a._hasOpacity){this._closeBtnContainer.style.display="none"}var b=setInterval(function(){var d=parseFloat(parseFloat(a._overlay.style.opacity)-parseFloat(1/parseFloat(a.options.animationSteps)));
if(d<0){clearInterval(b);b=null;a._overlay.style.display="none";a._overlay.style.opacity="1.0";
if(a._hasOpacity){a._overlay.style.filter=null;a._closeBtnContainer.style.display="block"
}return}a._overlay.style.opacity=d+"";if(a._hasOpacity){a._overlay.style.filter="alpha(opacity="+(d*100)+")"
}},this._animationTiming)}}else{this._overlay.style.display="none"}}},_undisplayScreendoor:function(){if(this._isiOS===false&&this.options.animateClose&&this.options.useScreenDoor){var a=this;
if(this._hasCSSTransitions){this._screendoor.style.opacity="0.0";var c=setTimeout(function(){a._screendoor.style.display="none";
a._screendoor.style.opacity=a.options.screendoorOpacity;clearTimeout(c);c=null;
a._isDisplaying=false;a.didAnimateClose()},this.options.animationDuration*1000)
}else{var b=setInterval(function(){var d=parseFloat(parseFloat(a._screendoor.style.opacity)-parseFloat(parseFloat(a.options.screendoorOpacity)/parseFloat(a.options.animationSteps)));
if(d<0){clearInterval(b);b=null;a._screendoor.style.display="none";a._screendoor.style.opacity=a.options.screendoorOpacity;
if(a._hasOpacity){a._screendoor.style.filter="alpha(opacity="+(a.options.screendoorOpacity*100)+")"
}a._isDisplaying=false;a.didAnimateClose();return}a._screendoor.style.opacity=d+"";
if(a._hasOpacity){a._screendoor.style.filter="alpha(opacity="+(d*100)+")"}},this._animationTiming)
}}else{if(this._screendoor){this._screendoor.style.display="none"}this._isDisplaying=false;
this.didAnimateClose()}},didAnimateClose:function(){if(this.delegate&&typeof(this.delegate.didAnimateClose)==="function"){this.delegate.didAnimateClose(this,this._currentContent)
}this.didClose()},didClose:function(){if(this.delegate&&typeof(this.delegate.didClose)==="function"){this.delegate.didClose(this,this._currentContent)
}}};AC.loadRemoteContent=function(h,k,c,j,a,f){if(typeof h!=="string"){return}if(typeof k!=="boolean"){k=true
}if(typeof c!=="boolean"){c=true}var g=arguments.callee;var d=g._loadArgumentsByUrl[h];
if(!d){g._loadArgumentsByUrl[h]={contentURL:h,importScripts:k,importCSS:c,callback:j,context:a,delegate:f};
var b={method:"get",onSuccess:arguments.callee.loadTemplateHTMLFromRequest,onFailure:arguments.callee.failedToadTemplateHTMLFromRequest,onException:function(l,m){throw (m)
}};if(!h.match(/\.json$/)){b.requestHeaders={Accept:"text/xml"};b.onCreate=function(l){l.request.overrideMimeType("text/xml")
}}new Ajax.Request(h,b)}};AC.loadRemoteContent._loadArgumentsByUrl={};AC.loadRemoteContent.loadTemplateHTMLFromRequest=function(b){var d=b.request.url;
var m=arguments.callee;var h=AC.loadRemoteContent._loadArgumentsByUrl[d];var q=window.document;
var k=b.responseXMLValue().documentElement;if(AC.Detector.isIEStrict()){k=k.ownerDocument
}var q=window.document;var l=document.createDocumentFragment();if(h.importScripts){AC.loadRemoteContent.importScriptsFromXMLDocument(k,l,h)
}if(h.importCSS){AC.loadRemoteContent.importCssFromXMLDocumentAtLocation(k,d,h)
}var r=null;var a=null;var g=k.getElementsByTagName("body")[0];if(!g){return}g.normalize();
var a=Element.Methods.childNodeWithNodeTypeAtIndex(g,Node.ELEMENT_NODE,0);if(a){r=q._importNode(a,true);
if(r.cleanSpaces){r.cleanSpaces(true)}}else{if(g.cleanSpaces){g.cleanSpaces(true)
}else{if(typeof g.normalize==="function"){g.normalize()}}var j=g.childNodes;r=q.createDocumentFragment();
var n=/\S/;for(var f=0,c=0;(c=j[f]);f++){var o=q._importNode(c,true);r.appendChild(o)
}}var p=h.callback;p(r,l,h.context)};AC.loadRemoteContent.javascriptTypeValueRegExp=new RegExp("text/javascript","i");
AC.loadRemoteContent.javascriptLanguageValueRegExp=new RegExp("javascript","i");
AC.loadRemoteContent.documentScriptsBySrc=function(){if(!AC.loadRemoteContent._documentScriptsBySrc){AC.loadRemoteContent._documentScriptsBySrc={};
var b=document.getElementsByTagName("script");if(!b||b.length===0){return AC.loadRemoteContent._documentScriptsBySrc
}for(var c=0,a=null;(a=b[c]);c++){var d=a.getAttribute("type");var g=null;var h=a.getAttribute("language");
if(!this.javascriptTypeValueRegExp.test(d)&&!this.javascriptLanguageValueRegExp.test(h)){continue
}if(a.hasAttribute){var f=a.hasAttribute("src")}else{var f=Element.Methods.hasAttribute(a,"src")
}if(f){var g=a.getAttribute("src");AC.loadRemoteContent._documentScriptsBySrc[g]=g
}}}return AC.loadRemoteContent._documentScriptsBySrc};AC.loadRemoteContent.importScriptsFromXMLDocument=function(o,b,t){var f=o.getElementsByTagName("script"),g,h,p,u,c=t.contentURL,s=t.delegate,d=t.context,a=(s&&typeof s.shouldImportScriptForContentURL==="function"),r=navigator.userAgent.toLowerCase(),v=(AC.Detector.isIEStrict()&&parseInt(r.substring(r.lastIndexOf("msie ")+5))<9),j=true;
if(!b){b=document.createDocumentFragment()}var l=AC.loadRemoteContent.documentScriptsBySrc();
for(var q=0,m=null;(m=f[q]);q++){g=m.getAttribute("type");h=null;j=true;p=m.getAttribute("language");
if(!this.javascriptTypeValueRegExp.test(g)&&!this.javascriptLanguageValueRegExp.test(p)){continue
}if(m.hasAttribute){u=m.hasAttribute("src");h=m.getAttribute("src")}else{h=m.getAttribute("src");
u=((h!=null)&&(h!==""))}if(m.getAttribute("id")==="Redirect"||(a&&!s.shouldImportScriptForContentURL(m,c,d))){continue
}if(u){if(!l.hasOwnProperty(h)){var n=document.createElement("script");n.setAttribute("type","text/javascript");
if(v){n.tmp_src=h;n.onreadystatechange=function(){var w=window.event.srcElement,x;
if(!w.isLoaded&&((w.readyState=="complete")||(w.readyState=="loaded"))){x=w.tmp_src;
if(x){w.tmp_src=null;w.src=x;w.isLoaded=false}else{w.onreadystatechange=null;w.isLoaded=true
}}}}else{n.src=h}AC.loadRemoteContent._documentScriptsBySrc[h]=h;b.appendChild(n)
}}else{var n=document.createElement("script");n.setAttribute("type","text/javascript");
if(v){var k=new Function(m.text);n.onreadystatechange=function(){var w=window.event.srcElement;
if(!w.isLoaded&&((w.readyState=="complete")||(w.readyState=="loaded"))){w.onreadystatechange=null;
w.isLoaded=true;k()}}}else{n.text=m.text}AC.loadRemoteContent._documentScriptsBySrc[h]=h;
b.appendChild(n)}}return b};AC.loadRemoteContent.insertScriptFragment=function(f){if(!f){return
}AC.isDomReady=false;Event._domReady.done=false;var d=document.getElementsByTagName("head")[0],h=f.childNodes,b,c,a=function(){var j;
if(!window.event||((j=window.event.srcElement)&&(j.isLoaded||((typeof j.isLoaded==="undefined")&&((j.readyState=="complete")||(j.readyState=="loaded")))))){arguments.callee.loadedCount++;
if(j&&!j.isLoaded){j.onreadystatechange=null;j.isLoaded=true}if(arguments.callee.loadedCount===arguments.callee.loadingCount){Event._domReady()
}}};a.loadedCount=0;a.loadingCount=f.childNodes.length;for(c=0;(b=h[c]);c++){if(b.addEventListener){b.addEventListener("load",a,false)
}else{if(typeof b.onreadystatechange==="function"){var g=b.onreadystatechange;b.onreadystatechange=function(j){var k=window.event.srcElement;
g.call(k);a()}}else{b.onreadystatechange=a}}}d.appendChild(f);d=null};AC.loadRemoteContent.documentLinksByHref=function(){if(!AC.loadRemoteContent._documentLinksByHref){AC.loadRemoteContent._documentLinksByHref={};
var b=document.getElementsByTagName("link");if(!b||b.length===0){return AC.loadRemoteContent._documentLinksByHref
}for(var c=0,f=null;(f=b[c]);c++){var d=f.getAttribute("type");if(f.type.toLowerCase()!=="text/css"){continue
}var g=null;if(f.hasAttribute){var a=f.hasAttribute("href")}else{var a=Element.hasAttribute(f,"href")
}if(a){var g=f.getAttribute("href");AC.loadRemoteContent._documentLinksByHref[g]=g
}}}return AC.loadRemoteContent._documentLinksByHref};AC.loadRemoteContent.__importCssElementInHeadFromLocation=function(f,h,b){var d=(f.tagName.toUpperCase()==="LINK");
if(d){var g=f.getAttribute("type");if(!g||g&&g.toLowerCase()!=="text/css"){return
}var c=f.getAttribute("href");if(!c.startsWith("http")&&!c.startsWith("/")){var k=c;
if(b.pathExtension().length>0){b=b.stringByDeletingLastPathComponent()}c=b.stringByAppendingPathComponent(k)
}if(AC.Detector.isIEStrict()){var a=window.document.createStyleSheet(c,1)}else{var j=window.document.importNode(f,true);
j.href=c}AC.loadRemoteContent.documentLinksByHref()[c]=c}if(!AC.Detector.isIEStrict()||(AC.Detector.isIEStrict()&&!d)){h.insertBefore(j,h.firstChild)
}};AC.loadRemoteContent.importCssFromXMLDocumentAtLocation=function(j,b,h){var k=window.document.getElementsByTagName("head")[0];
var c=[];c.addObjectsFromArray(j.getElementsByTagName("style"));c.addObjectsFromArray(j.getElementsByTagName("link"));
if(c){var d=AC.loadRemoteContent.documentLinksByHref();for(var f=0,g=null;(g=c[f]);
f++){var a=g.getAttribute("href");if(d.hasOwnProperty(a)){continue}this.__importCssElementInHeadFromLocation(g,k,b)
}}};Ajax.Request.prototype._overrideMimeType=null;Ajax.Request.prototype.overrideMimeType=function(a){this._overrideMimeType=a;
if(this.transport.overrideMimeType){this.transport.overrideMimeType(a)}};Ajax.Request.prototype._doesOverrideXMLMimeType=function(){return(this._overrideMimeType==="text/xml")
};Ajax.Response.prototype.responseXMLValue=function(){if(AC.Detector.isIEStrict()){var a=this.transport.responseXML.documentElement;
if(!a&&this.request._doesOverrideXMLMimeType()){this.transport.responseXML.loadXML(this.transport.responseText)
}}return this.transport.responseXML};