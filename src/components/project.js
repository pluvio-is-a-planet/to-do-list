class Project {
    constructor({id, title}) {
        this._id = id ?? crypto.randomUUID();
        this._title = title;
    }

    get id() { return this._id }
    get title() { return this._title }

    update({title}) {
        this._title = title;
    }

    toJSON() {
        return {
            id: this._id,
            title: this._title,
        };
    }

    static fromJSON(options) {
        return new this(options);
    }
}

export default Project;