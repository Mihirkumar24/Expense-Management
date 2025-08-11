export default function asyncErrorHandler(controller) {
    return function (req, res, next) {
        controller(req, res, next).catch((error) => next(error));
    }
}