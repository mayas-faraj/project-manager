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
class CommentController extends controllerBase_1.ControllerBase {
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
                result = yield this.prismaClient.comment.findMany({
                    take,
                    skip,
                    where: condition,
                    select: {
                        id: true,
                        text: true,
                        createdAt: true,
                        project: {
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
    find(userInfo, id) {
        return __awaiter(this, void 0, void 0, function* () {
            // precondition: none
            return this.unsupportedResult();
        });
    }
    create(userInfo, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // precondition
            const missingFields = this.requiredResult(data, 'projectId', 'text');
            if (missingFields !== false)
                return missingFields;
            // checking privelege
            if (userInfo.rol === 'VIEWER')
                return this.noPrivelegeResult(userInfo.nam, userInfo.rol);
            const commentData = data;
            if (userInfo.rol === 'PROJECT_MANAGER') {
                try {
                    const result = yield this.prismaClient.project.findUnique({
                        where: {
                            id: commentData.projectId
                        },
                        select: {
                            creatorId: true
                        }
                    });
                    if ((result === null || result === void 0 ? void 0 : result.creatorId) !== userInfo.id)
                        return this.noPrivelegeResult(userInfo.nam, userInfo.rol);
                }
                catch (ex) {
                    return this.errorResult(ex);
                }
            }
            // critical operation
            commentData.creatorId = userInfo.id;
            let result;
            try {
                result = yield this.prismaClient.comment.create({
                    data: commentData
                });
            }
            catch (ex) {
                return this.errorResult(ex);
            }
            // post condition
            if (result !== undefined) {
                return {
                    success: true,
                    message: 'comment has been created'
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
            return this.unsupportedResult();
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
            if (userInfo.rol === 'PROJECT_MANAGER' || userInfo.rol === 'GOVERNOR') {
                condition.creatorId = userInfo.id;
            }
            // critical operatoin
            let result;
            try {
                result = yield this.prismaClient.comment.deleteMany({
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
                    message: 'comment has been delete'
                };
            }
            else {
                return {
                    success: false,
                    message: `comment ${id} not found or user: ${userInfo.nam} is cann't delete the comment`
                };
            }
        });
    }
}
exports.default = CommentController;
