import { Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
import { verify } from 'jsonwebtoken'
import { UserInfo } from '../types'

// read secret key
dotenv.config()
const secret: string = process.env.SECRET ?? ''

// middle ware function
export default function authorizationMiddleware (req: Request, res: Response, next: NextFunction): void {
  const authorization = req.header('Authorization')
  if (authorization !== '' && authorization !== undefined) {
    const authorizationToken = authorization.split(' ')[1]

    try {
      const result = verify(authorizationToken, secret)
      req.userInfo = result as UserInfo
      next()
    } catch (ex) {
      res.json(ex)
    }
  }
}
