export const emptyFields = (obj) => {
    if (
        [...Object.values(obj)].some((field) => !field || field?.trim() === "")
    ) {
        return true;
    }
    return false;
}