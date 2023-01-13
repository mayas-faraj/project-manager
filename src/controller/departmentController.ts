import { Department, PrismaClient } from '@prisma/client';
import { Prisma }  from '../prismaClient'

const prismaClient = new Prisma().getPrismaClient();

export async function read(take?: number, skip?: number ): Promise<Department[]> {
    
    let result: Department[] = await prismaClient.department.findMany({ take, skip });
    return result
}

export async function find(id: number ): Promise<Department | object> {
    let result: Department | null = await prismaClient.department.findUnique({
        where: {
            id: id
        }
    })

    return result?? {}
}

export async function create(data: Object): Promise<Department> {
    let result: Department = await prismaClient.department.create({
        data: data as Department
    })

    return result;
}

export async function update(id: number, data: Object): Promise<Department> {
    let result: Department = await prismaClient.department.update({
        where: {
            id: id
        },
        data: data
    })

    return result
}

export async function drop(id: number): Promise<Department | object> {
    try {
        let result: Department = await prismaClient.department.delete({
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