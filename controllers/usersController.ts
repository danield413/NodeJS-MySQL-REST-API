
import { Request, Response } from 'express';
import { database } from '../';
import bcrypt from 'bcryptjs';

export const getUsers = async ( req: Request, res: Response ) : Promise<void> => {

    try {

        const [rows] : any = await database.connectionDB?.execute("SELECT `user_name`, `user_email`, `role_name` FROM `user` INNER JOIN `role` ON user.user_role = role.role_id WHERE `user_status` = 'ACTIVE'");

        res.json({
            ok: true,
            result: rows
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            alert: 'Error del servidor, contacta al administrador del backend'
        });
    }

}

export const getUser = async ( req: Request, res: Response ) : Promise<void> => {

    try {

        const userId: string = req.params.id;

        const [row] : any = await database.connectionDB?.execute("SELECT `user_id`, `user_name`, `user_email`, `role_name` FROM `user` INNER JOIN `role` ON user.user_role = role.role_id WHERE `user_id` = ? AND `user_status` = 'ACTIVE'", [userId]);

        res.json({
            ok: true,
            result: row
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            alert: 'Error del servidor, contacta al administrador del backend'
        });
    }
   

}

export const newUser = async ( req: Request, res: Response ) : Promise<void> => {

    const { name, email, password, role, status } = req.body;
    
    const salt: string = bcrypt.genSaltSync();
    const newPassword: string = bcrypt.hashSync( password, salt );

    try {
        
        const [row] : any = await database.connectionDB?.execute("INSERT INTO `user`(`user_id`, `user_name`, `user_email`, `user_password`, `user_role`, `user_status`) VALUES ( NULL , ? , ? , ? , ? , ? )", [name, email, newPassword, role, status]);

        if(row) {
            res.json({
                ok: true,
                message: 'Usuario creado correctamente.'
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            alert: 'Error del servidor, contacta al administrador del backend'
        });
    }

    
}

export const updateUser = async ( req: Request, res: Response ) : Promise<void> => {

    console.log(req.body);

    

}

export const deleteUser = async ( req: Request, res: Response ) : Promise<void> => {

    console.log(req.body);

    

}