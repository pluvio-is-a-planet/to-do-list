import controller from "../components/controller.js";
import { createCustomElement, createImageElement } from "../logic/helpers.js";

import editIcon from "../assets/icons/edit.svg";
import deleteIcon from "../assets/icons/delete.svg";

import { noteDialog, noteForm } from "./dom-selectors.js";

// --- form open/close ---

function openNoteForm(e) {
    const parentId = e.target.closest(".project-header").dataset.id;
    noteDialog.dataset.mode = "add";
    noteDialog.dataset.parentId = parentId;
    delete noteDialog.dataset.noteId;
    noteForm.reset();
    noteForm.querySelector("[type='submit']").textContent = "Add";
    noteDialog.showModal();
}

function openEditNoteForm(noteId) {
    const note = controller.notes.find(noteId);

    noteDialog.dataset.mode = "edit";
    noteDialog.dataset.noteId = noteId;
    delete noteDialog.dataset.parentId;

    noteForm.querySelector("#note-title").value = note.title;
    noteForm.querySelector("#note-description").value = note.description;
    noteForm.querySelector("[type='submit']").textContent = "Save";

    noteDialog.showModal();
}

function setupNoteForm() {
    noteDialog.querySelector(".cancel-btn").addEventListener("click", () => noteDialog.close());

    noteForm.addEventListener("submit", e => {
        e.preventDefault();

        const values = {
            title: noteForm.querySelector("#note-title").value,
            description: noteForm.querySelector("#note-description").value,
        };

        if (noteDialog.dataset.mode === "edit") {
            controller.notes.update(noteDialog.dataset.noteId, values);
        } else {
            controller.notes.add({
                parentId: noteDialog.dataset.parentId,
                ...values,
            });
        }

        noteForm.reset();
        noteDialog.close();
    });
}

// --- dom element creation ---

function createNoteElement(noteId) {
    const note = controller.notes.find(noteId);
    const element = createCustomElement("div", "note");

    const header = createCustomElement("div", "note-header");
    const title = createCustomElement("span", "note-title", note.title);

    const editNoteBtn = createCustomElement("button", "edit-note-btn");
    editNoteBtn.appendChild(createImageElement(editIcon));
    editNoteBtn.title = "Edit Note";
    editNoteBtn.addEventListener("click", () => openEditNoteForm(noteId));

    const deleteNoteBtn = createCustomElement("button", "delete-note-btn");
    deleteNoteBtn.appendChild(createImageElement(deleteIcon));
    deleteNoteBtn.title = "Delete Note";
    deleteNoteBtn.addEventListener("click", () => controller.remove(noteId));

    header.append(title, editNoteBtn, deleteNoteBtn);

    const description = createCustomElement("div", "note-description");
    const paragraphs = note.description.split("\n");
    paragraphs.forEach(paragraph => {
        description.appendChild(createCustomElement("p", "", paragraph));
    });

    element.append(header, description);
    return element;
}

export { openNoteForm, openEditNoteForm, setupNoteForm, createNoteElement };