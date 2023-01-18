import { User, Project, Media, Suspend, Payment, Extensions } from '@prisma/client'

// declare interface
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userInfo: UserInfo
    }
  }
}

export interface UserInfo {
  id: number
  nam: string
  rol: string
}

export interface OperationResult {
  success: boolean
  message: string
}

export type Model = User | Project | Media | Suspend | Payment | Extensions
