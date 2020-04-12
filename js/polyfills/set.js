var createObjectIdentifier = function()
{
    // It has to be string for better performance.
    return '_' + ++createObjectIdentifier._last;
}

createObjectIdentifier._last = 0;

/**
 * @constructor
 */
var Set = function()
{
    /** @type !Object.<string, Object> */
    this._set = {};
    this._size = 0;
}

Set.prototype = {
    /**
     * @param {!Object} item
     */
    add: function(item)
    {
        var objectIdentifier = item.__identifier;
        if (!objectIdentifier) {
            objectIdentifier = createObjectIdentifier();
            item.__identifier = objectIdentifier;
        }
        if (!this._set[objectIdentifier])
            ++this._size;
        this._set[objectIdentifier] = item;
    },
    
    /**
     * @param {!Object} item
     */
    remove: function(item)
    {
        if (this._set[item.__identifier]) {
            --this._size;
            delete this._set[item.__identifier];
        }
    },

    /**
     * @return {!Array.<Object>}
     */
    items: function()
    {
        var result = new Array(this._size);
        var i = 0;
        for (var objectIdentifier in this._set)
            result[i++] = this._set[objectIdentifier];
        return result;
    },

    /**
     * @param {!Object} item
     * @return {?Object}
     */
    hasItem: function(item)
    {
        return this._set[item.__identifier];
    },

    /**
     * @return {number}
     */
    size: function()
    {
        return this._size;
    },

    clear: function()
    {
        this._set = {};
        this._size = 0;
    }
}