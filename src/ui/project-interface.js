import controller from "../components/controller.js";
import { createCustomElement, createImageElement } from "../logic/helpers.js";

import addTaskIcon from "../assets/icons/create-task.svg";
import addNoteIcon from "../assets/icons/create-note.svg";
import deleteIcon from "../assets/icons/delete.svg";
import editIcon from "../assets/icons/edit.svg";

import { openTaskForm } from "./task-interface.js";
import { openNoteForm } from "./note-interface.js";
import { projectsContainer } from "./dom-selectors.js";

function createProjectHeader(projectId) {
    const project = controller.projects.find(projectId);
 
    const header = createCustomElement("div", "project-header");
    header.dataset.id = projectId;
    const titleContainer = createCustomElement("div", "title-container");
    const headerTitle = createCustomElement("h2", "project-title", project.title);
    titleContainer.appendChild(headerTitle);
    const headerActions = createCustomElement("div", "actions");
 
    const addTaskBtn = createCustomElement("button", "add-task-btn");
    addTaskBtn.appendChild(createImageElement(addTaskIcon));
    addTaskBtn.addEventListener("click", openTaskForm);
    addTaskBtn.title = "Add a Task";
    const addNoteBtn = createCustomElement("button", "add-note-btn");
    addNoteBtn.appendChild(createImageElement(addNoteIcon));
    addNoteBtn.addEventListener("click", openNoteForm);
    addNoteBtn.title = "Add a Note";
 
    headerActions.append(addTaskBtn, addNoteBtn);
 
    if (!projectId.includes("daily") && !projectId.includes("weekly")) {
        const deleteBtn = createCustomElement("button", "delete-project-btn");
        deleteBtn.appendChild(createImageElement(deleteIcon));
        deleteBtn.title = "Delete Project";
        deleteBtn.addEventListener("click", () => controller.remove(projectId));
        headerActions.appendChild(deleteBtn);
 
        const editBtn = createCustomElement("button", "edit-project-btn");
        editBtn.appendChild(createImageElement(editIcon));
        editBtn.title = "Edit Project Name";
        editBtn.addEventListener("click", () => enableProjectTitleEdit(headerTitle, projectId));
        titleContainer.appendChild(editBtn);
    }
 
    header.append(titleContainer, headerActions);
 
    return header;
}
 
// Swaps the project title <h2> for a text input so the user can rename
// the project in place. Commits the change on Enter/blur, discards it
// on Escape.
function enableProjectTitleEdit(titleElement, projectId) {
    const project = controller.projects.find(projectId);
 
    const input = createCustomElement("input", "project-title-input");
    input.type = "text";
    input.value = project.title;
 
    titleElement.replaceWith(input);
    input.focus();
    input.select();
 
    let cancelled = false;
 
    function commit() {
        const newTitle = input.value.trim();
        if (!cancelled && newTitle && newTitle !== project.title) {
            controller.projects.update(projectId, { title: newTitle });
            // A controller update will trigger a re-render of this
            // header with the new title, so there's nothing left to
            // do here.
            return;
        }
        input.replaceWith(titleElement);
    };
 
    input.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            e.preventDefault();
            input.blur();
        } else if (e.key === "Escape") {
            cancelled = true;
            input.blur();
        }
    });
 
    input.addEventListener("blur", commit, { once: true });
}


function renderProjectList() {
    const projectList = projectsContainer.querySelector(".category-list");
    projectList.replaceChildren();
    const projects = controller.projects.all.filter(entry => !["project-daily", "project-weekly"].includes(entry.id));
    projects.forEach(entry => {
        const listItem = createCustomElement("li", "project");
        const title = createCustomElement("div", "project-title", entry.title);
        const deleteBtn = createCustomElement("button", "delete-project-btn", "");
        deleteBtn.title = "Delete Project";
        deleteBtn.appendChild(
            createImageElement(deleteIcon)
        );

        listItem.dataset.id = entry.id;

        listItem.appendChild(title);
        listItem.appendChild(deleteBtn);

        projectList.appendChild(listItem);
    });
}

export { createProjectHeader, renderProjectList };