import { NextFunction, Request, Response } from "express";
import jwt, { GetPublicKeyOrSecret, JwtPayload, Secret } from "jsonwebtoken";
import { database } from '../';

const validateJsonWebToken = async (req: Request | any, res: Response, next: NextFunction) => {

    const token: string|undefined = req.header('Authorization');

    if( !token ) {
        return res.status(401).json({
            message: 'Token no definido, debes mandar uno.'
        })
    }

    try {

        const privateKey: string|undefined|any = process.env.JWT_SECRET_KEY;
        const payload : string|JwtPayload = jwt.verify( token, privateKey );
        const {id: userId, email: userEmail}: any = payload;

        const [row] : any = await database.connectionDB?.execute("SELECT `user_id`, `user_name`, `user_email`, `role_name` FROM `user` INNER JOIN `role` ON user.user_role = role.role_id WHERE `user_id` = ? AND `user_status` = 'ACTIVE'", [userId]);

        if( !row ){
            return res.status(401).json({
                message: 'El token no es válido.'
            })
        }

        // Todo correcto
        req.tokenUserId = userId;
        req.tokenUserEmail = userEmail;
        req.user = row[0];

    } catch (error) {
        // console.log(error);
        res.status(401).json({
            msg: 'El token ingresado ya expiró o no es válido.'
        });
    }

    next();
}

export default validateJsonWebToken;