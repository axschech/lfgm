import { ErrorResponse, Res } from '../response';

const DUPLICATE_ERROR = 1062;

interface HandleError {
    (res: Res, code?: number): void
}

export const handleRegisterError: HandleError = (
    res,
    code
) => {
    switch (code) {
        case DUPLICATE_ERROR:
            new ErrorResponse(res, 400, 'That user already exists').send();
            break;
        default:
            new ErrorResponse(res).send();
            break;
    }
}