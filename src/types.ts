import { User, Project, Media, Suspend, Payment, Extension, Comment } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime'

// declare interface
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userInfo: UserInfo
    }
  }
}

// exporting data types
export type Status = 'WORKING' | 'STOPPED' | 'COMPLETED' | 'LATE'

export interface FullProject extends Project {
  amountPaid: Decimal
  status?: Status
}

export interface UserInfo {
  id: number
  nam: string
  rol: 'ADMIN' | 'PROJECT_MANAGER' | 'VIEWER' | 'GOVERNOR'
}

export interface OperationResult {
  success: boolean
  message: string
}

export type Model = User | FullProject | Media | Suspend | Payment | Extension | Comment
