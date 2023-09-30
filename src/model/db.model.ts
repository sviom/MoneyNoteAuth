class DBConfig {
    public port: number;

    constructor() {
        this.port = -1;
    }
}

class DBResult<T> {
    public data: T[] = [];
    public rowCount: number;

    constructor() {
        this.rowCount = -1;
    }
}

export { DBConfig, DBResult };
