/* argument name is arbitrary, for readability ive chosen object */
(function(object){
	
	const ids = [ 'template' ];
	const txt = document.createTextNode.bind(document);	
	
	var parentNode,  childNode, cloneNode, collapseNode;
	
	ids.forEach(function(id) {
	  window[id] = document.getElementById(id);
	});
	
	object['fragment'] = new DocumentFragment();
	
	object['fragment'].append = function(element){ 
		return object.fragment.appendChild(element);	
	}
	object['fragment'].render = function(target){ 
		return target.appendChild(object.fragment); 
	}
	object['fragment'].$ = function(target){
		return object.fragment.querySelector(target);
	}
	
	function Template(lists){
		
		var self = this;
	  
		self.lists = lists;
	  self.index = 0;
	  
		var i, len = self.lists.length;
		
		for(i = 0;i < len;i++){    
			cloneNode = template.content.cloneNode(true);
			parentNode = cloneNode.querySelectorAll('.list');
	    childNode = cloneNode.querySelectorAll('.link');
			collapseNode = cloneNode.querySelectorAll('.collapse');    
			parentNode[0].id = 'list' + i;
			childNode[0].id = 'link' + i;	
			childNode[0].setAttribute('data-target', '#collapse' + i);
			childNode[0].setAttribute('aria-controls', 'collapse' + i);
			collapseNode[0].id = 'collapse' + i;
			object['fragment'].append(cloneNode);
			
		}
		
		object.fragment.render(template.parentNode);
		
		for(i = 0;i < len;i++){				 
			window['link' + i].textContent = self.lists[i].name;			
			window['collapse' + i].querySelector('.list-group-item').textContent = self.lists[i].content;
	  }
	
	}	
	object['looseJsonParse'] = function(obj){
		return Function('"use strict";return (' + obj + ')')();
	}	
	object['template'] = function(obj){
		return Template(obj)
	}	
	// export all methods under 'object' namespace
	if(typeof window !== 'undefined'){
		window.object = object;  
	}
	
})(new Object());

console.log(object.looseJsonParse(
   "{a:(4-1), b:function(){}, c:new Date()}"
));


const ids = [ 'template' ];

const txt = document.createTextNode.bind(document);	
	
var parentNode,  childNode, cloneNode, collapseNode;
	
ids.forEach(function(id) {

	window[id] = document.getElementById(id);
	
});

function Template(lists){
	
	var self = this;
  
	self.lists = lists;
  self.index = 0;
  
	var i, len = self.lists.length;
	
	for(i = 0;i < len;i++){    
		cloneNode = template.content.cloneNode(true);
		parentNode = cloneNode.querySelectorAll('.list');
    childNode = cloneNode.querySelectorAll('.link');
		collapseNode = cloneNode.querySelectorAll('.collapse');    
		parentNode[0].id = 'list' + i;
		childNode[0].id = 'link' + i;	
		childNode[0].setAttribute('data-target', '#collapse' + i);
		childNode[0].setAttribute('aria-controls', 'collapse' + i);
		collapseNode[0].id = 'collapse' + i;
		object['fragment'].append(cloneNode);
		
	}
	
	object.fragment.render(template.parentNode);
	
	for(i = 0;i < len;i++){				 
		window['link' + i].textContent = self.lists[i].name;			
		window['collapse' + i].querySelector('.list-group-item').textContent = self.lists[i].content;
  }

}	

var x = new object.template([
    
	{ 	
		"name" : "Sources", 		
		"content": "" 		
	},
				
	{ 
		"name" : "Network", 
		"content": "Collapse content for Network Panel" 
	},
	
	{ 
		"name" : "Storage",
		"content": "Collapse content for C" 
	},
	
	{ 
		"name" : "Information", 
		"content": "Collapse content for D" 
	},
		
	{ 
		"name" : "Console", 
		"content": "Collapse content for E" 
	},
	
	{ 
		"name" : "Settings", 
		"content": "Collapse content for F" 
	}
	
]);


