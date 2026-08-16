import Collection from "./collection.js";

import Project from "./project.js";
import Task from "./task.js";
import Note from "./note.js";

import { save, load } from "../logic/local-storage.js";

const controller = (() => {
    // I plan to initialize these collections from localStorage using a separate save/load module
    const _projects = Collection.fromJSON(Project, load("projects"));
    const _tasks = Collection.fromJSON(Task, load("tasks"));
    const _notes = Collection.fromJSON(Note, load("notes"));

    return {
        // necessary methods
    }
})();

export default controller;