import { resolveId } from "../logic/id.js";

class Project {
    constructor({id, title}) {
        this._id = resolveId("project", id);
        this._title = title;
    }

    get id() { return this._id }
    get title() { return this._title }

    update({title}) {
        if (title) this._title = title;
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