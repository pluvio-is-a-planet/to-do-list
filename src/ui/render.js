import controller from "../components/controller.js";
import { createCustomElement } from "../logic/helpers.js";
import { extractType } from "../logic/id.js";

import { content } from "./dom-selectors.js";
import { createTaskElement } from "./task-interface.js";
import { createNoteElement } from "./note-interface.js";
import { createProjectHeader } from "./project-interface.js";

export function renderHome() {
    const uncompletedTasks = controller.tasks.all.filter(task => !task.completed);

    content.replaceChildren();

    const header = createCustomElement("div", "project-header");
    const headerTitle = createCustomElement("h2", "project-title", "Home");
    header.append(headerTitle);
    content.appendChild(header);

    if (uncompletedTasks.length > 0) {
        const container = createCustomElement("div", "tasks");
        uncompletedTasks.forEach(entry => {
            container.appendChild(createTaskElement(entry.id));
        });
        content.appendChild(container);
    }
}

export function renderProjectContent(projectId) {
    const children = controller.getChildren(projectId);

    const taskPrefix = "task";
    const notePrefix = "note";

    const tasks = children.filter(entry => extractType(entry.id) === taskPrefix);
    const notes = children.filter(entry => extractType(entry.id) === notePrefix);

    content.replaceChildren();

    const header = createProjectHeader(projectId);
    content.appendChild(header);

    if (tasks && tasks.length > 0) {
        const container = createCustomElement("div", "tasks");
        tasks.forEach(entry => {
            const taskElement = createTaskElement(entry.id);
            container.appendChild(taskElement);
        });

        content.appendChild(container);
    }

    if (notes && notes.length > 0) {
        const container = createCustomElement("div", "notes");
        notes.forEach(entry => {
            const noteElement = createNoteElement(entry.id);
            container.appendChild(noteElement);
        })

        content.appendChild(container);
    }
}