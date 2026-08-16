class Task {
    constructor({id, title, description, dueDate, priority}) {
        this._id = id ?? crypto.randomUUID();
        this._title = title;
        this._description = description;
        this._dueDate = dueDate;
        this._priority = priority;
    }

    get title() { return this._title }
    get description() { return this._description }
    get dueDate() { return this._dueDate }
    get priority() { return this._priority }

    update({title, description, dueDate, priority}) {
        this._title = title;
        this._description = description;
        this._dueDate = dueDate;
        this._priority = priority;
    }

    toJSON() {
        return {
            title: this._title,
            description: this._description,
            dueDate: this._dueDate,
            priority: this._priority,
        };
    }

    static fromJSON(options) {
        return new this(options);
    }
}

export default Task;