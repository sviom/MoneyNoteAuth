class CustomError {
    statusCode: number = -1;
    message: string = '';
    error = null;

    constructor(args?: { message?: string; code?: number }) {
        this.statusCode = args?.code || -1;
        this.message = args?.message || '';
    }

    setRawError(error: any) {
        this.error = error;
    }
}

enum errorCode {
    test = -1,
    test2 = -1,
}

export { CustomError, errorCode };
