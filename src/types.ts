import { Request} from 'express';
import { Company, Department, Engineer, User, Project} from '@prisma/client'

// declare interface
declare global {
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

export type Model = Company | Department | Engineer | User | Project


