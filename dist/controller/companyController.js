"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const prismaClient_1 = require("../prismaClient");
const controllerBase_1 = require("./controllerBase");
class CompanyController extends controllerBase_1.ControllerBase {
    constructor() {
        super();
        this.prismaClient = new prismaClient_1.Prisma().getPrismaClient();
    }
    read(userInfo, take, skip) {
        return __awaiter(this, void 0, void 0, function* () {
            let condition;
            if (userInfo.rol === 'VIEWER') {
                return {
                    success: false,
                    message: `user: ${userInfo.nam} is under role <viewr> and cann't read companies`
                };
            }
            else if (userInfo.rol === 'PROJECT_MANAGER') {
                condition = {
                    creatorId: userInfo.id
                };
            }
            const result = yield this.prismaClient.company.findMany({
                take,
                skip,
                where: condition
            });
            return result;
        });
    }
    find(userInfo, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let creatorId;
            if (userInfo.rol === 'VIEWER') {
                return {
                    success: false,
                    message: `user: ${userInfo.nam} is under role <viewr> and cann't search for company`
                };
            }
            else if (userInfo.rol === 'PROJECT_MANAGER') {
                creatorId = userInfo.id;
            }
            const result = yield this.prismaClient.company.findFirst({
                where: {
                    AND: {
                        id,
                        creatorId
                    }
                },
                include: {
                    projects: true
                }
            });
            return result;
        });
    }
    create(userInfo, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userInfo.rol === 'VIEWER') {
                return {
                    success: false,
                    message: `user: ${userInfo.nam} is under role <viewr> and cann't create company`
                };
            }
            const companyData = data;
            companyData.creatorId = userInfo.id;
            const result = yield this.prismaClient.company.create({
                data: data
            });
            if (result !== undefined) {
                return {
                    success: true,
                    message: 'company has been created'
                };
            }
            else {
                return {
                    success: false,
                    message: 'no data created'
                };
            }
        });
    }
    update(userInfo, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let creatorId;
            if (userInfo.rol === 'VIEWER') {
                return {
                    success: false,
                    message: `user: ${userInfo.nam} is under role <viewr> and cann't update company`
                };
            }
            else if (userInfo.rol === 'PROJECT_MANAGER') {
                creatorId = userInfo.id;
            }
            try {
                const result = yield this.prismaClient.company.updateMany({
                    where: {
                        AND: {
                            id,
                            creatorId
                        }
                    },
                    data
                });
                if (result.count > 0) {
                    return {
                        success: true,
                        message: 'company has been updated'
                    };
                }
                else {
                    return {
                        success: false,
                        message: `company ${id} not found or user: ${userInfo.nam} is cann't update the company, or no update will made`
                    };
                }
            }
            catch (ex) {
                return {
                    success: false,
                    message: `unique constraint error for company: ${id} or internal error`
                };
            }
        });
    }
    drop(userInfo, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let creatorId;
            if (userInfo.rol === 'VIEWER') {
                return {
                    success: false,
                    message: `user: ${userInfo.nam} is under role <viewr> and cann't delete company`
                };
            }
            else if (userInfo.rol === 'PROJECT_MANAGER') {
                creatorId = userInfo.id;
            }
            try {
                const result = yield this.prismaClient.company.deleteMany({
                    where: {
                        AND: {
                            id,
                            creatorId
                        }
                    }
                });
                if (result.count > 0) {
                    return {
                        success: true,
                        message: 'company has been delete'
                    };
                }
                else {
                    return {
                        success: false,
                        message: `company ${id} not found or user: ${userInfo.nam} is cann't delete the company`
                    };
                }
            }
            catch (ex) {
                return {
                    success: false,
                    message: `company ${id} not found or internal error`
                };
            }
        });
    }
}
exports.default = CompanyController;
