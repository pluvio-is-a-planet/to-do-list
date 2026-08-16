const STORAGE_PREFIX = "app:";

function save(key, collection) {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(collection)); // will call custom toJSON method in Collection
}

function load(key) {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : [];
}

export { save, load };