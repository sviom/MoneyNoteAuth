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
    unexpected = '예상치 못한 오류가 발생했습니다.',
    wrongAccess = '잘못된 접근입니다.',
    notVerified = '인증되지 않은 코드입니다.',
}

export { CustomError, errorCode };
