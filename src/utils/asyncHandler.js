// Promisify request handlers for easier troubleshooting
export const asyncHandler = (reqHandler) => {
    return (req, res, next) => {
        Promise.resolve(reqHandler(req, res, next))
            .catch((err) => next(err));
    }
}