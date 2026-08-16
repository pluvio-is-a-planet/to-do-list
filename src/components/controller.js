import Collection from "./collection.js";

import Project from "./project.js";
import Task from "./task.js";
import Note from "./note.js";

const controller = (() => {
    // I plan to initialize these collections from localStorage using a separate save/load module
    const _projects = Collection.fromJSON(Project, []);
    const _tasks = Collection.fromJSON(Task, []);
    const _notes = Collection.fromJSON(Note, []);
})();

export default controller;