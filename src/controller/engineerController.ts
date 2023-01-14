import { Engineer, PrismaClient } from '@prisma/client'
import { Prisma } from '../prismaClient'
import { Model, UserInfo, OperationResult } from '../types'
import { ControllerBase } from './controllerBase'

export default class EngineerController extends ControllerBase {
  public constructor () {
    super()
    this.prismaClient = new Prisma().getPrismaClient()
  }

  public async read (userInfo: UserInfo, take?: number | undefined, skip?: number | undefined): Promise<Model[] | OperationResult> {
    let condition

    if (userInfo.rol === 'VIEWER') {
      return {
        success: false,
        message: `user: ${userInfo.nam} is under role <viewr> and cann't read engineers`
      }
    } else if (userInfo.rol === 'PROJECT_MANAGER') {
      condition = {
        creatorId: userInfo.id
      }
    }

    const result: Engineer[] = await this.prismaClient.engineer.findMany({
      take,
      skip,
      where: condition
    })
    return result
  }

  public async find (userInfo: UserInfo, id: number): Promise<Model | OperationResult | null> {
    let creatorId

    if (userInfo.rol === 'VIEWER') {
      return {
        success: false,
        message: `user: ${userInfo.nam} is under role <viewr> and cann't search for engineer`
      }
    } else if (userInfo.rol === 'PROJECT_MANAGER') { creatorId = userInfo.id }

    const result: Engineer | null = await this.prismaClient.engineer.findFirst({
      where: {
        AND: {
          id,
          creatorId
        }
      },
      include: {
        projects: true,
        department: true
      }
    })

    return result
  }

  public async create (userInfo: UserInfo, data: Object): Promise<OperationResult> {
    if (userInfo.rol === 'VIEWER') {
      return {
        success: false,
        message: `user: ${userInfo.nam} is under role <viewr> and cann't create engineer`
      }
    }

    const engineerData = data as Engineer
    engineerData.creatorId = userInfo.id

    const result = await this.prismaClient.engineer.create({
      data: data as Engineer
    })

    if (result !== undefined) {
      return {
        success: true,
        message: 'engineer has been created'
      }
    } else {
      return {
        success: false,
        message: 'no data created'
      }
    }
  }

  public async update (userInfo: UserInfo, id: number, data: Object): Promise<OperationResult> {
    let creatorId

    if (userInfo.rol === 'VIEWER') {
      return {
        success: false,
        message: `user: ${userInfo.nam} is under role <viewr> and cann't update engineer`
      }
    } else if (userInfo.rol === 'PROJECT_MANAGER') { creatorId = userInfo.id }

    try {
      const result = await this.prismaClient.engineer.updateMany({
        where: {
          AND: {
            id,
            creatorId
          }
        },
        data
      })

      if (result.count > 0) {
        return {
          success: true,
          message: 'engineer has been updated'
        }
      } else {
        return {
          success: false,
          message: `engineer ${id} not found or user: ${userInfo.nam} is cann't update the engineer, or no update will made`
        }
      }
    } catch (ex) {
      return {
        success: false,
        message: `unique constraint error for engineer: ${id} or internal error`
      }
    }
  }

  public async drop (userInfo: UserInfo, id: number): Promise<OperationResult> {
    let creatorId

    if (userInfo.rol === 'VIEWER') {
      return {
        success: false,
        message: `user: ${userInfo.nam} is under role <viewr> and cann't delete engineer`
      }
    } else if (userInfo.rol === 'PROJECT_MANAGER') { creatorId = userInfo.id }

    try {
      const result = await this.prismaClient.engineer.deleteMany({
        where: {
          AND: {
            id,
            creatorId
          }
        }
      })

      if (result.count > 0) {
        return {
          success: true,
          message: 'engineer has been delete'
        }
      } else {
        return {
          success: false,
          message: `engineer ${id} not found or user: ${userInfo.nam} is cann't delete the engineer`
        }
      }
    } catch (ex) {
      return {
        success: false,
        message: `engineer ${id} not found or internal error`
      }
    }
  }

  private readonly prismaClient: PrismaClient
}
