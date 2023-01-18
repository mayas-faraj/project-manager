"use strict";
/*
import { ProjectViewer, PrismaClient } from '@prisma/client'
import { Prisma } from '../prismaClient'
import { Model, UserInfo, OperationResult } from '../types'
import { ControllerBase } from './controllerBase'

export default class ProjectViewerController extends ControllerBase {
  public constructor () {
    super()
    this.prismaClient = new Prisma().getPrismaClient()
  }

  public async read (userInfo: UserInfo, take?: number | undefined, skip?: number | undefined): Promise<Model[] | OperationResult> {
    let condition

    if (userInfo.rol === 'VIEWER') {
      return {
        success: false,
        message: `user: ${userInfo.nam} is under role <viewr> and cann't read users who can view project`
      }
    } else if (userInfo.rol === 'PROJECT_MANAGER') {
      condition = {
        creatorId: userInfo.id
      }
    }

    const result: ProjectViewer[] = await this.prismaClient.projectViewer.findMany({
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
        message: `user: ${userInfo.nam} is under role <viewr> and cann't search for projectViewer`
      }
    } else if (userInfo.rol === 'PROJECT_MANAGER') { creatorId = userInfo.id }

    const result: ProjectViewer | null = await this.prismaClient.projectViewer.findFirst({
      where: {
        AND: {
          id,
          creatorId
        }
      }
    })

    return result
  }

  public async create (userInfo: UserInfo, data: Object): Promise<OperationResult> {
    if (userInfo.rol === 'VIEWER') {
      return {
        success: false,
        message: `user: ${userInfo.nam} is under role <viewr> and cann't create projectViewer`
      }
    }

    const projectViewerData = data as ProjectViewer
    projectViewerData.creatorId = userInfo.id

    const result = await this.prismaClient.projectViewer.create({
      data: data as ProjectViewer
    })

    if (result !== undefined) {
      return {
        success: true,
        message: 'projectViewer has been created'
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
        message: `user: ${userInfo.nam} is under role <viewr> and cann't update projectViewer`
      }
    } else if (userInfo.rol === 'PROJECT_MANAGER') { creatorId = userInfo.id }

    try {
      const result = await this.prismaClient.projectViewer.updateMany({
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
          message: 'projectViewer has been updated'
        }
      } else {
        return {
          success: false,
          message: `projectViewer ${id} not found or user: ${userInfo.nam} is cann't update the projectViewer, or no update will made`
        }
      }
    } catch (ex) {
      return {
        success: false,
        message: `unique constraint error for projectViewer: ${id} or internal error`
      }
    }
  }

  public async drop (userInfo: UserInfo, id: number): Promise<OperationResult> {
    let creatorId

    if (userInfo.rol === 'VIEWER') {
      return {
        success: false,
        message: `user: ${userInfo.nam} is under role <viewr> and cann't delete projectViewer`
      }
    } else if (userInfo.rol === 'PROJECT_MANAGER') { creatorId = userInfo.id }

    try {
      const result = await this.prismaClient.projectViewer.deleteMany({
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
          message: 'projectViewer has been delete'
        }
      } else {
        return {
          success: false,
          message: `projectViewer ${id} not found or user: ${userInfo.nam} is cann't delete the projectViewer`
        }
      }
    } catch (ex) {
      return {
        success: false,
        message: `projectViewer ${id} not found or internal error`
      }
    }
  }

  private readonly prismaClient: PrismaClient
}
*/
