import { Project } from '@prisma/client'
import { Model, UserInfo, OperationResult } from '../types'
import { ControllerBase } from './controllerBase'

export default class ProjectController extends ControllerBase {
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
    let result: Array<Partial<Project>>
    try {
      result = await this.prismaClient.project.findMany({
        take,
        skip,
        where: condition,
        select: {
          id: true,
          name: true,
          remark: true,
          avatar: true,
          status: true,
          amountPaid: true,
          companyName: true,
          engineerName: true,
          engineerPhone: true,
          engineerDepartment: true,
          cost: true,
          duration: true,
          longitude: true,
          latitude: true,
          createdAt: true,
          creator: {
            select: {
              name: true,
              avatar: true
            }
          },
          media: {
            select: {
              id: true,
              src: true,
              title: true,
              orderIndex: true
            },
            orderBy: {
              orderIndex: 'asc'
            }
          },
          extensions: {
            select: {
              id: true,
              byDuration: true,
              description: true,
              documentUrl: true
            }
          },
          payments: {
            select: {
              id: true,
              amount: true,
              description: true,
              paidAt: true
            }
          },
          suspends: {
            select: {
              id: true,
              description: true,
              documentUrl: true,
              fromDate: true,
              toDate: true
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

    // checking priveleges
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

    // critical operation
    let result: Partial<Project> | null
    try {
      result = await this.prismaClient.project.findFirst({
        where: {
          AND: condition
        },
        select: {
          id: true,
          name: true,
          remark: true,
          longitude: true,
          latitude: true,
          companyName: true,
          engineerName: true,
          engineerPhone: true,
          engineerDepartment: true,
          avatar: true,
          duration: true,
          cost: true,
          amountPaid: true,
          status: true,
          suspends: {
            select: {
              id: true,
              fromDate: true,
              toDate: true,
              description: true,
              documentUrl: true
            }
          },
          extensions: {
            select: {
              id: true,
              byDuration: true,
              description: true,
              documentUrl: true
            }
          },
          payments: {
            select: {
              id: true,
              amount: true,
              paidAt: true,
              description: true
            }
          },
          media: {
            select: {
              id: true,
              src: true,
              title: true,
              orderIndex: true
            },
            orderBy: {
              orderIndex: 'asc'
            }
          },
          creator: {
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

  public async create (userInfo: UserInfo, data: Object): Promise<OperationResult> {
    // precondition
    const missingFields = this.requiredResult(data, 'name', 'cost', 'amountPaid', 'duration')
    if (missingFields !== false) return missingFields

    // checking privelege
    if (userInfo.rol === 'VIEWER') return this.noPrivelegeResult(userInfo.nam, userInfo.rol)

    // critical operation
    const projectData = data as Project
    projectData.creatorId = userInfo.id
    let result
    try {
      result = await this.prismaClient.project.create({
        data: data as Project
      })
    } catch (ex: any) {
      return this.errorResult(ex)
    }

    // post condition
    if (result !== undefined) {
      return {
        success: true,
        message: 'project has been created'
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
      result = await this.prismaClient.project.updateMany({
        where: {
          AND: condition
        },
        data
      })
    } catch (ex) {
      return this.errorResult(ex)
    }

    // post condition
    if (result.count > 0) {
      return {
        success: true,
        message: 'project has been updated'
      }
    } else {
      return {
        success: false,
        message: `project ${id} not found or user: ${userInfo.nam} is cann't update the project, or no update will made`
      }
    }
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
      result = await this.prismaClient.project.deleteMany({
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
        message: 'project has been delete'
      }
    } else {
      return {
        success: false,
        message: `project ${id} not found or user: ${userInfo.nam} is cann't delete the project`
      }
    }
  }
}
