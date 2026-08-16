const SEPARATOR = "-";

function extractType(id) {
    return id.split(SEPARATOR)[0]
}

function resolveId(prefix, id) {
    if (!id) return generateId(prefix);
    if (extractType(id) !== prefix) {
        throw new Error(`Invalid id "${id}": expected type "${prefix}"`);
    }

    return id;
}

function generateId(prefix) {
    return `${prefix}${SEPARATOR}${crypto.randomUUID()}`;
}

export { extractType, resolveId };