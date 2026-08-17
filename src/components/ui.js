import controller from "./controller.js";

import { createCustomElement } from "../logic/helpers.js";

const ui = (() => {
    // --- project setup ---

    const sidebarProjects = document.querySelector(".categories .projects");
    const projectList = sidebarProjects.querySelector("ul");
    const projectForm = document.querySelector(".actions .project-form");
    const cancelProjectBtn = projectForm.querySelector(".cancel-btn");

    renderProjectList();
    controller.onUpdate(renderProjectList);

    sidebarProjects.addEventListener("click", e => projectList.classList.toggle("hidden"));
    projectList.addEventListener("click", e => {
        const target = e.target.closest("h3");
        renderProjectContent(controller.projects.find(target.dataset.id));

    });

    const projectFormBtn = document.querySelector(".project-form-btn");
    projectFormBtn.addEventListener("click", toggleProjectForm);
    cancelProjectBtn.addEventListener("click", toggleProjectForm);

    projectForm.addEventListener("submit", e => {
        e.preventDefault();
        const titleInput = projectForm.querySelector("input#project-title");
        controller.projects.add({title: titleInput.value});
    });

    function renderProjectList() {
        const projects = controller.projects.all;
        projects.forEach(entry => {
            console.log(entry.title);
            const listItem = createCustomElement("li", "project");
            const title = createCustomElement("h3", "project-title", entry.title);
            title.dataset.id = entry.id;
            listItem.appendChild(title);

            projectList.appendChild(listItem);
        });
    }

    function toggleProjectForm() {
        projectFormBtn.classList.toggle("hidden");
        projectForm.classList.toggle("hidden");
    }
})();

export default ui;