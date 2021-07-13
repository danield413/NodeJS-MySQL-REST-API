import jwt from 'jsonwebtoken';

type Payload = {
    id: string,
    email: string
}

export const generateJsonWebToken = (id: string, email: string) => {

    return new Promise( (resolve, reject) => {

        const payload: Payload = { id, email };
        const secretKey: string|undefined|any = process.env.JWT_SECRET_KEY;

        jwt.sign( payload, secretKey, {
            expiresIn: '12h'
        }, (error, token) => {
            
            if(error) {
                console.log(error);
                reject('No se pudo generar el token.');
            } else {
                resolve( token );
            }

        })

    })

}