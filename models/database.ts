import mysql from 'mysql2/promise';

class Database {

    public connectionDatabase: mysql.Connection | null = null;

    constructor(
        private host: string|undefined,
        private user: string|undefined,
        private password: string|undefined,
        private database:string|undefined    
    ) {
        this.host = host;
        this.user = user;
        this.password = password;
        this.database = database;
    }

    public async connection(){
        this.connectionDatabase = await mysql.createConnection({
            host: this.host,
            user: this.user,
            password: this.password,
            database: this.database,
        })
        if(this.connectionDatabase) { return true; } else { return false; }
    }

    public get connectionDB(): mysql.Connection | null {
        return this.connectionDatabase;
    }

}

export default Database;