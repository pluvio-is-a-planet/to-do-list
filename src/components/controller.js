import Collection from "./collection.js";

import Project from "./project.js";
import Task from "./task.js";
import Note from "./note.js";

import { save, load } from "../logic/local-storage.js";

import { extractType } from "../logic/id.js";

const controller = (() => {
    // I plan to initialize these collections from localStorage using a separate save/load module
    const _projects = Collection.fromJSON(Project, load("projects"), () => save("projects", _projects));
    const _tasks = Collection.fromJSON(Task, load("tasks"), () => save("tasks", _tasks));
    const _notes = Collection.fromJSON(Note, load("notes"), () => save("notes", _notes));

    if (!_projects.find("project-daily")) {
        _projects.add({title: "Daily", id: "project-daily"});
    }

    if (!_projects.find("project-weekly")) {
        _projects.add({title: "Weekly", id: "project-weekly"});
    }

    const _collections = { project: _projects, task: _tasks, note: _notes };

    function onUpdate(callback) {
        Object.values(_collections).forEach(collection => collection.subscribe(callback));
    }

    function _removeCascade(id) {
        getChildren(id).forEach(child => _removeCascade(child.id));
        return _resolveCollection(id).remove(id);
    }

    function _resolveCollection(id) {
        if (!id) return null;
        const type = extractType(id);
        if (!_collections[type]) throw new Error(`Unknown item type for id "${id}"`);
        return _collections[type]
    }

    function getChildren(id) {
        return Object.values(_collections)
            .flatMap(collection => collection.all)
            .filter(entry => entry.parent?.id === id);
    }

    return {
        projects: _projects,
        tasks: _tasks,
        notes: _notes,
        remove: _removeCascade,
        getChildren,
        onUpdate,
    };
})();

export default controller;