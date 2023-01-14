"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prisma = void 0;
const client_1 = require("@prisma/client");
class Prisma {
    constructor() {
        if (Prisma.client == null) {
            Prisma.client = new client_1.PrismaClient();
        }
    }
    getPrismaClient() {
        return Prisma.client;
    }
}
exports.Prisma = Prisma;
