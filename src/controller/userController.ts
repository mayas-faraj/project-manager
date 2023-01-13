import { User, PrismaClient } from '@prisma/client';
import { Prisma }  from '../prismaClient'

const prismaClient = new Prisma().getPrismaClient();

export async function read(take?: number, skip?: number ): Promise<User[]> {
    
    let result: User[] = await prismaClient.user.findMany({ take, skip });
    return result
}

export async function find(id: number ): Promise<User | object> {
    let result: User | null = await prismaClient.user.findUnique({
        where: {
            id: id
        }
    })

    return result?? {}
}

export async function create(data: Object): Promise<User> {
    let result: User = await prismaClient.user.create({
        data: data as User
    })

    return result;
}

export async function update(id: number, data: Object): Promise<User> {
    let result: User = await prismaClient.user.update({
        where: {
            id: id
        },
        data: data
    })

    return result
}

export async function drop(id: number): Promise<User | object> {
    try {
        let result: User = await prismaClient.user.delete({
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