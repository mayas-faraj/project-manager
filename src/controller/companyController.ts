import { Company } from '@prisma/client';
import { Prisma }  from '../prismaClient'

const prismaClient = new Prisma().getPrismaClient();

export async function read(take?: number, skip?: number ): Promise<Company[]> {
    
    let result: Company[] = await prismaClient.company.findMany({ take, skip });
    return result;
}

export async function find(id: number ): Promise<Company | object> {
    let result: Company | null = await prismaClient.company.findUnique({
        where: {
            id: id
        }
    })

    return result?? {}
}

export async function create(data: Object): Promise<Company> {
    let result: Company = await prismaClient.company.create({
        data: data as Company
    })

    return result;
}

export async function update(id: number, data: Object): Promise<Company> {
    let result: Company = await prismaClient.company.update({
        where: {
            id: id
        },
        data: data
    })

    return result
}

export async function drop(id: number): Promise<Company | object> {
    try {
        let result: Company = await prismaClient.company.delete({
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