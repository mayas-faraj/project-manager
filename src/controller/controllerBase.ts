import { PrismaClient } from '@prisma/client'
import { Prisma } from '../prismaClient'
import { UserInfo, Model, OperationResult } from '../types'

export abstract class ControllerBase {
  constructor () {
    this.prismaClient = new Prisma().getPrismaClient()
  }

  public abstract read (userInfo: UserInfo, take?: number, skip?: number): Promise<Model[] | OperationResult>
  public abstract find (userInfo: UserInfo, id: number): Promise<Model | OperationResult | null>
  public abstract create (userInfo: UserInfo, data: Object): Promise<OperationResult>
  public abstract update (userInfo: UserInfo, id: number, data: Object): Promise<OperationResult>
  public abstract drop (userInfo: UserInfo, id: number): Promise<OperationResult>
  protected readonly prismaClient: PrismaClient
}
