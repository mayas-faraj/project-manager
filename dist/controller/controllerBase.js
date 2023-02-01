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
    noPrivelegeResult(userName, role) {
        return {
            success: false,
            message: `user: ${userName} is under role <${role}> and cann't perform operation`
        };
    }
    unsupportedResult() {
        return {
            success: false,
            message: 'unsupported operation'
        };
    }
    requiredResult(object, ...fields) {
        // precondition: none
        // checking fields
        const missingFields = [];
        for (let i = 0; i < fields.length; i++) {
            if (object[fields[i]] == null || object[fields[i]] === '') {
                missingFields.push(fields[i]);
            }
        }
        // post condition
        if (missingFields.length === 0)
            return false;
        else {
            let message = '';
            if (missingFields.length === 1) {
                message = `${missingFields[0]} is required for this opeation`;
            }
            else {
                message = `${missingFields.join(', ')} are required for this operation`;
            }
            return {
                success: false,
                message
            };
        }
    }
}
exports.ControllerBase = ControllerBase;
