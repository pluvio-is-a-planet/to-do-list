class Note {
    constructor({id, title, description}) {
        this._id = id ?? crypto.randomUUID();
        this._title = title;
        this._description = description;
    }

    get id() { return this._id }
    get title() { return this._title }
    get description() { return this._description }

    update({title, description}) {
        this._title = title;
        this._description = description;
    }

    toJSON() {
        return {
            title: this._title,
            description: this._description,
        };
    }
}

export default Note;