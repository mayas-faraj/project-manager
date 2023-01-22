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
class ProjectViewerController extends controllerBase_1.ControllerBase {
    constructor() {
        super();
    }
    read(userInfo, take, skip) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                success: false,
                message: 'not implemented operation'
            };
        });
    }
    find(userInfo, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                success: false,
                message: 'not implemented operation'
            };
        });
    }
    create(userInfo, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const viewerData = data;
            if (userInfo.rol === 'PROJECT_MANAGER') {
                const hasProject = yield this.prismaClient.project.findUnique({
                    where: {
                        id: viewerData.projectId
                    }
                });
                if (hasProject === undefined) {
                    return {
                        success: false,
                        message: `user ${userInfo.nam} is not the owner of project with id: ${viewerData.projectId}`
                    };
                }
            }
            else if (userInfo.rol === 'VIEWER') {
                return {
                    success: false,
                    message: `user: ${userInfo.nam} is under role <viewr> and cann't create project viewer`
                };
            }
            const result = yield this.prismaClient.projectViewer.create({
                data: viewerData
            });
            if (result !== undefined) {
                return {
                    success: true,
                    message: 'project viewer has been created'
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
            return {
                success: false,
                message: 'not implemented operation'
            };
        });
    }
    drop(userInfo, id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userInfo.rol === 'PROJECT_MANAGER') {
                const hasProject = yield this.prismaClient.projectViewer.findMany({
                    where: {
                        AND: {
                            id,
                            project: {
                                creatorId: userInfo.id
                            }
                        }
                    }
                });
                if (hasProject === undefined) {
                    return {
                        success: false,
                        message: `user ${userInfo.nam} is not the owner of project`
                    };
                }
            }
            else if (userInfo.rol === 'VIEWER') {
                return {
                    success: false,
                    message: `user: ${userInfo.nam} is under role <viewr> and cann't create project viewer`
                };
            }
            const result = yield this.prismaClient.projectViewer.delete({
                where: {
                    id
                }
            });
            if (result !== undefined) {
                return {
                    success: true,
                    message: 'project viewer has been delete'
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
}
exports.default = ProjectViewerController;
