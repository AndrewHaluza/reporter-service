export const asyncEach = (items, fn) => Promise.all(items.map(item => fn(item)));
