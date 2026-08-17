import controller from "./controller.js";

import { createCustomElement, createImageElement } from "../logic/helpers.js";

import { extractType } from "../logic/id.js";

import addProjectIcon from "../assets/icons/create-project.svg";
import addTaskIcon from "../assets/icons/create-task.svg";
import addNoteIcon from "../assets/icons/create-note.svg";
import deleteIcon from "../assets/icons/delete.svg";

import "../assets/components.css";

const ui = (() => {
    let _selectedProjectId;

    const selectedProject = {
        get id() { return _selectedProjectId },
        set id(projectId) {
            _selectedProjectId = projectId;
            if (projectId && controller.projects.find(projectId)) {
                renderProjectContent(projectId);
            } else {
                _selectedProjectId = null;
                renderHome();
            }
        },
    };

    const content = document.querySelector(".content");

    // --- project setup ---

    const sidebarProjects = document.querySelector(".categories .projects");
    const projectList = sidebarProjects.querySelector("ul");
    const projectFormBtn = document.querySelector(".project-form-btn");
    const projectForm = document.querySelector(".actions .project-form");
    const titleInput = projectForm.querySelector("input#project-title");
    const cancelProjectBtn = projectForm.querySelector(".cancel-btn");

    const homeBtn = document.querySelector(".home .category-header");
    const dailyBtn = document.querySelector(".daily .category-header");
    const weeklyBtn = document.querySelector(".weekly .category-header");

    homeBtn.addEventListener("click", renderHome);
    dailyBtn.addEventListener("click", e => renderProjectContent("project-daily"));
    weeklyBtn.addEventListener("click", e => renderProjectContent("project-weekly"));

    renderHome();
    renderProjectList();
    controller.onUpdate(renderProjectList);
    controller.onUpdate(() => {
        selectedProject.id = selectedProject.id;
    });

    sidebarProjects.addEventListener("click", e => {
        const target = e.target.closest(".category-header");
        if (e.target === target) projectList.classList.toggle("hidden");
    });
    
    projectList.addEventListener("click", e => {
        const project = e.target.closest(".project");
        if (!project) return;

        const deleteBtn = e.target.closest(".delete-project-btn");
        if (deleteBtn) {
            controller.remove(project.dataset.id);
            return;
        }

        selectedProject.id = project.dataset.id;
    });

    projectFormBtn.appendChild(
        createImageElement(addProjectIcon)
    );
    projectFormBtn.addEventListener("click", e => {
        toggleProjectForm();
        titleInput.focus();
    });
    cancelProjectBtn.addEventListener("click", toggleProjectForm);

    projectForm.addEventListener("submit", e => {
        e.preventDefault();
        controller.projects.add({title: titleInput.value});
        projectForm.reset();
        titleInput.focus();
        selectedProject.id = controller.projects.all[controller.projects.all.length - 1].id;
    });

    // --- render functions ---

    function renderHome() {
        const uncompletedTasks = controller.tasks.all.filter(task => !task.completed);

        content.replaceChildren();

        const header = createCustomElement("div", "project-header");
        const headerTitle = createCustomElement("h2", "project-title", "Home");
        header.append(headerTitle);
        content.appendChild(header);

        if (uncompletedTasks.length > 0) {
            const container = createCustomElement("div", "tasks");
            uncompletedTasks.forEach(entry => {
                container.appendChild(createTaskElement(entry));
            });
            content.appendChild(container);
        }
    }

    function renderProjectContent(projectId) {
        const project = controller.projects.find(projectId);
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

    function createProjectHeader(projectId) {
        const project = controller.projects.find(projectId);

        const header = createCustomElement("div", "project-header");
        const headerTitle = createCustomElement("h2", "project-title", project.title);
        const headerActions = createCustomElement("div", "actions");

        const addTaskBtn = createCustomElement("button", "add-task-btn");
        addTaskBtn.appendChild(createImageElement(addTaskIcon));
        const addNoteBtn = createCustomElement("button", "add-note-btn");
        addNoteBtn.appendChild(createImageElement(addNoteIcon));

        headerActions.append(addTaskBtn, addNoteBtn);

        if (!projectId.includes("daily") && !projectId.includes("weekly")) {
            const deleteBtn = createCustomElement("button", "delete-project-btn");
            deleteBtn.appendChild(createImageElement(deleteIcon));
            headerActions.appendChild(deleteBtn);
        }

        header.append(headerTitle, headerActions);

        return header;
    }

    function createTaskElement(taskId) {
        const task = controller.tasks.find(taskId);
        const element = createCustomElement("div", "task");

        const checkbox = createCustomElement("input", "task-complete");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", () => {
            controller.tasks.update(task.id, {
                completed: checkbox.checked,
            });
        });

        const title = createCustomElement("span", "task-title", task.title);
        const description = createCustomElement("p", "task-description", task.description);
        const dueDate = createCustomElement("span", "task-due-date", task.dueDate);
        const priority = createCustomElement("span", `task-priority priority-${(task.priority || 1)}`, task.priority);

        element.append(checkbox, title, description, dueDate, priority);
        return element;
    }

    function createNoteElement(noteId) {
        const note = controller.notes.find(noteId);
        const element = createCustomElement("div", "note");

        const title = createCustomElement("span", "note-title", note.title);
        const description = createCustomElement("p", "note-description", note.description);

        element.append(title, description);
        return element;
    }

    function renderProjectList() {
        projectList.replaceChildren();
        const projects = controller.projects.all.filter(entry => !["project-daily", "project-weekly"].includes(entry.id));
        projects.forEach(entry => {
            const listItem = createCustomElement("li", "project");
            const title = createCustomElement("div", "project-title", entry.title);
            const deleteBtn = createCustomElement("button", "delete-project-btn", "");
            deleteBtn.appendChild(
                createImageElement(deleteIcon)
            );

            listItem.dataset.id = entry.id;

            listItem.appendChild(title);
            listItem.appendChild(deleteBtn);

            projectList.appendChild(listItem);
        });
    }

    function toggleProjectForm() {
        projectFormBtn.classList.toggle("hidden");
        projectForm.classList.toggle("hidden");
    }
})();

export default ui;