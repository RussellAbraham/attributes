/**/
/*!
 * Symbol-ES6 v0.1.2
 * ES6 Symbol polyfill in pure ES5.
 *
 * @license Copyright (c) 2017-2018 Rousan Ali, MIT License
 *
 * Codebase: https://github.com/rousan/symbol-es6
 * Date: 28th Jan, 2018
 */

(function (global, factory) {

    "use strict";

    if (typeof module === "object" && typeof module.exports === "object") {
        // For the environment like NodeJS, CommonJS etc where module or
        // module.exports objects are available
        module.exports = factory(global);
    } else {
        // For browser context, where global object is window
        factory(global);
    }

    /* window is for browser environment and global is for NodeJS environment */
})(typeof window !== "undefined" ? window : global, function (global) {

    "use strict";

    var defineProperty = Object.defineProperty;

    var defineProperties = Object.defineProperties;

    var symbolHiddenCounter = 0;

    var globalSymbolRegistry = [];

    var slice = Array.prototype.slice;

    var ES6 = typeof global.ES6 === "object" ? global.ES6 : (global.ES6 = {});

    var isArray = Array.isArray;

    var objectToString = Object.prototype.toString;

    var push = Array.prototype.push;

    var emptyFunction = function () {};

    var simpleFunction = function (arg) {
        return arg;
    };

    var isCallable = function (fn) {
        return typeof fn === 'function';
    };

    var isConstructor = function (fn) {
        return isCallable(fn);
    };

    var Iterator = function () {};

    var ArrayIterator = function ArrayIterator(array, flag) {
        this._array = array;
        this._flag = flag;
        this._nextIndex = 0;
    };

    var StringIterator = function StringIterator(string, flag) {
        this._string = string;
        this._flag = flag;
        this._nextIndex = 0;
    };

    var isES6Running = function() {
        return false; /* Now 'false' for testing purpose */
    };

    var isObject = function (value) {
        return value !== null && (typeof value === "object" || typeof value === "function");
    };

    var es6FunctionPrototypeHasInstanceSymbol = function (instance) {
        if (typeof this !== "function")
            return false;
        return instance instanceof this;
    };

    var es6InstanceOfOperator = function (object, constructor) {
        if (!isObject(constructor))
            throw new TypeError("Right-hand side of 'instanceof' is not an object");

        var hasInstanceSymbolProp = constructor[Symbol.hasInstance];
        if (typeof hasInstanceSymbolProp === "undefined") {
            return object instanceof constructor;
        } else if(typeof hasInstanceSymbolProp !== "function") {
            throw new TypeError(typeof hasInstanceSymbolProp + " is not a function");
        } else {
            return hasInstanceSymbolProp.call(constructor, object);
        }
    };

    // Generates name for a symbol instance and this name will be used as
    // property key for property symbols internally.
    var generateSymbolName = function (id) {
        return "@@_____" + id + "_____";
    };

    // Generates id for next Symbol instance
    var getNextSymbolId = function () {
        return symbolHiddenCounter++;
    };

    var setupSymbolInternals = function (symbol, desc) {
        defineProperties(symbol, {
            _description: {
                value: desc
            },
            _isSymbol: {
                value: true
            },
            _id: {
                value: getNextSymbolId()
            }
        });
        return symbol;
    };

    var checkSymbolInternals = function (symbol) {
        return symbol._isSymbol === true && typeof symbol._id === "number" && typeof symbol._description === "string";
    };

    var isSymbol = function (symbol) {
        return symbol instanceof Symbol && checkSymbolInternals(symbol);
    };

    var symbolFor = function (key) {
        key = String(key);
        var registryLength = globalSymbolRegistry.length,
            record,
            i = 0;

        for(; i<registryLength; ++i) {
            record = globalSymbolRegistry[i];
            if (record.key === key)
                return record.symbol;
        }

        record = {
            key: key,
            symbol: Symbol(key)
        };
        globalSymbolRegistry.push(record);
        return record.symbol;
    };

    var symbolKeyFor = function (symbol) {
        if (!ES6.isSymbol(symbol))
            throw new TypeError(String(symbol) + " is not a symbol");
        var registryLength = globalSymbolRegistry.length,
            record,
            i = 0;

        for(; i<registryLength; ++i) {
            record = globalSymbolRegistry[i];
            if (record.symbol === symbol)
                return record.key;
        }
    };

    /* It affects array1 and appends array2 at the end of array1 */
    var appendArray = function (array1, array2) {
        // Returns immediately if these are not array or not array-like objects
        if (!(typeof array1.length === "number" && array1.length >= 0 && typeof array2.length === "number" && array2.length >= 0))
            return;
        var length1 = Math.floor(array1.length),
            length2 = Math.floor(array2.length),
            i = 0;

        array1.length = length1 + length2;
        for (; i<length2; ++i)
            if (array2.hasOwnProperty(i))
                array1[length1 + i] = array2[i];
    };

    var es6ObjectPrototypeToString = function toString() {
        if (this === undefined || this === null)
            return objectToString.call(this);
        // Add support for @@toStringTag symbol
        if (typeof this[Symbol.toStringTag] === "string")
            return "[object " + this[Symbol.toStringTag] + "]";
        else
            return objectToString.call(this);
    };

    var es6ArrayPrototypeConcat = function concat() {
        if (this === undefined || this === null)
            throw new TypeError("Array.prototype.concat called on null or undefined");

        // Boxing 'this' value to wrapper object
        var self = Object(this),
            targets = slice.call(arguments),
            outputs = []; // Later it may affected by Symbol

        targets.unshift(self);

        targets.forEach(function (target) {
            // If target is primitive then just push
            if (!isObject(target))
                outputs.push(target);
            // Here Symbol.isConcatSpreadable support is added
            else if (typeof target[Symbol.isConcatSpreadable] !== "undefined") {
                if (target[Symbol.isConcatSpreadable]) {
                    appendArray(outputs, target);
                } else {
                    outputs.push(target);
                }
            } else if (isArray(target)) {
                appendArray(outputs, target);
            } else {
                outputs.push(target);
            }
        });
        return outputs;
    };

    var es6ForOfLoop = function (iterable, callback, thisArg) {
        callback = typeof callback !== "function" ? emptyFunction : callback;
        if (typeof iterable[Symbol.iterator] !== "function")
            throw new TypeError("Iterable[Symbol.iterator] is not a function");
        var iterator = iterable[Symbol.iterator](),
            iterationResult;
        if (typeof iterator.next !== "function")
            throw new TypeError(".iterator.next is not a function");
        while (true) {
            iterationResult = iterator.next();
            if (!isObject(iterationResult))
                throw new TypeError("Iterator result " + iterationResult + " is not an object");
            if (iterationResult.done)
                break;
            callback.call(thisArg, iterationResult.value);
        }
    };

    // Provides simple inheritance functionality
    var simpleInheritance = function (child, parent) {
        if (typeof child !== "function" || typeof parent !== "function")
            throw new TypeError("Child and Parent must be function type");

        child.prototype = Object.create(parent.prototype);
        child.prototype.constructor = child;
    };

    // Behaves as Symbol function in ES6, take description and returns an unique object,
    // but in ES6 this function returns 'symbol' primitive typed value.
    // Its type is 'object' not 'symbol'.
    // There is no wrapping in this case i.e. Object(sym) = sym.
    var Symbol = function Symbol(desc) {
        desc = typeof desc === "undefined" ? "" : String(desc);

        if(this instanceof Symbol)
            throw new TypeError("Symbol is not a constructor");

        return setupSymbolInternals(Object.create(Symbol.prototype), desc);
    };

    defineProperties(Symbol, {

        "for": {
            value: symbolFor,
            writable: true,
            configurable: true
        },

        "keyFor": {
            value: symbolKeyFor,
            writable: true,
            configurable: true
        },

        "hasInstance": {
            value: Symbol("Symbol.hasInstance")
        },

        "isConcatSpreadable": {
            value: Symbol("Symbol.isConcatSpreadable")
        },

        "iterator": {
            value: Symbol("Symbol.iterator")
        },

        "toStringTag": {
            value: Symbol("Symbol.toStringTag")
        }
    });

    // In ES6, this function returns like 'Symbol(<desc>)', but in this case
    // this function returns the symbol's internal name to work properly.
    Symbol.prototype.toString = function () {
        return generateSymbolName(this._id);
    };

    // Returns itself but in ES6 It returns 'symbol' typed value.
    Symbol.prototype.valueOf = function () {
        return this;
    };

    // Make Iterator like iterable
    defineProperty(Iterator.prototype, Symbol.iterator.toString(), {
        value: function () {return this;},
        writable: true,
        configurable: true
    });

    simpleInheritance(ArrayIterator, Iterator);

    simpleInheritance(StringIterator, Iterator);

    defineProperty(ArrayIterator.prototype, Symbol.toStringTag.toString(), {
        value: "Array Iterator",
        configurable: true
    });

    defineProperty(StringIterator.prototype, Symbol.toStringTag.toString(), {
        value: "String Iterator",
        configurable: true
    });

    // This iterator works on any Array or TypedArray or array-like objects
    ArrayIterator.prototype.next = function next() {
        if (!(this instanceof ArrayIterator))
            throw new TypeError("Method Array Iterator.prototype.next called on incompatible receiver " + String(this));

        var self = this,
            nextValue;

        if (self._nextIndex === -1) {
            return {
                done: true,
                value: undefined
            };
        }

        if (!(typeof self._array.length === "number" && self._array.length >= 0)) {
            self._nextIndex = -1;
            return {
                done: true,
                value: undefined
            };
        }

        // _flag = 1 for [index, value]
        // _flag = 2 for [value]
        // _flag = 3 for [index]
        if (self._nextIndex < Math.floor(self._array.length)) {
            if (self._flag === 1)
                nextValue = [self._nextIndex, self._array[self._nextIndex]];
            else if (self._flag === 2)
                nextValue = self._array[self._nextIndex];
            else if (self._flag === 3)
                nextValue = self._nextIndex;
            self._nextIndex++;
            return {
                done: false,
                value: nextValue
            };
        } else {
            self._nextIndex = -1;
            return {
                done: true,
                value: undefined
            };
        }
    };

    StringIterator.prototype.next = function next() {
        if (!(this instanceof StringIterator))
            throw new TypeError("Method String Iterator.prototype.next called on incompatible receiver " + String(this));

        var self = this,
            stringObject = new String(this._string),
            nextValue;

        if (self._nextIndex === -1) {
            return {
                done: true,
                value: undefined
            };
        }

        if (self._nextIndex < stringObject.length) {
            nextValue = stringObject[self._nextIndex];
            self._nextIndex++;
            return {
                done: false,
                value: nextValue
            };
        } else {
            self._nextIndex = -1;
            return {
                done: true,
                value: undefined
            };
        }
    };

    var es6ArrayPrototypeIteratorSymbol = function values() {
        if (this === undefined || this === null)
            throw new TypeError("Cannot convert undefined or null to object");

        var self = Object(this);
        return new ArrayIterator(self, 2);
    };

    var es6StringPrototypeIteratorSymbol = function values() {
        if (this === undefined || this === null)
            throw new TypeError("String.prototype[Symbol.iterator] called on null or undefined");
        return new StringIterator(String(this), 0);
    };

    var es6ArrayPrototypeEntries = function entries() {
        if (this === undefined || this === null)
            throw new TypeError("Cannot convert undefined or null to object");

        var self = Object(this);
        return new ArrayIterator(self, 1);
    };

    var es6ArrayPrototypeKeys = function keys() {
        if (this === undefined || this === null)
            throw new TypeError("Cannot convert undefined or null to object");
        var self = Object(this);
        return new ArrayIterator(self, 3);
    };

    var SpreadOperatorImpl = function (target, thisArg) {
        this._target = target;
        this._values = [];
        this._thisArg = thisArg;
    };
    // All the arguments must be iterable
    SpreadOperatorImpl.prototype.spread = function () {
        var self = this;
        slice.call(arguments).forEach(function (iterable) {
            ES6.forOf(iterable, function (value) {
                self._values.push(value);
            });
        });
        return self;
    };

    SpreadOperatorImpl.prototype.add = function () {
        var self = this;
        slice.call(arguments).forEach(function (value) {
            self._values.push(value);
        });
        return self;
    };

    SpreadOperatorImpl.prototype.call = function (thisArg) {
        if (typeof this._target !== "function")
            throw new TypeError("Target is not a function");
        thisArg = arguments.length <= 0 ? this._thisArg : thisArg;
        return this._target.apply(thisArg, this._values);
    };

    SpreadOperatorImpl.prototype.new = function () {
        if (typeof this._target !== "function")
            throw new TypeError("Target is not a constructor");

        var temp,
            returnValue;
        temp = Object.create(this._target.prototype);
        returnValue = this._target.apply(temp, this._values);
        return isObject(returnValue) ? returnValue : temp;
    };

    // Affects the target array
    SpreadOperatorImpl.prototype.array = function () {
        if (!isArray(this._target))
            throw new TypeError("Target is not a array");
        push.apply(this._target, this._values);
        return this._target;
    };

    // Target must be Array or function
    var es6SpreadOperator = function spreadOperator(target, thisArg) {
        if (!(typeof target === "function" || isArray(target)))
            throw new TypeError("Spread operator only supports on array and function objects at this moment");
        return new SpreadOperatorImpl(target, thisArg);
    };

    var es6ArrayFrom = function from(arrayLike, mapFn, thisArg) {
        var constructor,
            i = 0,
            length,
            outputs;
        // Use the generic constructor
        constructor = !isConstructor(this) ? Array : this;
        if (arrayLike === undefined || arrayLike === null)
            throw new TypeError("Cannot convert undefined or null to object");

        arrayLike = Object(arrayLike);
        if (mapFn === undefined)
            mapFn = simpleFunction;
        else if (!isCallable(mapFn))
            throw new TypeError(mapFn + " is not a function");

        if (typeof arrayLike[Symbol.iterator] === "undefined") {
            if (!(typeof arrayLike.length === "number" && arrayLike.length >= 0)) {
                outputs = new constructor(0);
                outputs.length = 0;
                return outputs;
            }
            length = Math.floor(arrayLike.length);
            outputs = new constructor(length);
            outputs.length = length;
            for(; i < length; ++i)
                outputs[i] = mapFn.call(thisArg, arrayLike[i]);
        } else {
            outputs = new constructor();
            outputs.length = 0;
            ES6.forOf(arrayLike, function (value) {
                outputs.length++;
                outputs[outputs.length - 1] = mapFn.call(thisArg, value);
            });
        }
        return outputs;
    };

    // Export ES6 APIs and add all the patches to support Symbol in ES5
    // If the running environment already supports ES6 then no patches will be applied,
    if (isES6Running())
        return ES6;
    else {

        // Some ES6 APIs can't be implemented in pure ES5, so this 'ES6' object provides
        // some equivalent functionality of these features.
        defineProperties(ES6, {

            // Checks if a JS value is a symbol
            // It can be used as equivalent api in ES6: typeof symbol === 'symbol'
            isSymbol: {
                value: isSymbol,
                writable: true,
                configurable: true
            },

            // Native ES5 'instanceof' operator does not support @@hasInstance symbol,
            // this method provides same functionality of ES6 'instanceof' operator.
            instanceOf: {
                value: es6InstanceOfOperator,
                writable: true,
                configurable: true
            },

            // This method behaves exactly same as ES6 for...of loop.
            forOf: {
                value: es6ForOfLoop,
                writable: true,
                configurable: true
            },

            // This method gives same functionality of the spread operator of ES6
            // It works on only functions and arrays.
            // Limitation: You can't create array like this [...iterable, , , , 33] by this method,
            // to achieve this you have to do like this [...iterable, undefined, undefined, undefined, 33]
            spreadOperator: {
                value: es6SpreadOperator,
                writable: true,
                configurable: true
            }
        });

        defineProperty(global, "Symbol", {
            value: Symbol,
            writable: true,
            configurable: true
        });

        defineProperty(Function.prototype, Symbol.hasInstance.toString(), {
            value: es6FunctionPrototypeHasInstanceSymbol
        });

        defineProperty(Array.prototype, "concat", {
            value: es6ArrayPrototypeConcat,
            writable: true,
            configurable: true
        });

        defineProperty(Object.prototype, "toString", {
            value: es6ObjectPrototypeToString,
            writable: true,
            configurable: true
        });

        defineProperty(Array.prototype, Symbol.iterator.toString(), {
            value: es6ArrayPrototypeIteratorSymbol,
            writable: true,
            configurable: true
        });

        defineProperty(Array, "from", {
            value: es6ArrayFrom,
            writable: true,
            configurable: true
        });

        defineProperty(Array.prototype, "entries", {
            value: es6ArrayPrototypeEntries,
            writable: true,
            configurable: true
        });

        defineProperty(Array.prototype, "keys", {
            value: es6ArrayPrototypeKeys,
            writable: true,
            configurable: true
        });

        defineProperty(String.prototype, Symbol.iterator.toString(), {
            value: es6StringPrototypeIteratorSymbol,
            writable: true,
            configurable: true
        });
    }

    return ES6;
});


// FINGERBLAST.js
// --------------
// Adapted from phantom limb by Brian Cartensen

/* jshint bitwise: false */
/* global GLOBAL: true */

(function () {

    'use strict';
  
    function FingerBlast(element) {
      this.element = typeof element === 'string' ? document.querySelector(element) : element;
  
      if (this.element) {
        this.listen();
      }
    }
  
    FingerBlast.prototype = {
      x: NaN,
      y: NaN,
  
      startDistance: NaN,
      startAngle:    NaN,
  
      mouseIsDown: false,
  
      listen: function () {
        var activate = this.activate.bind(this);
        var deactivate = this.deactivate.bind(this);
  
        function contains (element, ancestor) {
          var descendants;
          var index;
          var descendant;
  
          if (!element) {
            return;
          }
  
          if ('compareDocumentPosition' in ancestor) {
            return !!(ancestor.compareDocumentPosition(element) & 16);
          } else if ('contains' in ancestor) {
            return ancestor !== element && ancestor.contains(element);
          } else {
            for ((descendants = ancestor.getElementsByTagName('*')), index = 0; (descendant = descendants[index++]);) {
              if (descendant === element) {
                return true;
              }
            }
            return false;
          }
        }
  
        this.element.addEventListener('mouseover', function (e) {
          var target = e.relatedTarget;
          if (target !== this && !contains(target, this)) {
            activate();
          }
        });
  
        this.element.addEventListener('mouseout', function (e) {
          var target = e.relatedTarget;
          if (target !== this && !contains(target, this)) {
            deactivate(e);
          }
        });
      },
  
      activate: function () {
        if (this.active) {
          return;
        }
        this.element.addEventListener('mousedown', (this.touchStart = this.touchStart.bind(this)), true);
        this.element.addEventListener('mousemove', (this.touchMove  = this.touchMove.bind(this)),  true);
        this.element.addEventListener('mouseup',   (this.touchEnd   = this.touchEnd.bind(this)),   true);
        this.element.addEventListener('click',     (this.click      = this.click.bind(this)),      true);
        this.active = true;
      },
  
      deactivate: function (e) {
        this.active = false;
        if (this.mouseIsDown) {
          this.touchEnd(e);
        }
        this.element.removeEventListener('mousedown', this.touchStart, true);
        this.element.removeEventListener('mousemove', this.touchMove,  true);
        this.element.removeEventListener('mouseup',   this.touchEnd,   true);
        this.element.removeEventListener('click',     this.click,      true);
      },
  
      click: function (e) {
        if (e.synthetic) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
      },
  
      touchStart: function (e) {
        if (e.synthetic || /input|textarea/.test(e.target.tagName.toLowerCase())) {
          return;
        }
  
        this.mouseIsDown = true;
  
        e.preventDefault();
        e.stopPropagation();
  
        this.fireTouchEvents('touchstart', e);
      },
  
      touchMove: function (e) {
        if (e.synthetic) {
          return;
        }
  
        e.preventDefault();
        e.stopPropagation();
  
        this.move(e.clientX, e.clientY);
  
        if (this.mouseIsDown) {
          this.fireTouchEvents('touchmove', e);
        }
      },
  
      touchEnd: function (e) {
        if (e.synthetic) {
          return;
        }
  
        this.mouseIsDown = false;
  
        e.preventDefault();
        e.stopPropagation();
  
        this.fireTouchEvents('touchend', e);
  
        if (!this.target) {
          return;
        }
  
        // Mobile Safari moves all the mouse events to fire after the touchend event.
        this.target.dispatchEvent(this.createMouseEvent('mouseover', e));
        this.target.dispatchEvent(this.createMouseEvent('mousemove', e));
        this.target.dispatchEvent(this.createMouseEvent('mousedown', e));
      },
  
      fireTouchEvents: function (eventName, originalEvent) {
        var events   = [];
        var gestures = [];
  
        if (!this.target) {
          return;
        }
  
        // Convert 'ontouch*' properties and attributes to listeners.
        var onEventName = 'on' + eventName;
  
        if (onEventName in this.target) {
          console.warn('Converting `' + onEventName + '` property to event listener.', this.target);
          this.target.addEventListener(eventName, this.target[onEventName], false);
          delete this.target[onEventName];
        }
  
        if (this.target.hasAttribute(onEventName)) {
          console.warn('Converting `' + onEventName + '` attribute to event listener.', this.target);
          var handler = new GLOBAL.Function('event', this.target.getAttribute(onEventName));
          this.target.addEventListener(eventName, handler, false);
          this.target.removeAttribute(onEventName);
        }
  
        // Set up a new event with the coordinates of the finger.
        var touch = this.createMouseEvent(eventName, originalEvent);
  
        events.push(touch);
  
        // Figure out scale and rotation.
        if (events.length > 1) {
          var x = events[0].pageX - events[1].pageX;
          var y = events[0].pageY - events[1].pageY;
  
          var distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
          var angle = Math.atan2(x, y) * (180 / Math.PI);
  
          var gestureName = 'gesturechange';
  
          if (eventName === 'touchstart') {
            gestureName = 'gesturestart';
            this.startDistance = distance;
            this.startAngle = angle;
          }
  
          if (eventName === 'touchend') {
            gestureName = 'gestureend';
          }
  
          events.forEach(function(event) {
            var gesture = this.createMouseEvent.call(event._finger, gestureName, event);
            gestures.push(gesture);
          }.bind(this));
  
          events.concat(gestures).forEach(function(event) {
            event.scale = distance / this.startDistance;
            event.rotation = this.startAngle - angle;
          });
        }
  
        // Loop through the events array and fill in each touch array.
        events.forEach(function(touch) {
          touch.touches = events.filter(function(e) {
            return ~e.type.indexOf('touch') && e.type !== 'touchend';
          });
  
          touch.changedTouches = events.filter(function(e) {
            return ~e.type.indexOf('touch') && e._finger.target === touch._finger.target;
          });
  
          touch.targetTouches = touch.changedTouches.filter(function(e) {
            return ~e.type.indexOf('touch') && e.type !== 'touchend';
          });
        });
  
        // Then fire the events.
        events.concat(gestures).forEach(function(event, i) {
          event.identifier = i;
          event._finger.target.dispatchEvent(event);
        });
      },
  
      createMouseEvent: function (eventName, originalEvent) {
        var e = new MouseEvent(eventName, {
          view       : window,
          detail     : originalEvent.detail,
          bubbles    : true,
          cancelable : true,
          target     : this.target || originalEvent.relatedTarget,
          clientX    : this.x || originalEvent.clientX,
          clientY    : this.y || originalEvent.clientY,
          screenX    : this.x || originalEvent.screenX,
          screenY    : this.y || originalEvent.screenY,
          ctrlKey    : originalEvent.ctrlKey,
          shiftKey   : originalEvent.shiftKey,
          altKey     : originalEvent.altKey,
          metaKey    : originalEvent.metaKey,
          button     : originalEvent.button
        });
  
        e.synthetic = true;
        e._finger   = this;
  
        return e;
      },
  
      move: function (x, y) {
        if (isNaN(x) || isNaN(y)) {
          this.target = null;
        } else {
          this.x = x;
          this.y = y;
  
          if (!this.mouseIsDown) {
            this.target = document.elementFromPoint(x, y);
          }
        }
      }
    };
  
    window.FingerBlast = FingerBlast;
  
  }());
  