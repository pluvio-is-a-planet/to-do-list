import controller from "../components/controller.js";
import { createCustomElement, createImageElement } from "../logic/helpers.js";
import { format } from "date-fns";

import editIcon from "../assets/icons/edit.svg";
import deleteIcon from "../assets/icons/delete.svg";

import { taskDialog, taskForm } from "./dom-selectors.js";

// --- form open/close ---

function openTaskForm(e) {
    const parentId = e.target.closest(".project-header").dataset.id;
    taskDialog.dataset.mode = "add";
    taskDialog.dataset.parentId = parentId;
    delete taskDialog.dataset.taskId;
    taskForm.reset();
    taskForm.querySelector("[type='submit']").textContent = "Add";
    taskDialog.showModal();
}

function openEditTaskForm(taskId) {
    const task = controller.tasks.find(taskId);

    taskDialog.dataset.mode = "edit";
    taskDialog.dataset.taskId = taskId;
    delete taskDialog.dataset.parentId;

    taskForm.querySelector("#task-title").value = task.title;
    taskForm.querySelector("#task-description").value = task.description;
    taskForm.querySelector("#task-due-date").value = task.dueDate;
    taskForm.querySelector("#task-priority").value = task.priority;
    taskForm.querySelector("[type='submit']").textContent = "Save";

    taskDialog.showModal();
}

function setupTaskForm() {
    taskDialog.querySelector(".cancel-btn").addEventListener("click", () => taskDialog.close());
 
    taskForm.addEventListener("submit", e => {
        e.preventDefault();
 
        const values = {
            title: taskForm.querySelector("#task-title").value,
            description: taskForm.querySelector("#task-description").value,
            dueDate: taskForm.querySelector("#task-due-date").value,
            priority: taskForm.querySelector("#task-priority").value,
        };
 
        if (taskDialog.dataset.mode === "edit") {
            controller.tasks.update(taskDialog.dataset.taskId, values);
        } else {
            controller.tasks.add({
                parentId: taskDialog.dataset.parentId,
                completed: false,
                ...values,
            });
        }
 
        taskForm.reset();
        taskDialog.close();
    });
}

// --- dom element creation ---

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

    const editTaskBtn = createCustomElement("button", "edit-task-btn");
    editTaskBtn.appendChild(createImageElement(editIcon));
    editTaskBtn.title = "Edit Task";
    editTaskBtn.addEventListener("click", () => openEditTaskForm(taskId));
    actions.appendChild(editTaskBtn);

    const deleteTaskBtn = createCustomElement("button", "delete-task-btn");
    deleteTaskBtn.appendChild(createImageElement(deleteIcon));
    deleteTaskBtn.title = "Delete Task";
    deleteTaskBtn.addEventListener("click", () => controller.remove(taskId));
    actions.appendChild(deleteTaskBtn);

    element.appendChild(actions);

    return element;
}

export { openTaskForm, openEditTaskForm, setupTaskForm, createTaskElement };
