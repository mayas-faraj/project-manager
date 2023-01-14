import { Router, Request, Response } from 'express'
import { sign } from 'jsonwebtoken'
import { validatePassword } from '../password-hash'
import UserController from '../controller/userController'
import { User } from '@prisma/client'
import dotenv from 'dotenv'

const router = Router()
router.post('/login', async (req: Request, res: Response) => {
    const result = { message: '', token: '', status: false }
    const user: string = req.body.user;
    const password: string = req.body.password

    if( !user ) result.message = 'user is empty'
    else if (!password) result.message = 'password is empty'
    else {
        const userResult = await new UserController().findByName( user )
        if (!userResult) {
            result.message = 'user not exists'
        }
        else {
            const userDb = userResult as User;
            if(validatePassword(password,  userDb.password)) {
                dotenv.config()
                const secret: string = process.env.SECRET ?? ''
                result.message = 'login success'
                result.status = true
                result.token = sign({ 
                    id: userDb.id,
                    nam: userDb.name,
                    rol: userDb.role,
                    exp: (new Date().getTime() / 1000) + (60 * 60)
                }, secret)
            }
            else
                result.message = 'password is not valid'
        }
    }

    res.json(result)
})

export default router