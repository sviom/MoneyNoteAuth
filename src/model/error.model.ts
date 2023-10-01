class CustomError {
    statusCode: number = -1;
    message: string = 'S';
    error = null;

    constructor(message: string, code: number) {
        this.statusCode = code;
        this.message = message;
    }

    setRawError(error: any) {
        this.error = error;
    }
}

export { CustomError };
