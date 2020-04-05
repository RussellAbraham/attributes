function isObject(obj) {
    return obj === Object(obj);
}

function isArray(obj) {
    return toString.call(obj) === "[object Array]";
}

function isString(obj) {
    return !!(obj === "" || (obj && obj.charCodeAt && obj.substr));
}

function isBoolean(obj) {
    return obj === true || obj === false;
}

function isNumber(obj) {
    return !!(obj === 0 || (obj && obj.toExponential && obj.toFixed));
}

function isNull(obj) {
    return obj === null;
}

function isUndefined(obj) {
    return obj === void 0;
}

const types = [
    { name: 'date',      color: '' },
    { name: 'array',     color: '' },
    { name: 'object',    color: '' },
    { name: 'boolean',   color: '' },
    { name: 'number',    color: '' },
    { name: 'string',    color: '' },
    { name: 'undefined', color: '' },
    { name: 'null',      color: '' },
    { name: 'error',     color: '' }
];

var index,
    len = types.length,
    domNodeParent, 
    domNodeChild, 
    domNodeFragment = new DocumentFragment();

function domNode(target, element, attrs, text) {
    domNodeParent = document.createElement(element);
    domNodeChild = document.createTextNode(text); 
    for (var attr in attrs) { 
        domNodeParent.setAttribute(attr, attrs[attr]) 
    } if (text) { 
        domNodeParent.appendChild(domNodeChild); 
    } 
    return target.appendChild(domNodeParent);
}

function appendToFragment(className, color, target, output) {
    domNodeParent = domNode(domNodeFragment, 'ul', { class: 'standard', style: '' });    
    domNodeChild = domNode(domNodeParent, 'code', { class: className, style: 'color:' + color + ';' }, output);
    target.appendChild(domNodeFragment);
}
	
function insertTextNodeBefore(node){
  var log = document.getElementById("log");
  log.insertBefore(node, log.childNodes[0]);
}


function log(d) {
    isObject(d) && (domNodeParent = domNode(domNodeFragment, "pre", {
        class: "standard",
        style: ""
    }), domNodeChild = domNode(domNodeParent, "code", {
        class: "object",
        style: "color:violet;"
    }, d)), 
    
    isBoolean(d) && (domNodeParent = domNode(domNodeFragment, "pre", {
        class: "standard",
        style: ""
    }), domNodeChild = domNode(domNodeParent, "code", {
        class: "boolean",
        style: "color:indigo"
    }, d)), 
    
    isString(d) && (domNodeParent = domNode(domNodeFragment, "pre", {
        class: "standard",
        style: ""
    }), domNodeChild = domNode(domNodeParent, "code", {
        class: "string",
        style: "color:steelblue;"
    }, d)), 
    
    isNumber(d) && (domNodeParent = domNode(domNodeFragment, "pre", {
        class: "standard",
        style: ""
    }), domNodeChild = domNode(domNodeParent, "code", {
        class: "number",
        style: "color:limegreen;"
    }, d)), 
    
    isNull(d) && (domNodeParent = domNode(domNodeFragment, "pre", {
        class: "",
        style: ""
    }), domNodeChild = domNode(domNodeParent, "code", {
        class: "null",
        style: ""
    }, d)), 
    
    isUndefined(d) && (domNodeParent = domNode(domNodeFragment, "pre", {
        class: "",
        style: ""
    }), domNodeChild = domNode(domNodeParent, "code", {
        class: "undefined",
        style: ""
    }, d)),
			
			insertTextNodeBefore(domNodeFragment)
}

