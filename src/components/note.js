import { extractType, resolveId } from "../logic/id.js";

class Note {
    constructor({parentId, id, title, description}) {
        this._parentId = parentId;
        this._id = resolveId("note", id);
        this._title = title;
        this._description = description;
    }

    get parent() { return this._parentId ? { id: this._parentId, type: extractType(this._parentId) } : null }
    get id() { return this._id }
    get title() { return this._title }
    get description() { return this._description }

    update({title, description}) {
        if (title) this._title = title;
        if (description) this._description = description;
    }

    toJSON() {
        return {
            parentId: this._parentId,
            id: this._id,
            title: this._title,
            description: this._description,
        };
    }

    static fromJSON(options) {
        return new this(options);
    }
}

export default Note;