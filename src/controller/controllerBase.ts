import { PrismaClient } from '@prisma/client'
import { Prisma } from '../prismaClient'
import { UserInfo, Model, OperationResult } from '../types'

export abstract class ControllerBase {
  constructor () {
    this.prismaClient = new Prisma().getPrismaClient()
  }

  public abstract read (userInfo: UserInfo, take?: number, skip?: number): Promise<Array<Partial<Model>> | OperationResult>
  public abstract find (userInfo: UserInfo, id: number): Promise<Partial<Model> | OperationResult | null>
  public abstract create (userInfo: UserInfo, data: Object): Promise<OperationResult>
  public abstract update (userInfo: UserInfo, id: number, data: Object): Promise<OperationResult>
  public abstract drop (userInfo: UserInfo, id: number): Promise<OperationResult>
  protected readonly prismaClient: PrismaClient

  protected errorResult (ex: any): OperationResult {
    return {
      success: false,
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      message: `server error, details: ${ex.message}`
    }
  }

  protected noPrivelegeResult (userName: string, role: string): OperationResult {
    return {
      success: false,
      message: `user: ${userName} is under role <${role}> and cann't perform operation`
    }
  }

  protected unsupportedResult (): OperationResult {
    return {
      success: false,
      message: 'unsupported operation'
    }
  }

  protected requiredResult (object: any, ...fields: string[]): OperationResult | false {
    // precondition: none

    // checking fields
    const missingFields: string[] = []
    for (let i = 0; i < fields.length; i++) {
      if (object[fields[i]] == null || object[fields[i]] === '') {
        missingFields.push(fields[i])
      }
    }

    // post condition
    if (missingFields.length === 0) return false
    else {
      let message = ''
      if (missingFields.length === 1) {
        message = `${missingFields[0]} is required for this opeation`
      } else {
        message = `${missingFields.join(', ')} are required for this operation`
      }

      return {
        success: false,
        message
      }
    }
  }
}
