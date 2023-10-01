class CustomError {
    statusCode: number = -1;
    message: string = '';
    error = null;

    constructor(message: string = '', code: number = -1) {
        this.statusCode = code;
        this.message = message;
    }

    setRawError(error: any) {
        this.error = error;
    }
}

export { CustomError };
