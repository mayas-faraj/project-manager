import { Engineer } from '@prisma/client';
import { Prisma }  from '../prismaClient'

const prismaClient = new Prisma().getPrismaClient();

export async function read(take?: number, skip?: number ): Promise<Engineer[]> {
    
    let result: Engineer[] = await prismaClient.engineer.findMany({ take, skip });
    return result
}

export async function find(id: number ): Promise<Engineer | object> {
    let result: Engineer | null = await prismaClient.engineer.findUnique({
        where: {
            id: id
        },
        include: {
            department: true
        }
    })

    return result?? {}
}

export async function create(data: Object): Promise<Engineer> {
    let result: Engineer = await prismaClient.engineer.create({
        data: data as Engineer
    })

    return result;
}

export async function update(id: number, data: Object): Promise<Engineer> {
    let result: Engineer = await prismaClient.engineer.update({
        where: {
            id: id
        },
        data: data
    })

    return result
}

export async function drop(id: number): Promise<Engineer | object> {
    try {
        let result: Engineer = await prismaClient.engineer.delete({
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