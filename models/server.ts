import express, { Application } from 'express';
import userRoutes from '../routes/users';
import cors from 'cors';

class Server {

    private app: Application;
    private port: string | undefined;
    private apiPaths = {
        users: '/api/users',
    }

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '8080';
        
        this.middlewares();
        this.routes();
    }

    public listen(): void {
        this.app.listen( this.port, () => {
            console.log("-- Servidor corriendo en puerto " + this.port + " --" );
        })
    }

    private middlewares(): void {
        this.app.use( cors() );
        this.app.use( express.json() );
    }

    private routes(): void {
        this.app.use( this.apiPaths.users, userRoutes );
    }

}

export default Server;