(function(){
  var _fetch, rescope, winProps;
  _fetch = function(url, config){
    return fetch(url, config).then(function(ret){
      return !ret
        ? Promise.resolve({
          s: 404,
          t: 'unknown'
        })
        : !ret.ok
          ? (ret.clone().text().then(function(t){
            var e, json, err;
            e = null;
            try {
              json = JSON.parse(t);
              if (json && json.name === 'lderror') {
                return e = json;
              }
            } catch (e$) {
              return err = e$;
            }
          }), {
            s: ret.status,
            t: t,
            e: e
          })
          : ret.text();
    }).then(function(v){
      var err, ref$;
      if (typeof v === 'string') {
        return v;
      }
      err = (ref$ = new Error(v.s + " " + v.t), ref$.name = 'lderror', ref$.id = v.s, ref$.message = t, ref$);
      if (v.e) {
        (err.e = v.e, err).json = v.e;
      }
      return Promise.reject(err);
    });
  };
  rescope = function(opt){
    opt == null && (opt = {});
    this.opt = import$({
      inFrame: false
    }, opt);
    this.inFrame = !!this.opt.inFrame;
    this.prejs = opt.prejs || [];
    this.global = opt.global || (typeof global != 'undefined' && global !== null ? global : window);
    if (opt.registry) {
      this.registry(opt.registry);
    }
    this.scope = {};
    return this;
  };
  rescope.func = [];
  rescope.lock = {
    frame: {
      queue: [],
      busy: false
    },
    local: {
      queue: [],
      busy: false
    }
  };
  /*
  
  window members. adopted from:
   - DOM: https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model
   - Properties: https://developer.mozilla.org/en-US/docs/Web/API/Window
  
  used for list all un-enumerable attributes in window object.
  
  */
  rescope._cache = {};
  rescope.cache = function(url, obj){
    obj == null && (obj = {
      code: "",
      vars: []
    });
    return rescope._cache[url] = obj;
  };
  rescope.cacheDump = function(){
    var ret;
    console.log(ret = "(function(){\n  var _libs = " + JSON.stringify(rescope._cache) + ";\n  for(k in _libs) { rescope.cache(k,_libs[k]); }\n})();");
    return ret;
  };
  winProps = {
    attr: ['applicationCache', 'caches', 'closed', 'console', 'controllers', 'crossOriginIsolated', 'crypto', 'customElements', 'defaultStatus', 'devicePixelRatio', 'dialogArguments', 'directories', 'document', 'event', 'frameElement', 'frames', 'fullScreen', 'history', 'indexedDB', 'innerHeight', 'innerWidth', 'isSecureContext', 'isSecureContext', 'length', 'localStorage', 'location', 'locationbar', 'menubar', 'mozAnimationStartTime', 'mozInnerScreenX', 'mozInnerScreenY', 'mozPaintCount', 'name', 'navigator', 'onabort', 'onafterprint', 'onanimationcancel', 'onanimationend', 'onanimationiteration', 'onappinstalled', 'onauxclick', 'onbeforeinstallprompt', 'onbeforeprint', 'onbeforeunload', 'onblur', 'oncancel', 'oncanplay', 'oncanplaythrough', 'onchange', 'onclick', 'onclose', 'oncontextmenu', 'oncuechange', 'ondblclick', 'ondevicemotion', 'ondeviceorientation', 'ondeviceorientationabsolute', 'ondragdrop', 'ondurationchange', 'onended', 'onerror', 'onfocus', 'onformdata', 'ongamepadconnected', 'ongamepaddisconnected', 'ongotpointercapture', 'onhashchange', 'oninput', 'oninvalid', 'onkeydown', 'onkeypress', 'onkeyup', 'onlanguagechange', 'onload', 'onloadeddata', 'onloadedmetadata', 'onloadend', 'onloadstart', 'onlostpointercapture', 'onmessage', 'onmessageerror', 'onmousedown', 'onmouseenter', 'onmouseleave', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onmozbeforepaint', 'onpaint', 'onpause', 'onplay', 'onplaying', 'onpointercancel', 'onpointerdown', 'onpointerenter', 'onpointerleave', 'onpointermove', 'onpointerout', 'onpointerover', 'onpointerup', 'onpopstate', 'onrejectionhandled', 'onreset', 'onresize', 'onscroll', 'onselect', 'onselectionchange', 'onselectstart', 'onstorage', 'onsubmit', 'ontouchcancel', 'ontouchstart', 'ontransitioncancel', 'ontransitionend', 'onunhandledrejection', 'onunload', 'onvrdisplayactivate', 'onvrdisplayblur', 'onvrdisplayconnect', 'onvrdisplaydeactivate', 'onvrdisplaydisconnect', 'onvrdisplayfocus', 'onvrdisplaypointerrestricted', 'onvrdisplaypointerunrestricted', 'onvrdisplaypresentchange', 'onwheel', 'opener', 'origin', 'outerHeight', 'outerWidth', 'pageXOffset', 'pageYOffset', 'parent', 'performance', 'personalbar', 'pkcs11', 'screen', 'screenLeft', 'screenTop', 'screenX', 'screenY', 'scrollbars', 'scrollMaxX', 'scrollMaxY', 'scrollX', 'scrollY', 'self', 'sessionStorage', 'sidebar', 'speechSynthesis', 'status', 'statusbar', 'toolbar', 'top', 'visualViewport', 'window', 'Methods', 'alert', 'atob', 'back', 'blur', 'btoa', 'cancelAnimationFrame', 'cancelIdleCallback', 'captureEvents', 'clearImmediate', 'clearInterval', 'clearTimeout', 'close', 'confirm', 'convertPointFromNodeToPage', 'convertPointFromPageToNode', 'createImageBitmap', 'dump', 'fetch', 'find', 'focus', 'forward', 'getComputedStyle', 'getDefaultComputedStyle', 'getSelection', 'home', 'matchMedia', 'minimize', 'moveBy', 'moveTo', 'open', 'openDialog', 'postMessage', 'print', 'prompt', 'queueMicrotask', 'releaseEvents', 'requestAnimationFrame', 'requestFileSystem', 'requestIdleCallback', 'resizeBy', 'resizeTo', 'routeEvent', 'scroll', 'scrollBy', 'scrollByLines', 'scrollByPages', 'scrollTo', 'setCursor', 'setImmediate', 'setInterval', 'setTimeout', 'showDirectoryPicker', 'showModalDialog', 'showOpenFilePicker', 'showSaveFilePicker', 'sizeToContent', 'stop', 'updateCommands', 'Events', 'event', 'afterprint', 'animationcancel', 'animationend', 'animationiteration', 'beforeprint', 'beforeunload', 'blur', 'copy', 'cut', 'DOMContentLoaded', 'error', 'focus', 'hashchange', 'languagechange', 'load', 'message', 'messageerror', 'offline', 'online', 'orientationchange', 'pagehide', 'pageshow', 'paste', 'popstate', 'rejectionhandled', 'storage', 'transitioncancel', 'unhandledrejection', 'unload', 'vrdisplayconnect', 'vrdisplaydisconnect', 'vrdisplaypresentchange'],
    dom: ['Attr', 'CDATASection', 'CharacterData', 'ChildNode', 'Comment', 'CustomEvent', 'Document', 'DocumentFragment', 'DocumentType', 'DOMError', 'DOMException', 'DOMImplementation', 'DOMString', 'DOMTimeStamp', 'DOMStringList', 'DOMTokenList', 'Element', 'Event', 'EventTarget', 'HTMLCollection', 'MutationObserver', 'MutationRecord', 'NamedNodeMap', 'Node', 'NodeFilter', 'NodeIterator', 'NodeList', 'ProcessingInstruction', 'Selection', 'Range', 'Text', 'TextDecoder', 'TextEncoder', 'TimeRanges', 'TreeWalker', 'URL', 'Window', 'Worker', 'XMLDocument']
  };
  rescope.prototype = import$(Object.create(Object.prototype), {
    _reg: function(arg$){
      var name, version, path;
      name = arg$.name, version = arg$.version, path = arg$.path;
      return "/assets/lib/" + name + "/" + (version || 'latest') + "/" + (path || '');
    },
    registry: function(it){
      var ref$;
      this._reg = it || '';
      if (typeof this._reg === 'string') {
        if (this._reg && (ref$ = this._reg)[ref$.length - 1] !== '/') {
          this._reg += '/';
        }
      }
      if (this.inFrame) {
        return;
      }
      if (this.iframe) {
        this.iframe.registry = this._reg;
        if (this.iframe._scope) {
          return this.iframe._scope.registry(this._reg);
        }
      }
    },
    getUrl: function(it){
      return it.url != null
        ? it.url
        : it.name != null ? typeof this._reg === 'function'
          ? this._reg({
            name: it.name,
            version: it.version,
            path: it.path
          })
          : this._reg + "/" + name + "/" + (version || 'latest') + "/" + (path || '') : it;
    },
    peekScope: function(){
      console.log("in delegate iframe: " + !!this.global._rescopeDelegate);
      return this.global._rescopeDelegate;
    },
    init: function(){
      var this$ = this;
      if (this.inFrame) {
        return Promise.resolve();
      }
      this.prejs.map(function(it){
        var s;
        s = document.createElement("script");
        s.setAttribute('type', 'text/javascript');
        s.setAttribute('src', it);
        return document.body.appendChild(s);
      });
      return new Promise(function(res, rej){
        var node, prejs, code;
        node = document.createElement('iframe');
        node.setAttribute('name', "delegator-" + Math.random().toString(36).substring(2));
        node.setAttribute('sandbox', 'allow-same-origin allow-scripts');
        import$(node.style, {
          opacity: 0,
          zIndex: -1,
          pointerEvents: 'none',
          top: "0px",
          left: "0px",
          width: '0px',
          height: '0px',
          position: 'absolute'
        });
        prejs = this$.prejs.map(function(it){
          return "<script type=\"text/javascript\" src=\"" + it + "\"></script>";
        }).join('');
        code = "<html><head><meta http-equiv=\"Content-type\" content=\"text/html;charset=UTF-8\"></head><body>\n" + prejs + "\n<script>\nfunction init() {\n  if(!window._scope) { window._scope = new rescope({inFrame:true,global:window,registry:window._reg}) }\n}\nfunction load(url,ctx) { return _scope.load(url,ctx); }\nfunction context(url,func) { _scope.context(url,func,true); }\n</script></body></html>";
        node.onerror = function(it){
          return rej(it);
        };
        node.onload = function(){
          var ref$, k;
          ref$ = this$.iframe = node.contentWindow;
          ref$.rescope = rescope;
          ref$._rescopeDelegate = true;
          ref$._reg = this$._reg;
          this$.iframe.init();
          this$.frameScope = this$.iframe._scope.scope;
          winProps.all = Array.from(new Set((function(){
            var results$ = [];
            for (k in this.iframe) {
              results$.push(k);
            }
            return results$;
          }.call(this$)).concat(winProps.dom, winProps.attr)));
          return res();
        };
        node.src = URL.createObjectURL(new Blob([code], {
          type: 'text/html'
        }));
        return document.body.appendChild(node);
      });
    },
    context: function(des, func, untilResolved){
      untilResolved == null && (untilResolved = false);
      if (typeof des === 'string' || Array.isArray(des)) {
        return this.ctxFromUrl(des, func, untilResolved);
      } else {
        return this.ctxFromObj(des, func, untilResolved);
      }
    },
    ctxFromObj: function(context, func, untilResolved){
      var stack, k, ret, p, this$ = this;
      context == null && (context = {});
      untilResolved == null && (untilResolved = false);
      stack = {};
      if (this.inFrame) {
        for (k in context) {
          stack[k] = this.global[k];
          this.global[k] = context[k];
        }
      }
      ret = func(context);
      p = untilResolved && ret && ret.then
        ? ret
        : Promise.resolve();
      return p.then(function(){
        var k, results$ = [];
        if (this$.inFrame) {
          for (k in stack) {
            results$.push(this$.global[k] = stack[k]);
          }
          return results$;
        }
      });
    },
    ctxFromUrl: function(url, func, untilResolved){
      var stacks, scopes, context, i$, to$, i, ref$, stack, scope, k, ret, p, this$ = this;
      untilResolved == null && (untilResolved = false);
      url = Array.isArray(url)
        ? url
        : [url];
      stacks = [];
      scopes = [];
      context = {};
      for (i$ = 0, to$ = url.length; i$ < to$; ++i$) {
        i = i$;
        ref$ = [{}, this.scope[url[i].url || url[i]] || {}], stack = ref$[0], scope = ref$[1];
        for (k in scope) {
          stack[k] = this.global[k];
          this.global[k] = scope[k];
          context[k] = scope[k];
        }
        stacks.push(stack);
        scopes.push(scope);
      }
      ret = func(context);
      p = untilResolved && ret && ret.then
        ? ret
        : Promise.resolve();
      return p.then(function(){
        var i$, i, lresult$, scope, stack, k, results$ = [];
        for (i$ = scopes.length - 1; i$ >= 0; --i$) {
          i = i$;
          lresult$ = [];
          scope = scopes[i];
          stack = stacks[i];
          for (k in scope) {
            lresult$.push(this$.global[k] = stack[k]);
          }
          results$.push(lresult$);
        }
        return results$;
      });
    },
    load: function(url, ctx){
      var location, _, lock, this$ = this;
      ctx == null && (ctx = {});
      if (!url) {
        return Promise.resolve();
      }
      ctx.local || (ctx.local = {});
      ctx.frame || (ctx.frame = {});
      location = this.inFrame ? 'frame' : 'local';
      url = Array.isArray(url)
        ? url
        : [url];
      _ = function(){
        return Promise.resolve().then(function(){
          if (!this$.inFrame) {
            return this$.iframe.load(url, ctx);
          }
        }).then(function(){
          var _;
          _ = function(list, idx, ctx){
            var items, i$, to$, i;
            idx == null && (idx = 0);
            if (idx >= list.length) {
              return Promise.resolve(ctx);
            }
            items = [];
            for (i$ = idx, to$ = list.length; i$ < to$; ++i$) {
              i = i$;
              items.push(list[i]);
              if (list[i].async != null && !list[i].async) {
                break;
              }
            }
            if (!items.length) {
              return Promise.resolve(ctx);
            }
            return Promise.all(items.map(function(it){
              var url;
              url = this$.getUrl(it);
              return this$._load(url, ctx, (this$.frameScope || (this$.frameScope = {}))[url]);
            })).then(function(){
              return this$.context(items.map(function(it){
                return this$.getUrl(it);
              }), function(c){
                import$(ctx[location], c);
                return _(list, idx + items.length, ctx);
              }, true);
            });
          };
          return _(url, 0, ctx);
        }).then(function(){});
      };
      if (!ctx) {
        return _();
      }
      lock = rescope.lock[location];
      return Promise.resolve().then(function(){
        if (!lock.busy) {
          return;
        }
        return new Promise(function(res, rej){
          return lock.queue.push({
            res: res,
            rej: rej
          });
        });
      }).then(function(){
        lock.busy = true;
        return new Promise(function(res, rej){
          return this$.context(ctx[location], function(){
            return _().then(function(it){
              return res(it);
            })['catch'](function(it){
              return rej(it);
            });
          }, true);
        });
      })['finally'](function(){
        var ret;
        lock.busy = false;
        if (!(ret = lock.queue.splice(0, 1)[0])) {
          return;
        }
        return ret.res();
      });
    },
    _wrapper: function(url, code, context, prescope){
      var this$ = this;
      context == null && (context = {});
      prescope == null && (prescope = {});
      return new Promise(function(res, rej){
        var _code, k, v, _postcode, tmpvar, ref$, _forceScope, id, script, hash;
        _code = (function(){
          var ref$, results$ = [];
          for (k in ref$ = context) {
            v = ref$[k];
            results$.push("var " + k + " = context." + k + ";this." + k + " = context." + k + ";");
          }
          return results$;
        }()).join('\n') + '\n';
        _postcode = (function(){
          var ref$, results$ = [];
          for (k in ref$ = prescope) {
            v = ref$[k];
            results$.push("if(typeof(" + k + ") != 'undefined') { this." + k + " = " + k + "; }");
          }
          return results$;
        }()).join('\n') + '\n';
        tmpvar = "_tmp" + Math.random().toString(36).substring(2);
        _code += "var " + tmpvar + " = {};";
        for (k in ref$ = prescope) {
          v = ref$[k];
          if (!context[k] && prescope[k]) {
            _code += tmpvar + "." + k + " = win." + k + "; win." + k + " = undefined;\n";
            _postcode += "win." + k + " = " + tmpvar + "." + k + ";\n";
          }
        }
        _forceScope = "/* intercept these variables so lib will inject anything into our scope */\nvar global = this;\nvar globalThis = this;\nvar self = this;\nvar window = this;\n/* yet we need window memebers so lib can work properly with builtin features */\nwindow.__proto__ = win;\n/* some props are not enumerable, so we list all of them directly in winProps.all */\nfor(var i = 0; i < winProps.all.length; i++) {\n  k = winProps.all[i];\n  /* but functions need window as `this` to be called. we indirectly do this for them. */\n  if(typeof(win[k]) == \"function\") {\n    track.push(k);\n    window[k] = (function(k){ return function() { return win[k].apply(win,arguments);} })(k);\n  } else {\n    /* and some members are from getter/setter. we proxy it via custom getter / setter object. */\n    desc = Object.getOwnPropertyDescriptor(win,k);\n    if(desc && desc.get) {\n      track.push(k);\n      Object.defineProperty(window, k, (function(n,desc) {\n        var ret = {\n          configurable: desc.configurable,\n          enumerable: desc.enumerable\n        };\n        if(desc.get) { ret.get = function() { return win[n]; } }\n        if(desc.set) { ret.set = function(it) { win[n] = it; } }\n        return ret;\n      }(k,desc)));\n    }\n  }\n}";
        id = "x" + Math.random().toString(36).substring(2);
        _code = "/* URL: " + url + " */\nrescope.func." + id + " = function(context, winProps) {\n  var win = window;\n  var track = [];\n  var ret = (function() {\n    " + _code + "\n    " + _forceScope + "\n    " + code + "\n    " + _postcode + "\n    return this;\n  }).apply({});\n  /* returned ret may contain members from window through __proto__.  */\n  /* we only need members from libs, so just ignore those from window object. */\n  for(k in ret) {\n    if((track.indexOf(k) == -1) && ret.hasOwnProperty(k)) { context[k] = ret[k]; }\n  }\n  return context;\n}";
        script = this$.global.document.createElement("script");
        hash = {};
        for (k in ref$ = this$.global) {
          v = ref$[k];
          hash[k] = v;
        }
        script.onerror = function(it){
          return rej(it);
        };
        script.onload = function(){
          (this$.func || (this$.func = {}))[url] = rescope.func[id];
          return res(import$({}, (this$.func || (this$.func = {}))[url](context, winProps)));
        };
        script.setAttribute('src', URL.createObjectURL(new Blob([_code], {
          type: 'text/javascript'
        })));
        return this$.global.document.body.appendChild(script);
      });
    },
    _load: function(url, ctx, prescope){
      var p, this$ = this;
      prescope == null && (prescope = {});
      if (this.inFrame) {
        return this._loadInFrame(url);
      }
      p = rescope._cache[url]
        ? Promise.resolve(rescope._cache[url].code)
        : _fetch(url, {
          method: "GET"
        });
      return p.then(function(code){
        var k;
        rescope._cache[url] = {
          code: code,
          vars: (function(){
            var results$ = [];
            for (k in prescope) {
              results$.push(k);
            }
            return results$;
          }())
        };
        return this$._wrapper(url, code, ctx.local, prescope);
      }).then(function(c){
        return this$.scope[url] = c;
      });
    },
    _loadInFrame: function(url){
      var this$ = this;
      return new Promise(function(res, rej){
        var that, ret, script, hash, k, ref$, v, fullUrl;
        if (that = rescope._cache[url]) {
          ret = {};
          (that.vars || (that.vars = [])).map(function(){
            return ret[k] = true;
          });
          return res(ret);
        }
        script = this$.global.document.createElement("script");
        hash = {};
        for (k in ref$ = this$.global) {
          v = ref$[k];
          hash[k] = v;
        }
        script.onerror = function(it){
          return rej(it);
        };
        script.onload = function(){
          var scope, k, v, ref$;
          if (this$.scope[url]) {
            scope = this$.scope[url];
            for (k in scope) {
              v = scope[k];
              scope[k] = this$.global[k];
              this$.global[k] = hash[k];
            }
          } else {
            this$.scope[url] = scope = {};
            for (k in ref$ = this$.global) {
              v = ref$[k];
              if (hash[k] != null || !(this$.global[k] != null)) {
                continue;
              }
              scope[k] = this$.global[k];
              this$.global[k] = hash[k];
            }
          }
          return res(scope);
        };
        fullUrl = /(https?:)?\/\//.exec(url)
          ? url
          : window.location.origin + (url[0] === '/' ? '' : '/') + url;
        script.setAttribute('src', fullUrl);
        return this$.global.document.body.appendChild(script);
      });
    }
  });
  if (typeof module != 'undefined' && module !== null) {
    module.exports = rescope;
  }
  if (typeof window != 'undefined' && window !== null) {
    window.rescope = rescope;
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
