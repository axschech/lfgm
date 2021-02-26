import { ErrorResponse, Res } from '../response';

const DUPLICATE_ERROR = 1062;

interface HandleError {
    (res: Res, code?: number): ErrorResponse
}

export const handleRegisterError: HandleError = (
    res,
    code
) => {
    switch (code) {
        case DUPLICATE_ERROR:
            return new ErrorResponse(res, 400, 'That user already exists');
        default:
            return new ErrorResponse(res);
    }
}