(function(){window.dc={};dc.translations={};dc.controllers={};dc.model={};dc.app={};dc.ui={}})();

const templates = {
	header : _.template(),
	article : _.template(),
	footer : _.template()
}

var router = null;




var HeaderView = Backbone.View.extend({
	el: $("#main"),
	template : templates.header,
    initialize : function() {  this.render(); },
    render: function() { this.$el.append(this.template()); return this; }
});

var ArticleView = Backbone.View.extend({
	el: $("#main"),
	template : templates.article,
    initialize : function() {  this.render();  },
    render: function() {  this.$el.append(this.template());return this; }
});

var FooterView = Backbone.View.extend({
	el: $("#main"),
	template : templates.footer,
    initialize : function() {  this.render(); },
    render: function() {  this.$el.append(this.template()); return this;  }
});


function LoadAjaxContent(target, url) {
	$.ajax({ 
		mimeType: "text/html; charset=utf-8",
		url: url, 
		type: "GET",
		success: function(data) { 
			$(target).append(data); 
		},
		error: function(jqXHR, textStatus, errorThrown) { 
			$(target).html("<p>Error Loading Data</p>") 
		}, 
		dataType: "html", 
		async: true 
	});
  }
  
function InitModals(){
	LoadAjaxContent($('body'), '');
	LoadAjaxContent($('body'), '');
	LoadAjaxContent($('body'), '');
}

function InitView(){
	this.header = new HeaderView();
	this.article = new ArticleView();
	this.footer = new FooterView();

}


$(document).ready(function(){

	var view = new InitView();

});