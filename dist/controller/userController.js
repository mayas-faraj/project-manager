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
const password_hash_1 = require("../password-hash");
const controllerBase_1 = require("./controllerBase");
class UserController extends controllerBase_1.ControllerBase {
    constructor() {
        super();
    }
    read(userInfo, take, skip) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userInfo.rol !== 'ADMIN') {
                return {
                    success: false,
                    message: `user: ${userInfo.nam} is under role <viewr> or <project-manager> and cann't read users`
                };
            }
            const result = yield this.prismaClient.user.findMany({
                take,
                skip
            });
            return result;
        });
    }
    find(userInfo, id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userInfo.rol === 'ADMIN' || (id === 0)) {
                try {
                    const condition = { id: id !== 0 ? id : userInfo.id };
                    const result = yield this.prismaClient.user.findFirst({
                        where: condition
                    });
                    return result;
                }
                catch (ex) {
                    return {
                        success: false,
                        message: `server site error for user while finding user: ${id} `
                    };
                }
            }
            else {
                return {
                    success: false,
                    message: `user: ${userInfo.nam} is not admin and not the same user to fetch`
                };
            }
        });
    }
    create(userInfo, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userInfo.rol !== 'ADMIN') {
                return {
                    success: false,
                    message: `user: ${userInfo.nam} is under role <viewr> or <project-manager> and cann't create user`
                };
            }
            const userData = data;
            if (userData.password !== undefined)
                userData.password = (0, password_hash_1.getPasswordHash)(userData.password);
            const result = yield this.prismaClient.user.create({
                data: userData
            });
            if (result !== undefined) {
                return {
                    success: true,
                    message: 'user has been created'
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
            if (userInfo.rol === 'ADMIN' || (id === 0)) {
                try {
                    const condition = { id: id !== 0 ? id : userInfo.id };
                    const userData = data;
                    if (userData.password !== undefined)
                        userData.password = (0, password_hash_1.getPasswordHash)(userData.password);
                    const result = yield this.prismaClient.user.update({
                        where: condition,
                        data
                    });
                    if (result !== undefined) {
                        return {
                            success: true,
                            message: 'user has been updated'
                        };
                    }
                    else {
                        return {
                            success: false,
                            message: `user ${id} not found or user: ${userInfo.nam} is cann't update the user, or no update will made`
                        };
                    }
                }
                catch (ex) {
                    return {
                        success: false,
                        message: `unique constraint error for user: ${id} or internal error`
                    };
                }
            }
            else {
                return {
                    success: false,
                    message: `user: ${userInfo.nam} is not admin and not the same user to update`
                };
            }
        });
    }
    drop(userInfo, id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userInfo.rol !== 'ADMIN') {
                return {
                    success: false,
                    message: `user: ${userInfo.nam} is under role <viewr> or <project-manager> and cann't delete user`
                };
            }
            try {
                const result = yield this.prismaClient.user.delete({
                    where: {
                        id
                    }
                });
                if (result !== undefined) {
                    return {
                        success: true,
                        message: 'user has been delete'
                    };
                }
                else {
                    return {
                        success: false,
                        message: `user ${id} not found or user: ${userInfo.nam} is cann't delete the user`
                    };
                }
            }
            catch (ex) {
                return {
                    success: false,
                    message: `user ${id} not found or internal error`
                };
            }
        });
    }
    findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.prismaClient.user.findUnique({
                where: {
                    name
                }
            });
            return result !== null && result !== void 0 ? result : null;
        });
    }
}
exports.default = UserController;
