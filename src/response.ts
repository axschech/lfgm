export enum StatusCodes {
    SUCCESS = 200,
    SERVER_ERROR = 500,
    USER_ERROR = 400,
    UNAUTHORIZED = 403,
    NOT_FOUND = 404
}

export interface Res {
    status: (arg0: number) => void;
    json: ({ }) => void;
    locals?: {
        token: string;
    };
}

export class Response {
    constructor(protected res: Res, protected code?: number, protected message?: string, protected extraProps?: { [key: string]: any }) { }

    get() {
        const { message, res, code, extraProps } = this;
        if (res.locals?.token) {
            extraProps.token = res.locals.token;
        }
        res.status(code);
        if (extraProps) {
            return {
                message,
                ...extraProps
            };
        } else {
            return {
                message
            };
        }
    }

    send() {
        return this.res.json(this.get());
    }
}

export class ErrorResponse extends Response {
    readonly defaultErrorMessage = 'Something went wrong';
    readonly defaultErrorCode = StatusCodes.SERVER_ERROR;

    constructor(res: Res, code?: number, message?: string, extraProps?: {}) {
        super(res, code, message, extraProps);
        if (!code) {
            this.code = this.defaultErrorCode;
        }

        if (!message) {
            this.message = this.defaultErrorMessage;
        }

    }
}

