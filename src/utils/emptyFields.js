export const emptyFields = (obj) => {
    // returns true if any field is empty or contains only white spaces
    return [...Object.values(obj)].some((field) => !field || field?.trim() === "");
}