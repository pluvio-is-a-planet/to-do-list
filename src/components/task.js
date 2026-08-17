import { extractType, resolveId } from "../logic/id.js";

class Task {
    constructor({parentId, id, title, description, dueDate, priority, completed}) {
        this._parentId = parentId;
        this._id = resolveId("task", id);
        this._title = title;
        this._description = description;
        this._dueDate = dueDate;
        this._priority = priority;
        this._completed = completed;
    }

    get parent() { return this._parentId ? { id: this._parentId, type: extractType(this._parentId) } : null }
    get id() { return this._id }
    get title() { return this._title }
    get description() { return this._description }
    get dueDate() { return this._dueDate }
    get priority() { return this._priority }
    get completed() { return this._completed }

    update({title, description, dueDate, priority, completed}) {
        if (title) this._title = title;
        if (description) this._description = description;
        if (dueDate) this._dueDate = dueDate;
        if (priority) this._priority = priority;
        if (completed !== undefined) this._completed = completed;
    }

    toJSON() {
        return {
            parentId: this._parentId,
            id: this._id,
            title: this._title,
            description: this._description,
            dueDate: this._dueDate,
            priority: this._priority,
            completed: this._completed,
        };
    }

    static fromJSON(options) {
        return new this(options);
    }
}

export default Task;