import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

const validateRequest = ( req: Request, res: Response, next: NextFunction ) => {
    console.log('asd')
    const errors = validationResult(req);
    if( !errors.isEmpty() ) {
        return res.status(400).json(errors);
    }

    next();
}

export default validateRequest;