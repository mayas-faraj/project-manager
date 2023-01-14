import { User, PrismaClient } from '@prisma/client'
import { Prisma }  from '../prismaClient'
import { Model, UserInfo, OperationResult } from '../types'
import { ControllerBase } from './controllerBase'

export default class UserController extends ControllerBase {
    public constructor() {
        super()
        this.prismaClient = new Prisma().getPrismaClient()
    }

    public async read(userInfo: UserInfo, take?: number | undefined, skip?: number | undefined): Promise<Model[] | OperationResult> {
        let condition = undefined

        if(userInfo.rol !== 'ADMIN')
            return {
                success: false,
                message: `user: ${userInfo.nam} is under role <viewr> or <project-manager> and cann't read users`
            };
        
        let result: User[] = await this.prismaClient.user.findMany({ 
            take, 
            skip,
        })
        return result;
    }
    public async find(userInfo: UserInfo, id: number): Promise<Model | OperationResult | null> {
        if(userInfo.rol !== 'ADMIN')
            return {
                success: false,
                message: `user: ${userInfo.nam} is under role <viewr> or <project-manager> and cann't search for users`
            };
        
        let result: User | null = await this.prismaClient.user.findFirst({})

        return result;
    }
    public async create(userInfo: UserInfo, data: Object): Promise<OperationResult> {
        if(userInfo.rol !== 'ADMIN')
            return {
                success: false,
                message: `user: ${userInfo.nam} is under role <viewr> or <project-manager> and cann't create user`
            };
        
        let result: User = await this.prismaClient.user.create({
            data: data as User
        })
    
        return {
            success: true,
            message: `user has been created`
        };
    }

    public async update(userInfo: UserInfo, id: number, data: Object): Promise<OperationResult> {
        let creatorId = undefined

        if(userInfo.rol === 'ADMIN' || id === userInfo.id)
            try {
                let result = await this.prismaClient.user.update({ 
                    where: { 
                        id : id
                    },
                    data: data
                })

                if(result)
                    return {
                        success: true,
                        message: `user has been updated`
                    };
                else
                    return {
                        success: false,
                        message: `user ${id} not found or user: ${userInfo.nam} is cann't update the user, or no update will made`
                    };
            }
            catch (ex) {
                return {
                    success: false,
                    message: `unique constraint error for user: ${id} or internal error`
                }
            }
        else
            return {
                success: false,
                message: `user: ${userInfo.nam} is not admin and not the same user to update`
            }
    }

    public async drop(userInfo: UserInfo, id: number): Promise<OperationResult> {
        if(userInfo.rol !== 'ADMIN')
            return {
                success: false,
                message: `user: ${userInfo.nam} is under role <viewr> or <project-manager> and cann't delete user`
            }

        try {
            let result = await this.prismaClient.user.delete({
                where: {
                    id: id,
                }
            })
            
            if(result)
                return {
                    success: true,
                    message: `user has been delete`
                }
        else
            return {
                success: false,
                message: `user ${id} not found or user: ${userInfo.nam} is cann't delete the user`
            };
        }
        catch (ex) {
            return {
                success: false,
                message: `user ${id} not found or internal error`
            };
        }
    }

    public async findByName(name: string ): Promise<User | null> {
        let result: User | null = await this.prismaClient.user.findUnique({
            where: {
                name: name
            }
        })
    
        return result?? null
    }

    private prismaClient: PrismaClient
}
