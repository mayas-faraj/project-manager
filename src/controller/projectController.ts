import { Project } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime'
import { Model, UserInfo, OperationResult, Status, FullProject } from '../types'
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
    let result
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
          companyName: true,
          engineerName: true,
          engineerPhone: true,
          engineerDepartment: true,
          cost: true,
          duration: true,
          longitude: true,
          latitude: true,
          isCompleted: true,
          createdAt: true,
          updatedAt: true,
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
          },
          comments: {
            select: {
              id: true,
              text: true,
              createdAt: true
            }
          }
        }

      })
    } catch (ex: any) {
      return this.errorResult(ex)
    }

    return result.map(item => {
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      const extensionsDuration = item.extensions.reduce((acc, obj) => acc + obj.byDuration, 0)
      return {
        ...item,
        amountPaid: item.payments.reduce((acc, obj) => acc.add(obj.amount), new Decimal(0)),
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        duration: item.duration + extensionsDuration,
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        status: item.isCompleted === 1 ? 'COMPLETED' : this.getStatus(item.createdAt, item.duration + extensionsDuration, item.suspends.map(suspend => ({ from: suspend.fromDate, to: suspend.toDate })))
      }
    })
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
    let result
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
          isCompleted: true,
          createdAt: true,
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
          },
          comments: {
            select: {
              id: true,
              text: true,
              createdAt: true
            }
          }
        }
      })
    } catch (ex: any) {
      return this.errorResult(ex)
    }

    if (result != null) {
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      const extensionsDuration = result.extensions.reduce((acc, obj) => acc + obj.byDuration, 0)
      return {
        ...result,
        amountPaid: result.payments.reduce((acc, obj) => acc.add(obj.amount), new Decimal(0)),
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        duration: result.duration + extensionsDuration,
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        status: result.isCompleted === 1 ? 'COMPLETED' : this.getStatus(result.createdAt, result.duration + extensionsDuration, result.suspends.map(suspend => ({ from: suspend.fromDate, to: suspend.toDate })))
      }
    }

    return result
  }

  public async create (userInfo: UserInfo, data: Object): Promise<OperationResult> {
    // precondition
    const missingFields = this.requiredResult(data, 'name', 'cost', 'duration')
    if (missingFields !== false) return missingFields

    // checking privelege
    if (userInfo.rol === 'VIEWER' || userInfo.rol === 'GOVERNOR') return this.noPrivelegeResult(userInfo.nam, userInfo.rol)

    // critical operation
    const projectData = data as Project
    projectData.creatorId = userInfo.id
    if (projectData.createdAt != null) projectData.createdAt = new Date(projectData.createdAt)

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
    const projectData = data as FullProject
    if (projectData.createdAt != null) projectData.createdAt = new Date(projectData.createdAt)
    if (projectData.status != null) {
      projectData.isCompleted = (projectData.status === 'COMPLETED') ? 1 : 0
      delete projectData.status
    }
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

  private getStatus (createdDate: Date, duration: number, suspends: Array<{ from: Date, to: Date }>): Status {
    const now = Date.now()
    for (let i = 0; i < suspends.length; i++) {
      if (suspends[i].from.getTime() <= now && suspends[i].to.getTime() > now) {
        return 'STOPPED'
      }
    }

    if (now < createdDate.getTime() + duration * (1000 * 60 * 60 * 24)) return 'WORKING'
    else return 'LATE'
  }
}
