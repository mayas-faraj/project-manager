import { PrismaClient } from '@prisma/client'

class Prisma {
  constructor () {
    if (Prisma.client == null) { Prisma.client = new PrismaClient() }
  }

  getPrismaClient (): PrismaClient {
    return Prisma.client
  }

  private static client: PrismaClient
}

export { Prisma }
