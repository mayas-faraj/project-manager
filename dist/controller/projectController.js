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
            let condition;
            if (userInfo.rol === 'VIEWER') {
                return {
                    success: false,
                    message: `user: ${userInfo.nam} is under role <viewr> and cann't read projects`
                };
            }
            else if (userInfo.rol === 'PROJECT_MANAGER') {
                condition = {
                    creatorId: userInfo.id
                };
            }
            const result = yield this.prismaClient.project.findMany({
                take,
                skip,
                where: condition,
                include: {
                    media: {
                        orderBy: {
                            orderIndex: 'asc'
                        }
                    }
                }
            });
            result.forEach(project => {
                this.addAvatarField(project);
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
                    message: `user: ${userInfo.nam} is under role <viewr> and cann't search for project`
                };
            }
            else if (userInfo.rol === 'PROJECT_MANAGER') {
                creatorId = userInfo.id;
            }
            const result = yield this.prismaClient.project.findFirst({
                where: {
                    AND: {
                        id,
                        creatorId
                    }
                },
                include: {
                    suspends: true,
                    payments: true,
                    media: true,
                    company: true,
                    engineer: true
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
                    message: `user: ${userInfo.nam} is under role <viewr> and cann't create project`
                };
            }
            const projectData = data;
            projectData.creatorId = userInfo.id;
            const result = yield this.prismaClient.project.create({
                data: data
            });
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
            let creatorId;
            if (userInfo.rol === 'VIEWER') {
                return {
                    success: false,
                    message: `user: ${userInfo.nam} is under role <viewr> and cann't update project`
                };
            }
            else if (userInfo.rol === 'PROJECT_MANAGER') {
                creatorId = userInfo.id;
            }
            try {
                const result = yield this.prismaClient.project.updateMany({
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
                        message: 'project has been updated'
                    };
                }
                else {
                    return {
                        success: false,
                        message: `project ${id} not found or user: ${userInfo.nam} is cann't update the project, or no update will made`
                    };
                }
            }
            catch (ex) {
                return {
                    success: false,
                    message: `unique constraint error for project: ${id} or internal error`
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
                    message: `user: ${userInfo.nam} is under role <viewr> and cann't delete project`
                };
            }
            else if (userInfo.rol === 'PROJECT_MANAGER') {
                creatorId = userInfo.id;
            }
            try {
                const result = yield this.prismaClient.project.deleteMany({
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
                        message: 'project has been delete'
                    };
                }
                else {
                    return {
                        success: false,
                        message: `project ${id} not found or user: ${userInfo.nam} is cann't delete the project`
                    };
                }
            }
            catch (ex) {
                return {
                    success: false,
                    message: `project ${id} not found or internal error`
                };
            }
        });
    }
    addAvatarField(project) {
        if (project.media !== undefined && project.media.length >= 0) {
            project.avatar = project.media[0].src;
        }
    }
}
exports.default = ProjectController;
