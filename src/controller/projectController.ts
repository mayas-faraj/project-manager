import { Project, PrismaClient } from '@prisma/client'
import { Prisma }  from '../prismaClient'
import { Model, UserInfo, OperationResult } from '../types'
import { ControllerBase } from './controllerBase'

export default class ProjectController extends ControllerBase {
    public constructor() {
        super()
        this.prismaClient = new Prisma().getPrismaClient()
    }

    public async read(userInfo: UserInfo, take?: number | undefined, skip?: number | undefined): Promise<Model[] | OperationResult> {
        let condition = undefined

        if(userInfo.rol === 'VIEWER')
            return {
                success: false,
                message: `user: ${userInfo.nam} is under role <viewr> and cann't read projects`
            };
        else if(userInfo.rol === 'PROJECT_MANAGER')
            condition = {
                creatorId: userInfo.id
            }
    
        let result: Project[] = await this.prismaClient.project.findMany({ 
            take, 
            skip,
            where: condition
        })
        return result;
    }
    public async find(userInfo: UserInfo, id: number): Promise<Model | OperationResult | null> {
        let creatorId = undefined

        if(userInfo.rol === 'VIEWER')
            return {
                success: false,
                message: `user: ${userInfo.nam} is under role <viewr> and cann't search for project`
            };
        else if(userInfo.rol === 'PROJECT_MANAGER')
            creatorId = userInfo.id

        let result: Project | null = await this.prismaClient.project.findFirst({
            where: {
                AND: {
                    id: id,
                    creatorId: creatorId
                }
            },
            include: {
                suspends: true,
                payments: true,
                media: true,
                company: true,
                engineer: true,  
            }
        })

        return result;
    }
    public async create(userInfo: UserInfo, data: Object): Promise<OperationResult> {
        if(userInfo.rol === 'VIEWER')
            return {
                success: false,
                message: `user: ${userInfo.nam} is under role <viewr> and cann't create project`
            };
        
        const projectData = data as Project
        projectData.creatorId = userInfo.id
        
        let result: Project = await this.prismaClient.project.create({
            data: data as Project
        })
    
        return {
            success: true,
            message: `project has been created`
        };
    }

    public async update(userInfo: UserInfo, id: number, data: Object): Promise<OperationResult> {
        let creatorId = undefined

        if(userInfo.rol === 'VIEWER')
            return {
                success: false,
                message: `user: ${userInfo.nam} is under role <viewr> and cann't update project`
            };
        else if(userInfo.rol === 'PROJECT_MANAGER')
            creatorId = userInfo.id

        try {
            let result = await this.prismaClient.project.updateMany({
                where: {
                    AND: {
                        id: id,
                        creatorId: creatorId
                    }
                },
                data: data
            })
        
            if(result.count>0)
                return {
                    success: true,
                    message: `project has been updated`
                };
            else
                return {
                    success: false,
                    message: `project ${id} not found or user: ${userInfo.nam} is cann't update the project, or no update will made`
                };
        }
        catch (ex) {
            return {
                success: false,
                message: `unique constraint error for project: ${id} or internal error`
            }
        }
    }
    public async drop(userInfo: UserInfo, id: number): Promise<OperationResult> {
        let creatorId = undefined

        if(userInfo.rol === 'VIEWER')
            return {
                success: false,
                message: `user: ${userInfo.nam} is under role <viewr> and cann't delete project`
            };
        else if(userInfo.rol === 'PROJECT_MANAGER')
            creatorId = userInfo.id

        try {
            let result = await this.prismaClient.project.deleteMany({
                where: {
                    AND: {
                        id: id,
                        creatorId: creatorId
                    }
                }
            })
            
            if(result.count>0)
            return {
                success: true,
                message: `project has been delete`
            };
        else
            return {
                success: false,
                message: `project ${id} not found or user: ${userInfo.nam} is cann't delete the project`
            };
        }
        catch (ex) {
            return {
                success: false,
                message: `project ${id} not found or internal error`
            };
        }
    }

    private prismaClient: PrismaClient
}