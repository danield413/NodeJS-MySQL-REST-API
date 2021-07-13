import { Router } from 'express';
import { 
    deleteUser,
    getUser,
    getUsers,
    newUser,
    updateUser 
} from '../controllers/usersController';

const router = Router();

//Get all
router.get('/', getUsers);

//Get user
router.get('/:id', getUser)

//Create
router.post('/', newUser);

//Update
router.put('/:id', updateUser);

//Delete (change user status)
router.delete('/:id', deleteUser);


export default router;