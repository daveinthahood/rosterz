// internalMemory.js

export const save = (key, value) => {
    if (!key || typeof key !== "string") {
      throw new Error("Key must be a valid string!");
    }
    if (value === undefined) {
      throw new Error("Value must be specified!");
    }
    localStorage.setItem(key, JSON.stringify(value));
  };

  export const get = (key) => {
    if (!key || typeof key !== "string") {
      throw new Error("Key must be a valid string!");
    }
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  };

  export const remove = (key) => {
    if (!key || typeof key !== "string") {
      throw new Error("Key must be a valid string!");
    }
    localStorage.removeItem(key);
  };
