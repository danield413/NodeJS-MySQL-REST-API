import dotenv from 'dotenv';
dotenv.config();

import Server from './models/server';
import Database from './models/database';

//Database
export const database: Database = new Database(
    process.env.HOST,
    process.env.USER,
    process.env.PASSWORD,
    process.env.DATABASE
);

const main = async () => {

    const connection = await database.connection();
    if (connection && database.connectionDB) console.log('-- Base de datos conectada satisfactoriamente --');
        
    //Server
    const server = new Server();
    server.listen();
}
main();