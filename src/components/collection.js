class Collection {
    constructor(itemClass, itemArray) {
        this._itemClass = itemClass;
        this._itemArray = itemArray;
    }

    get all() {
        return this._itemArray;
    }

    add(options) {
        const newItem = new this._itemClass(options);
        _itemArray.push(newItem);
        return newItem;
    }

    remove(id) {
        const index = this._itemArray.findIndex(entry => entry.id === id);
        if (index === -1) return null;
        const removedItem = this._itemArray.splice(index, 1)[0];
        return removedItem;
    }
}

export default Collection;