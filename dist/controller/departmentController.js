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
const controllerBase_1 = require("./controllerBase");
class DepartmentController extends controllerBase_1.ControllerBase {
    constructor() {
        super();
    }
    read(userInfo, take, skip) {
        return __awaiter(this, void 0, void 0, function* () {
            let condition;
            if (userInfo.rol === 'VIEWER') {
                return {
                    success: false,
                    message: `user: ${userInfo.nam} is under role <viewr> and cann't read departments`
                };
            }
            else if (userInfo.rol === 'PROJECT_MANAGER') {
                condition = {
                    creatorId: userInfo.id
                };
            }
            const result = yield this.prismaClient.department.findMany({
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
                    message: `user: ${userInfo.nam} is under role <viewr> and cann't search for department`
                };
            }
            else if (userInfo.rol === 'PROJECT_MANAGER') {
                creatorId = userInfo.id;
            }
            const result = yield this.prismaClient.department.findFirst({
                where: {
                    AND: {
                        id,
                        creatorId
                    }
                },
                include: {
                    engineers: true
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
                    message: `user: ${userInfo.nam} is under role <viewr> and cann't create department`
                };
            }
            const departmentData = data;
            departmentData.creatorId = userInfo.id;
            const result = yield this.prismaClient.department.create({
                data: data
            });
            if (result !== undefined) {
                return {
                    success: true,
                    message: 'department has been created'
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
                    message: `user: ${userInfo.nam} is under role <viewr> and cann't update department`
                };
            }
            else if (userInfo.rol === 'PROJECT_MANAGER') {
                creatorId = userInfo.id;
            }
            try {
                const result = yield this.prismaClient.department.updateMany({
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
                        message: 'department has been updated'
                    };
                }
                else {
                    return {
                        success: false,
                        message: `department ${id} not found or user: ${userInfo.nam} is cann't update the department, or no update will made`
                    };
                }
            }
            catch (ex) {
                return {
                    success: false,
                    message: `unique constraint error for department: ${id} or internal error`
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
                    message: `user: ${userInfo.nam} is under role <viewr> and cann't delete department`
                };
            }
            else if (userInfo.rol === 'PROJECT_MANAGER') {
                creatorId = userInfo.id;
            }
            try {
                const result = yield this.prismaClient.department.deleteMany({
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
                        message: 'department has been delete'
                    };
                }
                else {
                    return {
                        success: false,
                        message: `department ${id} not found or user: ${userInfo.nam} is cann't delete the department`
                    };
                }
            }
            catch (ex) {
                return {
                    success: false,
                    message: `department ${id} not found or internal error`
                };
            }
        });
    }
}
exports.default = DepartmentController;
