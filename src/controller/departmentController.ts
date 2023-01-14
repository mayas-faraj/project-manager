import { Department, PrismaClient } from '@prisma/client'
import { Prisma } from '../prismaClient'
import { Model, UserInfo, OperationResult } from '../types'
import { ControllerBase } from './controllerBase'

export default class DepartmentController extends ControllerBase {
  public constructor () {
    super()
    this.prismaClient = new Prisma().getPrismaClient()
  }

  public async read (userInfo: UserInfo, take?: number | undefined, skip?: number | undefined): Promise<Model[] | OperationResult> {
    let condition

    if (userInfo.rol === 'VIEWER') {
      return {
        success: false,
        message: `user: ${userInfo.nam} is under role <viewr> and cann't read departments`
      }
    } else if (userInfo.rol === 'PROJECT_MANAGER') {
      condition = {
        creatorId: userInfo.id
      }
    }

    const result: Department[] = await this.prismaClient.department.findMany({
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
        message: `user: ${userInfo.nam} is under role <viewr> and cann't search for department`
      }
    } else if (userInfo.rol === 'PROJECT_MANAGER') { creatorId = userInfo.id }

    const result: Department | null = await this.prismaClient.department.findFirst({
      where: {
        AND: {
          id,
          creatorId
        }
      },
      include: {
        engineers: true
      }
    })

    return result
  }

  public async create (userInfo: UserInfo, data: Object): Promise<OperationResult> {
    if (userInfo.rol === 'VIEWER') {
      return {
        success: false,
        message: `user: ${userInfo.nam} is under role <viewr> and cann't create department`
      }
    }

    const departmentData = data as Department
    departmentData.creatorId = userInfo.id

    const result = await this.prismaClient.department.create({
      data: data as Department
    })

    if (result !== undefined) {
      return {
        success: true,
        message: 'department has been created'
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
        message: `user: ${userInfo.nam} is under role <viewr> and cann't update department`
      }
    } else if (userInfo.rol === 'PROJECT_MANAGER') { creatorId = userInfo.id }

    try {
      const result = await this.prismaClient.department.updateMany({
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
          message: 'department has been updated'
        }
      } else {
        return {
          success: false,
          message: `department ${id} not found or user: ${userInfo.nam} is cann't update the department, or no update will made`
        }
      }
    } catch (ex) {
      return {
        success: false,
        message: `unique constraint error for department: ${id} or internal error`
      }
    }
  }

  public async drop (userInfo: UserInfo, id: number): Promise<OperationResult> {
    let creatorId

    if (userInfo.rol === 'VIEWER') {
      return {
        success: false,
        message: `user: ${userInfo.nam} is under role <viewr> and cann't delete department`
      }
    } else if (userInfo.rol === 'PROJECT_MANAGER') { creatorId = userInfo.id }

    try {
      const result = await this.prismaClient.department.deleteMany({
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
          message: 'department has been delete'
        }
      } else {
        return {
          success: false,
          message: `department ${id} not found or user: ${userInfo.nam} is cann't delete the department`
        }
      }
    } catch (ex) {
      return {
        success: false,
        message: `department ${id} not found or internal error`
      }
    }
  }

  private readonly prismaClient: PrismaClient
}
