import { Company, Department, Engineer, User, Project, Media, Suspend, Payment } from '@prisma/client'

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

export type Model = Company | Department | Engineer | User | Project | Media | Suspend | Payment
