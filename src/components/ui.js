import controller from "./controller.js";

import { createCustomElement, createImageElement } from "../logic/helpers.js";

import { extractType } from "../logic/id.js";

import addProjectIcon from "../assets/icons/create-project.svg";
import addTaskIcon from "../assets/icons/create-task.svg";
import addNoteIcon from "../assets/icons/create-note.svg";
import deleteIcon from "../assets/icons/delete.svg";

import { format, formatDate } from "date-fns";

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

    const taskDialog = document.querySelector(".task-form-dialog");
    const taskForm = taskDialog.querySelector(".task-form");
    const noteDialog = document.querySelector(".note-form-dialog");
    const noteForm = noteDialog.querySelector(".note-form");

    taskDialog.querySelector(".cancel-btn").addEventListener("click", () => taskDialog.close());
    noteDialog.querySelector(".cancel-btn").addEventListener("click", () => noteDialog.close());

    homeBtn.addEventListener("click", renderHome);
    dailyBtn.addEventListener("click", e => selectedProject.id = "project-daily");
    weeklyBtn.addEventListener("click", e => selectedProject.id = "project-weekly");

    renderHome();
    renderProjectList();
    controller.onUpdate(renderProjectList);
    controller.onUpdate(() => {
        selectedProject.id = selectedProject.id;
    });

    taskForm.addEventListener("submit", e => {
        e.preventDefault();
        controller.tasks.add({
            parentId: taskDialog.dataset.parentId,
            title: taskForm.querySelector("#task-title").value,
            description: taskForm.querySelector("#task-description").value,
            dueDate: taskForm.querySelector("#task-due-date").value,
            priority: taskForm.querySelector("#task-priority").value,
            completed: false,
        });
        taskForm.reset();
        taskDialog.close();
    });

    noteForm.addEventListener("submit", e => {
        e.preventDefault();
        controller.notes.add({
            parentId: noteDialog.dataset.parentId,
            title: noteForm.querySelector("#note-title").value,
            description: noteForm.querySelector("#note-description").value,
        });
        noteForm.reset();
        noteDialog.close();
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
                container.appendChild(createTaskElement(entry.id));
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
        header.dataset.id = projectId;
        const headerTitle = createCustomElement("h2", "project-title", project.title);
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
            headerActions.appendChild(deleteBtn);
        }

        header.append(headerTitle, headerActions);

        return header;
    }

    function openTaskForm(e) {
        const parentId = e.target.closest(".project-header").dataset.id;
        taskDialog.dataset.parentId = parentId;
        taskDialog.showModal();
    }

    function openNoteForm(e) {
        const parentId = e.target.closest(".project-header").dataset.id;
        noteDialog.dataset.parentId = parentId;
        noteDialog.showModal();
    }

    function createTaskElement(taskId) {
        const task = controller.tasks.find(taskId);
        const element = createCustomElement("div", "task");

        const header = createTaskHeader(taskId);
        const description = createCustomElement("div", "task-description");
        const paragraphs = task.description.split("\n");
        paragraphs.forEach(paragraph => {
            description.appendChild(createCustomElement("p", "", paragraph));
        });

        const dueDate = createCustomElement("span", "task-due-date", `Due: ${format(task.dueDate, "dd/MM")}`);
        const priority = createCustomElement("span", `task-priority priority-${(task.priority || 1)}`, task.priority);

        element.append(header, description, dueDate, priority);
        return element;
    }

    function createTaskHeader(taskId) {
        const element = createCustomElement("div", "task-header");
        const task = controller.tasks.find(taskId);

        const checkbox = createCustomElement("input", "task-complete");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", () => {
            controller.tasks.update(task.id, {
                completed: checkbox.checked,
            });
        });

        const title = createCustomElement("span", "task-title", task.title);

        element.append(title, checkbox);

        const actions = createCustomElement("div", "actions");
        const deleteTaskBtn = createCustomElement("button", "delete-task-btn");
        deleteTaskBtn.appendChild(createImageElement(deleteIcon));
        deleteTaskBtn.title = "Delete Task";
        deleteTaskBtn.addEventListener("click", () => controller.remove(taskId));
        actions.appendChild(deleteTaskBtn);
        element.appendChild(actions);

        return element;
    }

    function createNoteElement(noteId) {
        const note = controller.notes.find(noteId);
        const element = createCustomElement("div", "note");

        const header = createCustomElement("div", "note-header");
        const title = createCustomElement("span", "note-title", note.title);

        const deleteNoteBtn = createCustomElement("button", "delete-note-btn");
        deleteNoteBtn.appendChild(createImageElement(deleteIcon));
        deleteNoteBtn.title = "Delete Note";
        deleteNoteBtn.addEventListener("click", () => controller.remove(noteId));

        header.append(title, deleteNoteBtn);

        const description = createCustomElement("div", "note-description");
        const paragraphs = note.description.split("\n");
        paragraphs.forEach(paragraph => {
            description.appendChild(createCustomElement("p", "", paragraph));
        });

        element.append(header, description);
        return element;
    }

    function renderProjectList() {
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

    function toggleProjectForm() {
        projectFormBtn.classList.toggle("hidden");
        projectForm.classList.toggle("hidden");
    }
})();

export default ui;
