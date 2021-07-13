import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { database } from '../';
import { generateJsonWebToken } from '../helpers/generateJWT';

//Read
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
            alert: 'Error del servidor, contacta al administrador del backend.'
        });
    }

}

//Read
export const getUser = async ( req: Request, res: Response ) : Promise<void> => {

    const userId: string = req.params.id;
    
    try {

        const [row] : any = await database.connectionDB?.execute("SELECT `user_id`, `user_name`, `user_email`, `role_name` FROM `user` INNER JOIN `role` ON user.user_role = role.role_id WHERE `user_id` = ? AND `user_status` = 'ACTIVE'", [userId]);

        res.json({
            ok: true,
            result: row
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            alert: 'Error del servidor, contacta al administrador del backend.'
        });
    }
   
}

//Create
export const newUser = async ( req: Request, res: Response ) : Promise<void> => {

    const { name, email, password, role } = req.body;
    
    const salt: string = bcrypt.genSaltSync();
    const newPassword: string = bcrypt.hashSync( password, salt );

    try {
        
        const [row] : any = await database.connectionDB?.execute("INSERT INTO `user`(`user_id`, `user_name`, `user_email`, `user_password`, `user_role`, `user_status`) VALUES ( NULL , ? , ? , ? , ? , 'ACTIVE' )", [name, email, newPassword, role]);

        if(row) {

            const [row] : any = await database.connectionDB?.execute("SELECT `user_id`, `user_name`, `user_email`, `role_name` FROM `user` INNER JOIN `role` ON user.user_role = role.role_id WHERE `user_email` = ? AND `user_status` = 'ACTIVE'", [email]);

            const userId: string = row[0].user_id;
            const userEmail: string = row[0].user_email;

            const token = await generateJsonWebToken(userId, userEmail);

            if( token ){
                res.json({
                    ok: true,
                    message: 'Usuario creado correctamente.',
                    token,
                    user: row[0]
                })
            } else {
                res.status(400).json({
                    alert: 'No se pudo general el token, revisa la petición.'
                })
            }

        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            alert: 'Error del servidor, contacta al administrador del backend.'
        });
    }

    
}

//Update
export const updateUser = async ( req: Request, res: Response ) : Promise<void> => {

    const { id: userId } = req.params;
    const { name } = req.body;

    try {
        
        const [row] : any = await database.connectionDB?.execute("UPDATE `user` SET `user_name` = ? WHERE `user_id` = ?", [name, userId]);

        if(row) {
            res.json({
                ok: true,
                message: "Usuario actualizado correctamente.",
                newName: name
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            alert: 'Error del servidor, contacta al administrador del backend.'
        });
    }
    

}

//Delete
export const deleteUser = async ( req: Request, res: Response ) : Promise<void> => {

    const { id: userId } = req.params;

    try {
        
        //No se elimina, se mantienen las referencias pero se cambia el `status`
        const [row] : any = await database.connectionDB?.execute("UPDATE `user` SET `user_status` = 'INACTIVE' WHERE `user_id` = ?", [userId]);

        if(row) {
            res.json({
                ok: true,
                message: "Usuario eliminado correctamente."
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            alert: 'Error del servidor, contacta al administrador del backend.'
        });
    }

}

//Renew Token
export const renewToken = async ( req: Request | any, res: Response ) : Promise<void> => {

    const {tokenUserId, tokenUserEmail, user} = req;

    const token = await generateJsonWebToken(tokenUserId, tokenUserEmail);

    res.json({
        message: 'Token refrescado correctamente.',
        user,
        token
    })

}
