import { ErrorResponse } from "./response";


export const userGate = (req, res): boolean => {
    const id = res.locals?.id;
    if (!id) {
        new ErrorResponse(res, 400).send();
        return false;
    }

    if (req.query.id.toString() === id.toString() || req.body.id.toString() === id.toString()) {
        return true;
    }
    new ErrorResponse(res, 400).send()
    return false;
}