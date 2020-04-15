function Component(options) {
    options = options || {};
    this._opened = false;
}

Component.prototype = {

    open : function(){
        var self = this;
        this._opened = true;
    },

    close : function(){
        var self = this;
        this._opened = false;
    },

    toggle : function(){
        return this.isOpen() ? this.close() : this.open();
    },

    isOpen : function(){
        return this._opened;
    }

}


/*

var x = new Component();

x._opened; // false;

x.toggle();

x._opened; // true;

*/

