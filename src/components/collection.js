class Collection {
    constructor(itemClass, itemArray, onChange = () => {}) {
        this._itemClass = itemClass;
        this._itemArray = itemArray;
        this._listeners = [onChange];
    }

    get all() {
        return this._itemArray;
    }

    // --- methods for individual items ---

    add(options) {
        const newItem = new this._itemClass(options);
        this._itemArray.push(newItem);
        this._notify();
        return newItem;
    }

    find(id) {
        return this._itemArray.find(entry => entry.id === id);
    }

    remove(id) {
        const index = this._itemArray.findIndex(entry => entry.id === id);
        if (index === -1) return null;
        const removedItem = this._itemArray.splice(index, 1)[0];
        this._notify();
        return removedItem;
    }

    subscribe(listener) {
        this._listeners.push(listener);
    }

    _notify() {
        this._listeners.forEach(func => func());
    }

    toJSON() {
        return this._itemArray.map(entry => entry.toJSON());
    }

    static fromJSON(itemClass, itemArray, onChange) {
        return new this(itemClass, itemArray.map(entry => itemClass.fromJSON(entry)), onChange);
    }
}

export default Collection;