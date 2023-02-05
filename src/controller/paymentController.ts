import { Payment } from '@prisma/client'
import { Model, UserInfo, OperationResult } from '../types'
import { ControllerBase } from './controllerBase'

export default class PaymentController extends ControllerBase {
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
    let result: Array<Partial<Payment>>
    try {
      result = await this.prismaClient.payment.findMany({
        take,
        skip,
        where: condition,
        select: {
          id: true,
          amount: true,
          paidAt: true,
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
    const missingFields = this.requiredResult(data, 'projectId', 'amount', 'description')
    if (missingFields !== false) return missingFields

    // checking privelege
    if (userInfo.rol === 'VIEWER' || userInfo.rol === 'GOVERNOR') return this.noPrivelegeResult(userInfo.nam, userInfo.rol)

    const paymentData = data as Payment
    if (paymentData.paidAt != null) paymentData.paidAt = new Date(paymentData.paidAt)
    if (userInfo.rol === 'PROJECT_MANAGER') {
      try {
        const result = await this.prismaClient.project.findUnique({
          where: {
            id: paymentData.projectId
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
    paymentData.creatorId = userInfo.id
    let result
    try {
      result = await this.prismaClient.payment.create({
        data: paymentData
      })
    } catch (ex: any) {
      return this.errorResult(ex)
    }

    // post condition
    if (result !== undefined) {
      return {
        success: true,
        message: 'payment has been created'
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
    if (userInfo.rol === 'VIEWER' || userInfo.rol === 'GOVERNOR') return this.noPrivelegeResult(userInfo.nam, userInfo.rol)

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
      result = await this.prismaClient.payment.deleteMany({
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
        message: 'payment has been delete'
      }
    } else {
      return {
        success: false,
        message: `payment ${id} not found or user: ${userInfo.nam} is cann't delete the payment`
      }
    }
  }
}
