import { User } from '@prisma/client'
import { getPasswordHash } from '../password-hash'
import { Model, UserInfo, OperationResult } from '../types'
import { ControllerBase } from './controllerBase'

export default class UserController extends ControllerBase {
  public constructor () {
    super()
  }

  public async read (userInfo: UserInfo, take?: number | undefined, skip?: number | undefined): Promise<Array<Partial<Model>> | OperationResult> {
    // precondition: none

    // chekking priveleges
    if (userInfo.rol !== 'ADMIN') return this.noPrivelegeResult(userInfo.nam, userInfo.rol)

    // critical operation
    let result: Array<Partial<User>>
    try {
      result = await this.prismaClient.user.findMany({
        take,
        skip,
        select: {
          id: true,
          name: true,
          avatar: true,
          role: true,
          lastLoginAt: true
        }
      })
    } catch (ex: any) {
      return this.errorResult(ex)
    }

    return result
  }

  public async find (userInfo: UserInfo, id: number): Promise<Partial<Model> | OperationResult | null> {
    // precondition: none

    // checking priveleges
    let recordId: number
    if (userInfo.rol === 'ADMIN' || (id === 0)) recordId = id !== 0 ? id : userInfo.id
    else {
      return {
        success: false,
        message: `user: ${userInfo.nam} is not admin and not the same user to fetch`
      }
    }

    // critical operation
    try {
      const result = await this.prismaClient.user.findFirst({
        where: {
          id: recordId
        },
        select: {
          id: true,
          name: true,
          avatar: true,
          lastLoginAt: true,
          role: true,
          createdAt: true,
          createdProjects: {
            select: {
              name: true,
              avatar: true
            }
          }
        }
      })
      return result
    } catch (ex) {
      return {
        success: false,
        message: `server site error for user while finding user: ${id}`
      }
    }
  }

  public async create (userInfo: UserInfo, data: Object): Promise<OperationResult> {
    // precondition
    const missingFields = this.requiredResult(data, 'name', 'password', 'role')
    if (missingFields !== false) return missingFields

    // checking privelege
    if (userInfo.rol !== 'ADMIN') return this.noPrivelegeResult(userInfo.nam, userInfo.rol)

    // critical operations
    const userData = data as User
    let result

    try {
      result = await this.prismaClient.user.create({
        data: userData
      })
    } catch (ex: any) {
      return this.errorResult(ex)
    }

    // post condition
    if (result !== undefined) {
      return {
        success: true,
        message: 'user has been created'
      }
    } else {
      return {
        success: false,
        message: 'no entity created'
      }
    }
  }

  public async update (userInfo: UserInfo, id: number, data: Object): Promise<OperationResult> {
    // precondition: none

    // checking privelege
    if (userInfo.rol !== 'ADMIN' && id !== 0) {
      return {
        success: false,
        message: `user: ${userInfo.nam} is not admin and not the same user to update`
      }
    }

    // critical operatoin
    const userData = data as User
    if (userData.password !== undefined) userData.password = getPasswordHash(userData.password)
    const condition = { id: id !== 0 ? id : userInfo.id }

    let result
    try {
      result = await this.prismaClient.user.update({
        where: condition,
        data
      })
    } catch (ex) {
      return {
        success: false,
        message: `unique constraint error for user: ${id} or internal error`
      }
    }

    // post condition
    if (result !== undefined) {
      return {
        success: true,
        message: 'user has been updated'
      }
    } else {
      return {
        success: false,
        message: `user ${id} not found or user: ${userInfo.nam} is cann't update the user, or no update will made`
      }
    }
  }

  public async drop (userInfo: UserInfo, id: number): Promise<OperationResult> {
    // precondition: none

    //  checking priveleges
    if (userInfo.rol !== 'ADMIN') return this.noPrivelegeResult(userInfo.nam, userInfo.rol)

    // critical operatoin
    let result
    try {
      result = await this.prismaClient.user.delete({
        where: {
          id
        }
      })
    } catch (ex) {
      return {
        success: false,
        message: `user ${id} not found or internal error`
      }
    }

    // post condition
    if (result !== undefined) {
      return {
        success: true,
        message: 'user has been delete'
      }
    } else {
      return {
        success: false,
        message: `user ${id} not found or user: ${userInfo.nam} is cann't delete the user`
      }
    }
  }

  public async findByName (name: string): Promise<User | null> {
    // precondition: none

    // critical operation
    let result
    try {
      result = await this.prismaClient.user.findUnique({
        where: {
          name
        }
      })
    } catch (ex: any) {
      return null
    }

    return result ?? null
  }
}
