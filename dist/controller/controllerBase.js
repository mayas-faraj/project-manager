"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControllerBase = void 0;
const prismaClient_1 = require("../prismaClient");
class ControllerBase {
    constructor() {
        this.prismaClient = new prismaClient_1.Prisma().getPrismaClient();
    }
    errorResult(ex) {
        return {
            success: false,
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            message: `server error, details: ${ex.message}`
        };
    }
}
exports.ControllerBase = ControllerBase;
