import { Company, PrismaClient } from '@prisma/client'
import { Model, UserInfo, OperationResult } from '../types'
import { ControllerBase } from './controllerBase'

export default class CompanyController extends ControllerBase {
  public constructor () {
    super()
  }

  public async read (userInfo: UserInfo, take?: number | undefined, skip?: number | undefined): Promise<Model[] | OperationResult> {
    let condition

    if (userInfo.rol === 'VIEWER') {
      return {
        success: false,
        message: `user: ${userInfo.nam} is under role <viewr> and cann't read companies`
      }
    } else if (userInfo.rol === 'PROJECT_MANAGER') {
      condition = {
        creatorId: userInfo.id
      }
    }

    const result: Company[] = await this.prismaClient.company.findMany({
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
        message: `user: ${userInfo.nam} is under role <viewr> and cann't search for company`
      }
    } else if (userInfo.rol === 'PROJECT_MANAGER') { creatorId = userInfo.id }

    const result: Company | null = await this.prismaClient.company.findFirst({
      where: {
        AND: {
          id,
          creatorId
        }
      },
      include: {
        projects: true
      }
    })

    return result
  }

  public async create (userInfo: UserInfo, data: Object): Promise<OperationResult> {
    if (userInfo.rol === 'VIEWER') {
      return {
        success: false,
        message: `user: ${userInfo.nam} is under role <viewr> and cann't create company`
      }
    }

    const companyData = data as Company
    companyData.creatorId = userInfo.id

    const result = await this.prismaClient.company.create({
      data: data as Company
    })

    if (result !== undefined) {
      return {
        success: true,
        message: 'company has been created'
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
        message: `user: ${userInfo.nam} is under role <viewr> and cann't update company`
      }
    } else if (userInfo.rol === 'PROJECT_MANAGER') { creatorId = userInfo.id }

    try {
      const result = await this.prismaClient.company.updateMany({
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
          message: 'company has been updated'
        }
      } else {
        return {
          success: false,
          message: `company ${id} not found or user: ${userInfo.nam} is cann't update the company, or no update will made`
        }
      }
    } catch (ex) {
      return {
        success: false,
        message: `unique constraint error for company: ${id} or internal error`
      }
    }
  }

  public async drop (userInfo: UserInfo, id: number): Promise<OperationResult> {
    let creatorId

    if (userInfo.rol === 'VIEWER') {
      return {
        success: false,
        message: `user: ${userInfo.nam} is under role <viewr> and cann't delete company`
      }
    } else if (userInfo.rol === 'PROJECT_MANAGER') { creatorId = userInfo.id }

    try {
      const result = await this.prismaClient.company.deleteMany({
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
          message: 'company has been delete'
        }
      } else {
        return {
          success: false,
          message: `company ${id} not found or user: ${userInfo.nam} is cann't delete the company`
        }
      }
    } catch (ex) {
      return {
        success: false,
        message: `company ${id} not found or internal error`
      }
    }
  }
}
