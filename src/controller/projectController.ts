import { Project, PrismaClient } from '@prisma/client';
import { Prisma }  from '../prismaClient'

const prismaClient = new Prisma().getPrismaClient();

export async function read(take?: number, skip?: number ): Promise<Project[]> {
    
    let result: Project[] = await prismaClient.project.findMany({
        take,
        skip
     });
    return result
}

export async function find(id: number ): Promise<Project | object> {
    let result: Project | null = await prismaClient.project.findUnique({
        where: {
            id: id
        },
        include: {
            suspends: true,
            payments: true,
            media: true,
            engineer: true,
            company: true
        }
    })

    return result?? {}
}

export async function create(data: Object): Promise<Project> {
    let result: Project = await prismaClient.project.create({
        data: data as Project
    })

    return result;
}

export async function update(id: number, data: Object): Promise<Project> {
    let result: Project = await prismaClient.project.update({
        where: {
            id: id
        },
        data: data
    })

    return result
}

export async function drop(id: number): Promise<Project | object> {
    try {
        let result: Project = await prismaClient.project.delete({
            where: {
                id: id
            }
        })
        return result
    }
    catch (ex) {
        return {}
    }
}