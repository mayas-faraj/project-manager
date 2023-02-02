import { Extension } from '@prisma/client'
import { Model, UserInfo, OperationResult } from '../types'
import { ControllerBase } from './controllerBase'

export default class ExtensionController extends ControllerBase {
  public constructor () {
    super()
  }

  public async read (userInfo: UserInfo, take?: number | undefined, skip?: number | undefined): Promise<Array<Partial<Model>> | OperationResult> {
    // precondition: none

    // checking privileges
    let condition

    if (userInfo.rol === 'PROJECT_MANAGER') {
      condition = {
        creatorId: userInfo.id
      }
    }

    // critical operation
    let result: Array<Partial<Extension>>
    try {
      result = await this.prismaClient.extension.findMany({
        take,
        skip,
        where: condition,
        select: {
          id: true,
          documentUrl: true,
          byDuration: true,
          description: true,
          project: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        }

      })
    } catch (ex: any) {
      return this.errorResult(ex)
    }

    return result
  }

  public async find (userInfo: UserInfo, id: number): Promise<Partial<Model> | OperationResult | null> {
    // precondition: none
    return this.unsupportedResult()
  }

  public async create (userInfo: UserInfo, data: Object): Promise<OperationResult> {
    // precondition
    const missingFields = this.requiredResult(data, 'projectId', 'byDuration')
    if (missingFields !== false) return missingFields

    // checking privelege
    if (userInfo.rol === 'VIEWER') return this.noPrivelegeResult(userInfo.nam, userInfo.rol)

    const extensionData = data as Extension
    if (userInfo.rol === 'PROJECT_MANAGER') {
      try {
        const result = await this.prismaClient.project.findUnique({
          where: {
            id: extensionData.projectId
          },
          select: {
            creatorId: true
          }
        })

        if (result?.creatorId !== userInfo.id) return this.noPrivelegeResult(userInfo.nam, userInfo.rol)
      } catch (ex: any) {
        return this.errorResult(ex)
      }
    }

    // critical operation
    extensionData.creatorId = userInfo.id
    let result
    try {
      result = await this.prismaClient.extension.create({
        data: data as Extension
      })
    } catch (ex: any) {
      return this.errorResult(ex)
    }

    // post condition
    if (result !== undefined) {
      return {
        success: true,
        message: 'extension has been created'
      }
    } else {
      return {
        success: false,
        message: 'no data created'
      }
    }
  }

  public async update (userInfo: UserInfo, id: number, data: Object): Promise<OperationResult> {
    // precondition: none
    return this.unsupportedResult()
  }

  public async drop (userInfo: UserInfo, id: number): Promise<OperationResult> {
    // precondition: none

    // checking privelege
    if (userInfo.rol === 'VIEWER') return this.noPrivelegeResult(userInfo.nam, userInfo.rol)

    const condition: {
      id: number
      creatorId: number | undefined
    } = {
      id,
      creatorId: undefined
    }

    if (userInfo.rol === 'PROJECT_MANAGER') {
      condition.creatorId = userInfo.id
    }

    // critical operatoin
    let result
    try {
      result = await this.prismaClient.extension.deleteMany({
        where: {
          AND: condition
        }
      })
    } catch (ex) {
      return this.errorResult(ex)
    }

    // post condition
    if (result.count > 0) {
      return {
        success: true,
        message: 'extension has been delete'
      }
    } else {
      return {
        success: false,
        message: `extension ${id} not found or user: ${userInfo.nam} is cann't delete the extension`
      }
    }
  }
}
