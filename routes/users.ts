import { Router } from "express";
import { check } from 'express-validator';
import { deleteUser, getUser, getUsers, newUser, renewToken, updateUser } from "../controllers/usersController";
import validateJsonWebToken from "../middlewares/validateJWT";
import validateRequest from "../middlewares/validateRequest";

const router = Router();

//Get all
router.get("/", getUsers);

//Get user
router.get("/:id", getUser);

//Create
router.post("/", [
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('email', 'El email es obligatorio').notEmpty(),
    check('email', 'El email debe ser valido').isEmail(),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    check('role', 'El rol es obligatorio').notEmpty(),
    validateRequest
], newUser);

//Update
router.put("/:id", [
    check('name', 'El nombre es obligatorio').notEmpty(),
    validateRequest
], updateUser);

//Delete (change user status)
router.delete("/:id", deleteUser);

//Renew
router.post('/renew', validateJsonWebToken ,renewToken)

export default router;
