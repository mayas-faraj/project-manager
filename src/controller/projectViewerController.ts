import { ProjectViewer } from '@prisma/client'
import { Model, UserInfo, OperationResult } from '../types'
import { ControllerBase } from './controllerBase'

export default class ProjectViewerController extends ControllerBase {
  public constructor () {
    super()
  }

  public async read (userInfo: UserInfo, take?: number | undefined, skip?: number | undefined): Promise<Model[] | OperationResult> {
    return {
      success: false,
      message: 'not implemented operation'
    }
  }

  public async find (userInfo: UserInfo, id: number): Promise<Model | OperationResult | null> {
    return {
      success: false,
      message: 'not implemented operation'
    }
  }

  public async create (userInfo: UserInfo, data: Object): Promise<OperationResult> {
    const viewerData = data as ProjectViewer

    if (userInfo.rol === 'PROJECT_MANAGER') {
      let hasProject
      try {
        hasProject = await this.prismaClient.project.findUnique({
          where: {
            id: viewerData.projectId
          }
        })
      } catch (ex: any) {
        return this.errorResult(ex)
      }

      if (hasProject === undefined) {
        return {
          success: false,
          message: `user ${userInfo.nam} is not the owner of project with id: ${viewerData.projectId}`
        }
      }
    } else if (userInfo.rol === 'VIEWER') {
      return {
        success: false,
        message: `user: ${userInfo.nam} is under role <viewr> and cann't create project viewer`
      }
    }

    try {
      const result = await this.prismaClient.projectViewer.create({
        data: viewerData
      })

      if (result !== undefined) {
        return {
          success: true,
          message: 'project viewer has been created'
        }
      } else {
        return {
          success: false,
          message: 'no data created'
        }
      }
    } catch (ex: any) {
      return this.errorResult(ex)
    }
  }

  public async update (userInfo: UserInfo, id: number, data: Object): Promise<OperationResult> {
    return {
      success: false,
      message: 'not implemented operation'
    }
  }

  public async drop (userInfo: UserInfo, id: number): Promise<OperationResult> {
    if (userInfo.rol === 'PROJECT_MANAGER') {
      let hasProject
      try {
        hasProject = await this.prismaClient.projectViewer.findMany({
          where: {
            AND: {
              id,
              project: {
                creatorId: userInfo.id
              }
            }
          }
        })
      } catch (ex: any) {
        return this.errorResult(ex)
      }

      if (hasProject === undefined) {
        return {
          success: false,
          message: `user ${userInfo.nam} is not the owner of project`
        }
      }
    } else if (userInfo.rol === 'VIEWER') {
      return {
        success: false,
        message: `user: ${userInfo.nam} is under role <viewr> and cann't create project viewer`
      }
    }

    try {
      const result = await this.prismaClient.projectViewer.delete({
        where: {
          id
        }
      })

      if (result !== undefined) {
        return {
          success: true,
          message: 'project viewer has been delete'
        }
      } else {
        return {
          success: false,
          message: 'no data created'
        }
      }
    } catch (ex: any) {
      return this.errorResult(ex)
    }
  }
}
