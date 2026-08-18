const content = document.querySelector(".content");

const projectsContainer = document.querySelector(".categories .projects");
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

export {
    content, projectsContainer, projectFormBtn, projectForm, titleInput, cancelProjectBtn,
    homeBtn, dailyBtn, weeklyBtn, taskDialog, taskForm, noteDialog, noteForm,
};