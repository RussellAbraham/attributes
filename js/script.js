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




const App = {};



App.Router = Backbone.Router.extend({

	
            routes: {
							
							/*
                '3d': '3d',
							
                'appcache': 'appcache',
							
                'audio.tests': 'audio.tests',
                'appcache': 'appcache',
							
                'audio.tests': 'audio.tests',
							
                'base32_decode_file': 'base32_decode_file',
                'base32_decode': 'base32_decode',
                'base32_encode_file': 'base32_encode_file',
                'base32_encode': 'base32_encode',
                'base64_decode_file': 'base64_decode_file',
                'base64_decode': 'base64_decode',
                'base64_encode_file': 'base64_encode_file',
                'base64_encode': 'base64_encode',
							
                'blank': 'blank', */
							
                'bookmarker': 'bookmarker',
							
							/*
                'browser': 'browser',
							
                'canvas': 'canvas',
                'channel': 'channel',
                'circles': 'circles',
                'clipboard': 'clipboard',
                'commander': 'commander',
                'config': 'config',
                'console': 'console',

                'core.webaudio': 'core.webaudio',
                'crc16_checksum': 'crc16_checksum',
                'crc16': 'crc16',
                'crc32_checksum': 'crc32_checksum',
                'crc32': 'crc32',
                'css': 'css',
                'demo': 'demo',
                'dex': 'dex',
                'downloads': 'downloads',
                'driver': 'driver',
                'driverquery': 'driverquery',
                'editor': 'editor',
                'eruda': 'eruda',
                'faker': 'faker',
                'html_decode': 'html_decode',
                'html_encode': 'html_encode',

                'html': 'html',

                'html5.terminal': 'html5.terminal',

                'idb': 'idb',
                'image.editor': 'image.editor',
                'images': 'images',


                'index': 'index',
                'inspector': 'inspector',
                'inspectorBB': 'inspectorBB',

                'javascript': 'javascript',


                'jquery.terminal': 'jquery.terminal',

                'js': 'js',

                'json': 'json',

                'jsrepl': 'jsrepl',


                'keccak_224_checksum': 'keccak_224_checksum',
                'keccak_224': 'keccak_224',
                'keccak_256_checksum': 'keccak_256_checksum',
                'keccak_256': 'keccak_256',
                'keccak_384_checksum': 'keccak_384_checksum',
                'keccak_384': 'keccak_384',
                'keccak_512_checksum': 'keccak_512_checksum',
                'keccak_512': 'keccak_512',

                'keyboard': 'keyboard',
                'keypress': 'keypress',

                'list': 'list',
                'local': 'local',
                'localforage': 'localforage',

                'localhost': 'localhost',


                'login🐱‍👤': 'login🐱‍👤',

                'md2_file_hash': 'md2_file_hash',
                'md2': 'md2',
                'md4_file_hash': 'md4_file_hash',
                'md4': 'md4',
                'md5_checksum': 'md5_checksum',
                'md5': 'md5',

                'mobile': 'mobile',
                'moment': 'moment',

                'omnibox': 'omnibox',

                'player': 'player',

                'post': 'post',

                'redirect': 'redirect',
                'register': 'register',
                'repl': 'repl',
                'repl15': 'repl15',
                'require': 'require',
                'root': 'root',
                'router': 'router',

                'search': 'search',

                'sha1_checksum': 'sha1_checksum',
                'sha1': 'sha1',
                'sha224_checksum': 'sha224_checksum',
                'sha224': 'sha224',
                'sha256_checksum': 'sha256_checksum',
                'sha256': 'sha256',
                'sha3_224_checksum': 'sha3_224_checksum',
                'sha3_224': 'sha3_224',
                'sha3_256_checksum': 'sha3_256_checksum',
                'sha3_256': 'sha3_256',
                'sha3_384_checksum': 'sha3_384_checksum',
                'sha3_384': 'sha3_384',
                'sha3_512_checksum': 'sha3_512_checksum',
                'sha3_512': 'sha3_512',
                'sha384_checksum': 'sha384_checksum',
                'sha384_file_hash': 'sha384_file_hash',
                'sha384': 'sha384',
                'sha512_224_checksum': 'sha512_224_checksum',
                'sha512_224_file_hash': 'sha512_224_file_hash',
                'sha512_224': 'sha512_224',
                'sha512_256_checksum': 'sha512_256_checksum',
                'sha512_256_file_hash': 'sha512_256_file_hash',
                'sha512_256': 'sha512_256',
                'sha512_checksum': 'sha512_checksum',
                'sha512_file_hash': 'sha512_file_hash',
                'sha512': 'sha512',

                'shake_128_checksum': 'shake_128_checksum',
                'shake_128': 'shake_128',
                'shake_256_checksum': 'shake_256_checksum',
                'shake_256': 'shake_256',

                'spatial': 'spatial',

                'syntax_highlight': 'syntax_highlight',

                'tasks': 'tasks',
                'term': 'term',

                'terminal': 'terminal',
                'toc': 'toc',

                'todos.backbone': 'todos.backbone',

                'unzip': 'unzip',

                'url_decode': 'url_decode',
                'url_encode': 'url_encode',

                'vconsole': 'vconsole',

                'webkit': 'webkit',

                'wysiwyg': 'wysiwyg',

                'zip': 'zip' 
								*/
            },
	
		bookmarker : function(){
			
		}

        
});
