function createCustomElement(tag, className, textContent) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = textContent;
    return element;
}

function createImageElement(src, alt) {
    const element = document.createElement("img");
    element.src = src;
    element.alt = alt;
    return element;
}

export { createCustomElement, createImageElement };