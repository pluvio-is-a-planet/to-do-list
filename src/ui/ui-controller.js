import controller from "../components/controller.js";
import { createImageElement } from "../logic/helpers.js";

import addProjectIcon from "../assets/icons/create-project.svg";

import "../assets/stylesheets/index.css";

import {
    sidebarProjects,
    projectsContainer,
    projectFormBtn,
    projectForm,
    titleInput,
    cancelProjectBtn,
    homeBtn,
    dailyBtn,
    weeklyBtn,
} from "./dom-selectors.js";

import { renderHome, renderProjectContent } from "./render.js";
import { renderProjectList } from "./project-interface.js";
import { setupTaskForm } from "./task-interface.js";
import { setupNoteForm } from "./note-interface.js";

function toggleProjectForm() {
    projectFormBtn.classList.toggle("hidden");
    projectForm.classList.toggle("hidden");
}

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

    // --- top-level navigation ---
    homeBtn.addEventListener("click", renderHome);
    dailyBtn.addEventListener("click", () => selectedProject.id = "project-daily");
    weeklyBtn.addEventListener("click", () => selectedProject.id = "project-weekly");

    // --- dialogs (task / note add & edit) ---
    setupTaskForm();
    setupNoteForm();

    // --- sidebar project list ---

    projectsContainer.addEventListener("click", e => {
        const header = e.target.closest(".category-header");
        if (e.target === header) projectsContainer.querySelector(".category-list").classList.toggle("hidden");

        const project = e.target.closest(".project");
        if (!project) return;

        const deleteBtn = e.target.closest(".delete-project-btn");
        if (deleteBtn) {
            controller.remove(project.dataset.id);
            return;
        }

        selectedProject.id = project.dataset.id;
    });

    // --- add-project form ---
    projectFormBtn.appendChild(
        createImageElement(addProjectIcon)
    );
    projectFormBtn.addEventListener("click", () => {
        toggleProjectForm();
        titleInput.focus();
    });
    cancelProjectBtn.addEventListener("click", toggleProjectForm);

    projectForm.addEventListener("submit", e => {
        e.preventDefault();
        controller.projects.add({ title: titleInput.value });
        projectForm.reset();
        titleInput.focus();
        selectedProject.id = controller.projects.all[controller.projects.all.length - 1].id;
        // set the selectedProject to the last created project
    });

    // --- initial render + live updates ---
    renderHome();
    renderProjectList();
    controller.onUpdate(renderProjectList);
    controller.onUpdate(() => {
        selectedProject.id = selectedProject.id;
    });
})();

export default ui;