import { Project } from '@prisma/client'
import { Model, UserInfo, OperationResult } from '../types'
import { ControllerBase } from './controllerBase'

export default class ProjectController extends ControllerBase {
  public constructor () {
    super()
  }

  public async read (userInfo: UserInfo, take?: number | undefined, skip?: number | undefined): Promise<Model[] | OperationResult> {
    let condition

    if (userInfo.rol === 'VIEWER') {
      return {
        success: false,
        message: `user: ${userInfo.nam} is under role <viewr> and cann't read projects`
      }
    } else if (userInfo.rol === 'PROJECT_MANAGER') {
      condition = {
        creatorId: userInfo.id
      }
    }

    const result: Project[] = await this.prismaClient.project.findMany({
      take,
      skip,
      where: condition,
      include: {
        media: {
          orderBy: {
            orderIndex: 'asc'
          }
        }
      }
    })

    result.forEach(project => {
      this.addAvatarField(project)
    })

    return result
  }

  public async find (userInfo: UserInfo, id: number): Promise<Model | OperationResult | null> {
    let creatorId

    if (userInfo.rol === 'VIEWER') {
      return {
        success: false,
        message: `user: ${userInfo.nam} is under role <viewr> and cann't search for project`
      }
    } else if (userInfo.rol === 'PROJECT_MANAGER') { creatorId = userInfo.id }

    const result: Project | null = await this.prismaClient.project.findFirst({
      where: {
        AND: {
          id,
          creatorId
        }
      },
      include: {
        suspends: true,
        payments: true,
        media: true,
        company: true,
        engineer: true
      }
    })

    return result
  }

  public async create (userInfo: UserInfo, data: Object): Promise<OperationResult> {
    if (userInfo.rol === 'VIEWER') {
      return {
        success: false,
        message: `user: ${userInfo.nam} is under role <viewr> and cann't create project`
      }
    }

    const projectData = data as Project
    projectData.creatorId = userInfo.id

    const result = await this.prismaClient.project.create({
      data: data as Project
    })

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
    let creatorId

    if (userInfo.rol === 'VIEWER') {
      return {
        success: false,
        message: `user: ${userInfo.nam} is under role <viewr> and cann't update project`
      }
    } else if (userInfo.rol === 'PROJECT_MANAGER') { creatorId = userInfo.id }

    try {
      const result = await this.prismaClient.project.updateMany({
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
          message: 'project has been updated'
        }
      } else {
        return {
          success: false,
          message: `project ${id} not found or user: ${userInfo.nam} is cann't update the project, or no update will made`
        }
      }
    } catch (ex) {
      return {
        success: false,
        message: `unique constraint error for project: ${id} or internal error`
      }
    }
  }

  public async drop (userInfo: UserInfo, id: number): Promise<OperationResult> {
    let creatorId

    if (userInfo.rol === 'VIEWER') {
      return {
        success: false,
        message: `user: ${userInfo.nam} is under role <viewr> and cann't delete project`
      }
    } else if (userInfo.rol === 'PROJECT_MANAGER') { creatorId = userInfo.id }

    try {
      const result = await this.prismaClient.project.deleteMany({
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
          message: 'project has been delete'
        }
      } else {
        return {
          success: false,
          message: `project ${id} not found or user: ${userInfo.nam} is cann't delete the project`
        }
      }
    } catch (ex) {
      return {
        success: false,
        message: `project ${id} not found or internal error`
      }
    }
  }

  private addAvatarField (project: any): void {
    if (project.media !== undefined && project.media.length >= 0) {
      project.avatar = project.media[0].src
    }
  }
}
