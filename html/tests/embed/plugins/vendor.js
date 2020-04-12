/**/


var require,
    define;

(function () {

    var modules = {},
        requireStack = [],
        inProgressModules = {},
        SEPARATOR = ".";

	function build(module) {
		var factory = module.factory;
		var localRequire = function(id){        	
			var resultantId = id;          
			if (id.charAt(0) === ".") {
          	resultantId = module.id.slice(0, module.id.lastIndexOf(SEPARATOR)) + SEPARATOR + id.slice(2);            					
			}
					return require(resultantId);					
				};
        module.exports = {};
        delete module.factory;
        factory(localRequire, module.exports, module);
        return module.exports;
    }

    require = function (id) {
        if (!modules[id]) {
            throw "module " + id + " not found";
        } else if (id in inProgressModules) {
            var cycle = requireStack.slice(inProgressModules[id]).join('->') + '->' + id;
            throw "Cycle in require graph: " + cycle;
        }
        if (modules[id].factory) {
            try {
                inProgressModules[id] = requireStack.length;
                requireStack.push(id);
                return build(modules[id]);
            } finally {
                delete inProgressModules[id];
                requireStack.pop();
            }
        }
        return modules[id].exports;
    };

    define = function (id, factory) {
        if (modules[id]) {
            throw "module " + id + " already defined";
        }
        modules[id] = {
            id: id,
            factory: factory
        };
    };

    define.remove = function (id) {
        delete modules[id];
    };

    define.moduleMap = modules;

    var root = this;
    var breaker = {};

    var ArrayProto = Array.prototype,
        ObjProto = Object.prototype,
        FuncProto = Function.prototype;

    var slice = ArrayProto.slice,
        unshift = ArrayProto.unshift,
        toString = ObjProto.toString,
        hasOwnProperty = ObjProto.hasOwnProperty;

    var nativeForEach = ArrayProto.forEach,
        nativeMap = ArrayProto.map,
        nativeReduce = ArrayProto.reduce,
        nativeReduceRight = ArrayProto.reduceRight,
        nativeFilter = ArrayProto.filter,
        nativeEvery = ArrayProto.every,
        nativeSome = ArrayProto.some,
        nativeIndexOf = ArrayProto.indexOf,
        nativeLastIndexOf = ArrayProto.lastIndexOf,
        nativeIsArray = Array.isArray,
        nativeKeys = Object.keys,
        nativeBind = FuncProto.bind;

    var Ctor = function () {};

	var eventSplitter = /\s+/;
	var optionalParam = /\((.*?)\)/g;
  	var namedParam    = /(\(\?)?:\w+/g;
  	var splatParam    = /\*\w+/g;
  	var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;
	var routeStripper = /^[#\/]|\s+$/g;
	var rootStripper = /^\/+|\/+$/g;
	var pathStripper = /#.*$/;
	
    var _listening;

    var _ = function (obj) {
        return new wrapper(obj);

    };

    if (typeof module !== "undefined" && module.exports) {
        module.exports = _;
        _._ = _;
    } else {
        root["_"] = _;
    }

    _.VERSION = "1.0.0";

    var optimizeCb = function(func, context, argCount) {
        if (context === void 0) return func;
        switch (argCount == null ? 3 : argCount) {
          case 1: return function(value) {
            return func.call(context, value);
          };
          case 2: return function(value, other) {
            return func.call(context, value, other);
          };
          case 3: return function(value, index, collection) {
            return func.call(context, value, index, collection);
          };
          case 4: return function(accumulator, value, index, collection) {
            return func.call(context, accumulator, value, index, collection);
          };
        }
        return function() {
          return func.apply(context, arguments);
        };
      };

    var cb = function(value, context, argCount) {
        if (value == null) return _.identity;
        if (_.isFunction(value)) return optimizeCb(value, context, argCount);
        if (_.isObject(value)) return _.matcher(value);
        return _.property(value);
    };
      
    _.iteratee = function(value, context) {
        return cb(value, context, Infinity);
    };

    var createAssigner = function (keysFunc, undefinedOnly) {
        return function (obj) {
            var length = arguments.length;
            if (length < 2 || obj == null) return obj;
            for (var index = 1; index < length; index++) {
                var source = arguments[index],
                    keys = keysFunc(source),
                    l = keys.length;
                for (var i = 0; i < l; i++) {
                    var key = keys[i];
                    if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
                }
            }
            return obj;
        };
    };

    var each = (_.each = _.forEach = function (obj, iterator, context) {
        if (obj == null) return;
        if (nativeForEach && obj.forEach === nativeForEach) {
            obj.forEach(iterator, context);
        } else if (obj.length === +obj.length) {
            for (var i = 0, l = obj.length; i < l; i++) {
                if (i in obj && iterator.call(context, obj[i], i, obj) === breaker)
                    return;
            }
        } else {
            for (var key in obj) {
                if (hasOwnProperty.call(obj, key)) {
                    if (iterator.call(context, obj[key], key, obj) === breaker) return;
                }
            }
        }
    });

    _.map = _.collect = function(obj, iteratee, context) {
        iteratee = cb(iteratee, context);
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length,
            results = Array(length);
        for (var index = 0; index < length; index++) {
          var currentKey = keys ? keys[index] : index;
          results[index] = iteratee(obj[currentKey], currentKey, obj);
        }
        return results;  
    };


    _.functions = _.methods = function (obj) {
        var names = [];
        for (var key in obj) {
            if (_.isFunction(obj[key])) names.push(key);
        }
        return names.sort();
    };

    _.isFunction = function (obj) {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    };

    _.mixin = function (obj) {
        each(_.functions(obj), function (name) {
            addToWrapper(name, (_[name] = obj[name]));
        });
    };

    _.partial = function (func) {
        var boundArgs = slice.call(arguments, 1);
        var bound = function () {
            var position = 0,
                length = boundArgs.length;
            var args = Array(length);
            for (var i = 0; i < length; i++) {
                args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
            }
            while (position < arguments.length) args.push(arguments[position++]);
            return executeBound(func, bound, this, this, args);
        };
        return bound;
    };

    _.before = function (times, func) {
        var memo;
        return function () {
            if (--times > 0) {
                memo = func.apply(this, arguments);
            }
            if (times <= 1) func = null;
            return memo;
        };
    };

    _.once = _.partial(_.before, 2);

    _.result = function(object, property, fallback) {
        var value = object == null ? void 0 : object[property];
        if (value === void 0) {
          value = fallback;
        }    
        return _.isFunction(value) ? value.call(object) : value;
    };

    var idCounter = 0;

    _.uniqueId = function (prefix) {
        var id = idCounter++;
        return prefix ? prefix + id : id;
    };
	
    _.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g
    };
    
    _.template = function (str, data) {
        var c = _.templateSettings;
        var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' +
            'with(obj||{}){__p.push(\'' +
            str.replace(/\\/g, '\\\\')
            .replace(/'/g, "\\'")
            .replace(c.interpolate, function (match, code) {
                return "'," + code.replace(/\\'/g, "'") + ",'";
            })
            .replace(c.evaluate || null, function (match, code) {
                return "');" + code.replace(/\\'/g, "'")
                    .replace(/[\r\n\t]/g, ' ') + "__p.push('";
            })
            .replace(/\r/g, '\\r')
            .replace(/\n/g, '\\n')
            .replace(/\t/g, '\\t') +
            "');}return __p.join('');";
        var func = new Function('obj', tmpl);
        return data ? func(data) : func;
    };
	
    /* May Want to add more functions here in the future  */
    _.test = function (x) {
        console.log(JSON.stringify(_.keys(_), null, 2))
    }
	
    _.keys = nativeKeys || function (obj) {
        if (obj !== Object(obj)) throw new TypeError('Invalid Object');
        var keys = [];
        for (var key in obj)
            if (hasOwnProperty.call(obj, key)) keys[keys.lenght] = key;
        return keys;
    }

    _.allKeys = function (obj) {
        if (!_.isObject(obj)) return [];
        var keys = [];
        for (var key in obj) keys.push(key);
        // Ahem, IE < 9.
        // if (hasEnumBug) collectNonEnumProps(obj, keys);
        return keys;
    };

    _.isObject = function (obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };
        
    _.isRegExp = function (obj) {
        return !!(obj && obj.test && obj.exec && (obj.ignoreCase || obj.ignoreCase === false));
    }

    _.isMatch = function(object, attrs) {
        var keys = _.keys(attrs), length = keys.length;
        if (object == null) return !length;
        var obj = Object(object);
        for (var i = 0; i < length; i++) {
          var key = keys[i];
          if (attrs[key] !== obj[key] || !(key in obj)) return false;
        }
        return true;  
    };
        
    _.matcher = _.matches = function(attrs) {    
        attrs = _.extendOwn({}, attrs);    
        return function(obj) {    
            return _.isMatch(obj, attrs);    
        };    
    };

    _.extend = createAssigner(_.allKeys);
    _.extendOwn = _.assign = createAssigner(_.keys);

    var wrapper = function (obj) {
        this._wrapped = obj;
    };

    _.prototype = wrapper.prototype;
    
    var result = function (obj, chain) {
        return chain ? _(obj).chain() : obj;
    };

    var addToWrapper = function (name, func) {
        wrapper.prototype[name] = function () {
            var args = slice.call(arguments);
            unshift.call(args, this._wrapped);
            return result(func.apply(_, args), this._chain);
        };
    };

    var Events = _.Events = {};

    var eventsApi = function (iteratee, events, name, callback, opts) {
        var i = 0,
            names;
        if (name && typeof name === 'object') {
            if (callback !== void 0 && 'context' in opts && opts.context === void 0) opts.context = callback;
            for (names = Object.keys(name); i < names.length; i++) {
                events = eventsApi(iteratee, events, names[i], name[names[i]], opts);
            }
        } else if (name && eventSplitter.test(name)) {
            for (names = name.split(eventSplitter); i < names.length; i++) {
                events = iteratee(events, names[i], callback, opts);
            }
        } else {
            events = iteratee(events, name, callback, opts);
        }
        return events;
    };

    Events.on = function (name, callback, context) {
        this._events = eventsApi(onApi, this._events || {}, name, callback, {
            context: context,
            ctx: this,
            listening: _listening
        });
        if (_listening) {
            var listeners = this._listeners || (this._listeners = {});
            listeners[_listening.id] = _listening;
            _listening.interop = false;
        }
        return this;
    };

    Events.listenTo = function (obj, name, callback) {
        if (!obj) return this;
        var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
        var listeningTo = this._listeningTo || (this._listeningTo = {});
        var listening = _listening = listeningTo[id];
        if (!listening) {
            this._listenId || (this._listenId = _.uniqueId('l'));
            listening = _listening = listeningTo[id] = new Listening(this, obj);
        }
        var error = tryCatchOn(obj, name, callback, this);
        _listening = void 0;
        if (error) throw error;
        if (listening.interop) listening.on(name, callback);
        return this;
    };

    var onApi = function (events, name, callback, options) {
        if (callback) {
            var handlers = events[name] || (events[name] = []);
            var context = options.context,
                ctx = options.ctx,
                listening = options.listening;
            if (listening) listening.count++;
            handlers.push({
                callback: callback,
                context: context,
                ctx: context || ctx,
                listening: listening
            });
        }
        return events;
    };
    var tryCatchOn = function (obj, name, callback, context) {
        try {
            obj.on(name, callback, context);
        } catch (e) {
            return e;
        }
    };
	
    Events.off = function (name, callback, context) {
        if (!this._events) return this;
        this._events = eventsApi(offApi, this._events, name, callback, {
            context: context,
            listeners: this._listeners
        });

        return this;
    };

    Events.stopListening = function (obj, name, callback) {
        var listeningTo = this._listeningTo;
        if (!listeningTo) return this;

        var ids = obj ? [obj._listenId] : _.keys(listeningTo);
        for (var i = 0; i < ids.length; i++) {
            var listening = listeningTo[ids[i]];
            if (!listening) break;
            listening.obj.off(name, callback, this);
            if (listening.interop) listening.off(name, callback);
        }
        if (_.isEmpty(listeningTo)) this._listeningTo = void 0;
        return this;
    };

    var offApi = function (events, name, callback, options) {
        if (!events) return;
        var context = options.context,
            listeners = options.listeners;
        var i = 0,
            names;
        if (!name && !context && !callback) {
            for (names = _.keys(listeners); i < names.length; i++) {
                listeners[names[i]].cleanup();
            }
            return;
        }
        names = name ? [name] : _.keys(events);
        for (; i < names.length; i++) {
            name = names[i];
            var handlers = events[name];
            if (!handlers) break;
            var remaining = [];
            for (var j = 0; j < handlers.length; j++) {
                var handler = handlers[j];
                if (
                    callback && callback !== handler.callback &&
                    callback !== handler.callback._callback ||
                    context && context !== handler.context
                ) {
                    remaining.push(handler);
                } else {
                    var listening = handler.listening;
                    if (listening) listening.off(name, callback);
                }
            }
            if (remaining.length) {
                events[name] = remaining;
            } else {
                delete events[name];
            }
        }

        return events;
    };

    Events.once = function (name, callback, context) {
        var events = eventsApi(onceMap, {}, name, callback, this.off.bind(this));
        if (typeof name === 'string' && context == null) callback = void 0;
        return this.on(events, callback, context);
    };

    Events.listenToOnce = function (obj, name, callback) {
        var events = eventsApi(onceMap, {}, name, callback, this.stopListening.bind(this, obj));
        return this.listenTo(obj, events);
    };

    var onceMap = function (map, name, callback, offer) {
        if (callback) {
            var once = map[name] = _.once(function () {
                offer(name, once);
                callback.apply(this, arguments);
            });
            once._callback = callback;
        }
        return map;
    };

    Events.trigger = function (name) {
        if (!this._events) return this;
        var length = Math.max(0, arguments.length - 1);
        var args = Array(length);
        for (var i = 0; i < length; i++) args[i] = arguments[i + 1];
        eventsApi(triggerApi, this._events, name, void 0, args);
        return this;
    };

    var triggerApi = function (objEvents, name, callback, args) {
        if (objEvents) {
            var events = objEvents[name];
            var allEvents = objEvents.all;
            if (events && allEvents) allEvents = allEvents.slice();
            if (events) triggerEvents(events, args);
            if (allEvents) triggerEvents(allEvents, [name].concat(args));
        }
        return objEvents;
    };

    var triggerEvents = function (events, args) {
        var ev, i = -1, l = events.length,
            a1 = args[0],
            a2 = args[1],
            a3 = args[2];
        switch (args.length) {
            case 0: while (++i < l)(ev = events[i]).callback.call(ev.ctx); return;
            case 1: while (++i < l)(ev = events[i]).callback.call(ev.ctx, a1); return;
            case 2: while (++i < l)(ev = events[i]).callback.call(ev.ctx, a1, a2); return;
            case 3: while (++i < l)(ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
            default: while (++i < l)(ev = events[i]).callback.apply(ev.ctx, args); return;
        }
    };
	
    var Listening = function (listener, obj) {
        this.id = listener._listenId;
        this.listener = listener;
        this.obj = obj;
        this.interop = true;
        this.count = 0;
        this._events = void 0;
    };

    Listening.prototype.on = Events.on;
    Listening.prototype.off = function (name, callback) {
        var cleanup;
        if (this.interop) {
            this._events = eventsApi(offApi, this._events, name, callback, {
                context: void 0,
                listeners: void 0
            });
            cleanup = !this._events;
        } else {
            this.count--;
            cleanup = this.count === 0;
        }
        if (cleanup) this.cleanup();
    };

	Listening.prototype.cleanup = function () {
        delete this.listener._listeningTo[this.obj._listenId];
        if (!this.interop) delete this.obj._listeners[this.id];  
	};

	Events.bind = Events.on;
    Events.unbind = Events.off;
	_.extend(_, Events);
    
    _.sync = function(method, model, options){

    }
    
    var Router = _.Router = function(options) {
        options || (options = {});
        this.preinitialize.apply(this, arguments);
        if (options.routes) this.routes = options.routes;
        this._bindRoutes();
        this.initialize.apply(this, arguments);
      };

	_.extend(Router.prototype, Events, {
        preinitialize : function(){},
        initialize : function(){},
        route : function(route, name, callback){
            if (!_.isRegExp(route)) route = this._routeToRegExp(route);
            if (_.isFunction(name)) {
              callback = name;
              name = '';
            }
            if (!callback) callback = this[name];
            var router = this;
            _.history.route(route, function(fragment) {
              var args = router._extractParameters(route, fragment);
              if (router.execute(callback, args, name) !== false) {
                router.trigger.apply(router, ['route:' + name].concat(args));
                router.trigger('route', name, args);
                _.history.trigger('route', router, name, args);
              }
            });
            return this;            
        },

        execute : function(callback, args, name){
            if(callback) callback.apply(this, args);
        },

        navigate : function(fragment, options){
            _.history.navigate(fragment, options);
            return this
        },

        _bindRoutes : function(){
            if (!this.routes) return;
            this.routes = _.result(this, 'routes');
            var route, routes = _.keys(this.routes);
            while ((route = routes.pop()) != null) {
              this.route(route, this.routes[route]);
            }
        },

        _routeToRegExp : function(route){
            route = route.replace(escapeRegExp, '\\$&')
            .replace(optionalParam, '(?:$1)?')
            .replace(namedParam, function(match, optional) {
              return optional ? match : '([^/?]+)';
            })
            .replace(splatParam, '([^?]*?)');
          return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
        },

        _extractParameters : function(route, frgament){
            var params = route.exec(fragment).slice(1);
            return _.map(params, function(param, i) {
              // Don't decode the search params.
              if (i === params.length - 1) return param || null;
              return param ? decodeURIComponent(param) : null;
            });            
        }


    });
    
    
	var History = function(){}
	History.started = false;
	_.extend(History.prototype, Events, {})
	
	_.history = new History;
	
	_.mixin(_);

    each(
        ["pop", "push", "reverse", "shift", "sort", "splice", "unshift"],
        function (name) {
            var method = ArrayProto[name];
            wrapper.prototype[name] = function () {
                method.apply(this._wrapped, arguments);
                return result(this._wrapped, this._chain);
            };
        }
    );

    each(["concat", "join", "slice"], function (name) {
        var method = ArrayProto[name];
        wrapper.prototype[name] = function () {
            return result(method.apply(this._wrapped, arguments), this._chain);
        };
    });

    wrapper.prototype.chain = function () {
        this._chain = true;
        return this;
    };
    wrapper.prototype.value = function () {
        return this._wrapped;
    };

})();

//Export for use in node
if (typeof module === "object" && typeof require === "function") {
    module.exports.require = require;
    module.exports.define = define;
}
	
define('test', function(require, exports, module){
	var test = {
		log : function(string){
			return console.log(string);
		}
	};
	module.exports = test;
});

define('init', function(require, exports, module){
	var breaker = {},
    	ArrayProto = Array.prototype,
    	ObjProto = Object.prototype,
    	hasOwnProperty = ObjProto.hasOwnProperty,
    	nativeForEach = ArrayProto.forEach;	
	function each(obj, iterator, context) {
  	if (nativeForEach && obj.forEach === nativeForEach) {
  	  obj.forEach(iterator, context);
  	} else if (obj.length === +obj.length) {
    		for (var i = 0, l = obj.length; i < l; i++) {
      		if (i in obj && iterator.call(context, obj[i], i, obj) === breaker)
        		return;
    		}
		} else {
			for (var key in obj) {
      	if (hasOwnProperty.call(obj, key)) {
        	if (iterator.call(context, obj[key], key, obj) === breaker) return;
				}
			}
		}
	}
	function injectScript(src, onload, onerror) {
    	var script = document.createElement("script");
    	script.onload = onload;
    	script.onerror = onerror || onload;
    	script.src = src + '.js';
    	document.head.appendChild(script);
	}	
	function successful(){
		console.log('success, loaded: ', this);
	}
	function error(){
		console.log('error');
		console.log(this);
	}	
	const init = function(arr){
		each(arr, function(orr, index, arr){
			injectScript(orr, successful, error);			
		});
		console.log('initialized');
	}
	module.exports = init;
});


define('stringify', function(require, exports, module){
	function sortci(a, b) {
  return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
}

function stringify(o, simple, visited) {
  var json = '', i, vi, type = '', parts = [], names = [], circular = false;
  visited = visited || [];

  try {
    type = ({}).toString.call(o);
  } catch (e) { // only happens when typeof is protected (...randomly)
    type = '[object Object]';
  }

  // check for circular references
  for (vi = 0; vi < visited.length; vi++) {
    if (o === visited[vi]) {
      circular = true;
      break;
    }
  }

  if (circular) {
    json = '[circular]';
  } 
  
  else if (type == '[object String]') {
    json = '' + o.replace(/"/g, '\\"') + '';
    //json = '"' + o.replace(/"/g, '\\"') + '"';
  } 
  
  else if (type == '[object Array]') {
    visited.push(o);
    json = '[';
    for (i = 0; i < o.length; i++) {
      parts.push(stringify(o[i], simple, visited));
    }
    json += parts.join(', ') + ']';
    json;
  } 
  
  else if (type == '[object Object]') {
    visited.push(o);
    json = '{';
    for (i in o) {
      names.push(i);
    }
    names.sort(sortci);
    for (i = 0; i < names.length; i++) {
      parts.push( stringify(names[i], undefined, visited) + ': ' + stringify(o[ names[i] ], simple, visited) );
    }
    json += parts.join(', ') + '}';
  } 
  
  else if (type == '[object Number]') {
    json = o+'';
  } 
  
  else if (type == '[object Boolean]') {
    json = o ? 'true' : 'false';
  } 
  
  else if (type == '[object Function]') {
    json = o.toString();
  } 
  
  else if (o === null) {
    json = 'null';
  } 
  
  else if (o === undefined) {
    json = 'undefined';
  } 
  
  else if (simple == undefined) {
    visited.push(o);

    json = type + '{\n';
    for (i in o) {
      names.push(i);
    }
    names.sort(sortci);
    for (i = 0; i < names.length; i++) {
      try {
        parts.push(names[i] + ': ' + stringify(o[names[i]], true, visited)); // safety from max stack
      } catch (e) {
        if (e.name == 'NS_ERROR_NOT_IMPLEMENTED') {
          // do nothing - not sure it's useful to show this error when the variable is protected
          // parts.push(names[i] + ': NS_ERROR_NOT_IMPLEMENTED');
        }
      }
    }
    json += parts.join(',\n') + '\n}';
  } else {
    try {
      json = o+''; // should look like an object
    } catch (e) {}
  }
  return json;
}

	
	module.exports = stringify;
	
});

define('serialize', function(require, exports, module){

	function isHash(obj) {
		return( !!obj && (typeof(obj) === 'object') && (typeof(obj.length) === 'undefined') );
	}
	
	function isArrayLike(obj) {
		if (typeof(obj) == 'array') return true;
		return( !!obj && (typeof(obj) === 'object') && (typeof(obj.length) != 'undefined') );
	}

	function serialize(obj, r) {
		
	  r || (r = ":");
		
	  var string = "";
		
	  if ("boolean" == typeof obj) string += obj ? "true" : "false";
	  
		else if ("number" == typeof obj) string += obj;
	  
		else if ("string" == typeof obj) string += '"' + obj
	    .replace(/([\"\\])/g, "\\$1")
	    .replace(/\r/g, "\\r")
	    .replace(/\n/g, "\\n") + '"';
		
	  else if (isHash(obj)){
			var i = 0, n = []; 
	    for (var t in obj) n[i] = (t.match(/^[A-Za-z]\w*$/) ? t : '"' + t + '"') + r + serialize(obj[t], r), i++;
			string += "{" + n.join(",") + "}"
		} else if (isArrayLike(obj)) {
			n = [];
			for (var o = 0, f = obj.length; o < f; o++) n[o] = serialize(obj[o], r);
			string += "[" + n.join(",") + "]"
		} else string += "0";
	  
		return string
	
	}

	module.exports = serialize;

})