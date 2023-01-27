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
class ProjectController extends controllerBase_1.ControllerBase {
    constructor() {
        super();
    }
    read(userInfo, take, skip) {
        return __awaiter(this, void 0, void 0, function* () {
            // precondition: none
            // checking privileges
            let condition;
            if (userInfo.rol === 'PROJECT_MANAGER') {
                condition = {
                    creatorId: userInfo.id
                };
            }
            // critical operation
            let result;
            try {
                result = yield this.prismaClient.project.findMany({
                    take,
                    skip,
                    where: condition,
                    select: {
                        id: true,
                        name: true,
                        remark: true,
                        avatar: true,
                        status: true,
                        amountPaid: true,
                        companyName: true,
                        engineerName: true,
                        engineerPhone: true,
                        engineerDepartment: true,
                        cost: true,
                        duration: true,
                        longitude: true,
                        latitude: true,
                        createdAt: true,
                        creator: {
                            select: {
                                name: true,
                                avatar: true
                            }
                        },
                        media: {
                            select: {
                                src: true,
                                title: true,
                                orderIndex: true
                            },
                            orderBy: {
                                orderIndex: 'asc'
                            }
                        },
                        extensions: {
                            select: {
                                byDuration: true,
                                description: true,
                                documentUrl: true
                            }
                        },
                        payments: {
                            select: {
                                amount: true,
                                description: true,
                                paidAt: true
                            }
                        },
                        suspends: {
                            select: {
                                description: true,
                                documentUrl: true,
                                fromDate: true,
                                toDate: true
                            }
                        }
                    }
                });
            }
            catch (ex) {
                return this.errorResult(ex);
            }
            return result;
        });
    }
    find(userInfo, id) {
        return __awaiter(this, void 0, void 0, function* () {
            // precondition: none
            // checking priveleges
            const condition = {
                id,
                creatorId: undefined
            };
            if (userInfo.rol === 'PROJECT_MANAGER') {
                condition.creatorId = userInfo.id;
            }
            // critical operation
            let result;
            try {
                result = yield this.prismaClient.project.findFirst({
                    where: {
                        AND: condition
                    },
                    select: {
                        id: true,
                        name: true,
                        remark: true,
                        longitude: true,
                        latitude: true,
                        companyName: true,
                        engineerName: true,
                        engineerPhone: true,
                        engineerDepartment: true,
                        avatar: true,
                        duration: true,
                        cost: true,
                        amountPaid: true,
                        status: true,
                        suspends: {
                            select: {
                                id: true,
                                fromDate: true,
                                toDate: true,
                                description: true,
                                documentUrl: true
                            }
                        },
                        extensions: {
                            select: {
                                id: true,
                                byDuration: true,
                                description: true,
                                documentUrl: true
                            }
                        },
                        payments: {
                            select: {
                                id: true,
                                amount: true,
                                paidAt: true,
                                description: true
                            }
                        },
                        media: {
                            select: {
                                id: true,
                                src: true,
                                title: true
                            },
                            orderBy: {
                                orderIndex: 'asc'
                            }
                        },
                        creator: {
                            select: {
                                id: true,
                                name: true,
                                avatar: true
                            }
                        }
                    }
                });
            }
            catch (ex) {
                return this.errorResult(ex);
            }
            return result;
        });
    }
    create(userInfo, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // precondition
            const missingFields = this.requiredResult(data, 'name', 'cost', 'amountPaid', 'duration');
            if (missingFields !== false)
                return missingFields;
            // checking privelege
            if (userInfo.rol === 'VIEWER')
                return this.noPrivelegeResult(userInfo.nam, userInfo.rol);
            // critical operation
            const projectData = data;
            projectData.creatorId = userInfo.id;
            let result;
            try {
                result = yield this.prismaClient.project.create({
                    data: data
                });
            }
            catch (ex) {
                return this.errorResult(ex);
            }
            // post condition
            if (result !== undefined) {
                return {
                    success: true,
                    message: 'project has been created'
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
            // precondition: none
            // checking privelege
            if (userInfo.rol === 'VIEWER')
                return this.noPrivelegeResult(userInfo.nam, userInfo.rol);
            const condition = {
                id,
                creatorId: undefined
            };
            if (userInfo.rol === 'PROJECT_MANAGER') {
                condition.creatorId = userInfo.id;
            }
            // critical operatoin
            let result;
            try {
                result = yield this.prismaClient.project.updateMany({
                    where: {
                        AND: condition
                    },
                    data
                });
            }
            catch (ex) {
                return this.errorResult(ex);
            }
            // post condition
            if (result.count > 0) {
                return {
                    success: true,
                    message: 'project has been updated'
                };
            }
            else {
                return {
                    success: false,
                    message: `project ${id} not found or user: ${userInfo.nam} is cann't update the project, or no update will made`
                };
            }
        });
    }
    drop(userInfo, id) {
        return __awaiter(this, void 0, void 0, function* () {
            // precondition: none
            // checking privelege
            if (userInfo.rol === 'VIEWER')
                return this.noPrivelegeResult(userInfo.nam, userInfo.rol);
            const condition = {
                id,
                creatorId: undefined
            };
            if (userInfo.rol === 'PROJECT_MANAGER') {
                condition.creatorId = userInfo.id;
            }
            // critical operatoin
            let result;
            try {
                result = yield this.prismaClient.project.deleteMany({
                    where: {
                        AND: condition
                    }
                });
            }
            catch (ex) {
                return this.errorResult(ex);
            }
            // post condition
            if (result.count > 0) {
                return {
                    success: true,
                    message: 'project has been delete'
                };
            }
            else {
                return {
                    success: false,
                    message: `project ${id} not found or user: ${userInfo.nam} is cann't delete the project`
                };
            }
        });
    }
}
exports.default = ProjectController;
