import { Router, Request, Response } from 'express'
import { sign } from 'jsonwebtoken'
import { validatePassword } from '../password-hash'
import UserController from '../controller/userController'
import dotenv from 'dotenv'
import { Prisma } from '../prismaClient'

const router = Router()
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/login', async (req: Request, res: Response) => {
  const result = { success: false, message: '', token: '', role: '' }
  const user: string = req.body.user
  const password: string = req.body.password
  if (user !== undefined && user.length === 0) result.message = 'user is empty'
  else if (password !== undefined && password.length === 0) result.message = 'password is empty'
  else {
    const userResult = await new UserController().findByName(user)
    if (userResult == null) {
      result.message = 'user not exists'
    } else {
      const userDb = userResult
      if (validatePassword(password, userDb.password)) {
        dotenv.config()
        const secret: string = process.env.SECRET ?? ''
        result.message = 'login success'
        result.success = true
        result.role = userDb.role
        result.token = sign({
          id: userDb.id,
          nam: userDb.name,
          rol: userDb.role
          // exp: (new Date().getTime() / 1000) + (60 * 60)
        }, secret)
        const prismaClient = new Prisma().getPrismaClient()
        await prismaClient.user.update({
          where: {
            id: userDb.id
          },
          data: {
            lastLoginAt: new Date()
          }
        })
      } else { result.message = 'password is not valid' }
    }
  }

  res.json(result)
})

export default router
