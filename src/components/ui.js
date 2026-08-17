import controller from "./controller.js";

import { createCustomElement, createImageElement } from "../logic/helpers.js";

import { extractType } from "../logic/id.js";

import addProjectIcon from "../assets/icons/create-project.svg";
import addTaskIcon from "../assets/icons/create-task.svg";
import addNoteIcon from "../assets/icons/create-note.svg";
import deleteIcon from "../assets/icons/delete.svg";

import "../assets/components.css";

const ui = (() => {
    // --- project setup ---

    const sidebarProjects = document.querySelector(".categories .projects");
    const projectList = sidebarProjects.querySelector("ul");
    const projectFormBtn = document.querySelector(".project-form-btn");
    const projectForm = document.querySelector(".actions .project-form");
    const titleInput = projectForm.querySelector("input#project-title");
    const cancelProjectBtn = projectForm.querySelector(".cancel-btn");

    renderProjectList();
    controller.onUpdate(renderProjectList);

    sidebarProjects.addEventListener("click", e => {
        const target = e.target.closest(".category-header");
        if (e.target === target) projectList.classList.toggle("hidden");
    });
    
    projectList.addEventListener("click", e => {
        // do nothing
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
    });

    function renderProjectList() {
        projectList.replaceChildren();
        const projects = controller.projects.all;
        projects.forEach(entry => {
            console.log(entry.title);
            const listItem = createCustomElement("li", "project");
            const title = createCustomElement("div", "project-title", entry.title);
            const deleteBtn = createCustomElement("button", "delete-project-btn", "");
            deleteBtn.appendChild(
                createImageElement(deleteIcon)
            );

            listItem.dataset.id = entry.id;

            deleteBtn.addEventListener("click", e => controller.projects.remove(e.target.closest(".project").dataset.id));

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