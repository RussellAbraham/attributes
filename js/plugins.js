
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

function InitView(){
	this.header = new HeaderView();
	this.article = new ArticleView();
	this.footer = new FooterView();
}

$(document).ready(function(){	
	var view = new InitView();	
});
