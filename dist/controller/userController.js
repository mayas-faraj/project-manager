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
            // precondition: none
            // chekking priveleges
            if (userInfo.rol !== 'ADMIN')
                return this.noPrivelegeResult(userInfo.nam, userInfo.rol);
            // critical operation
            let result;
            try {
                result = yield this.prismaClient.user.findMany({
                    take,
                    skip,
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                        role: true,
                        lastLoginAt: true
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
            let recordId;
            if (userInfo.rol === 'ADMIN' || (id === 0))
                recordId = id !== 0 ? id : userInfo.id;
            else {
                return {
                    success: false,
                    message: `user: ${userInfo.nam} is not admin and not the same user to fetch`
                };
            }
            // critical operation
            try {
                const result = yield this.prismaClient.user.findFirst({
                    where: {
                        id: recordId
                    },
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                        lastLoginAt: true,
                        role: true,
                        createdAt: true,
                        createdProjects: {
                            select: {
                                name: true,
                                avatar: true
                            }
                        }
                    }
                });
                return result;
            }
            catch (ex) {
                return {
                    success: false,
                    message: `server site error for user while finding user: ${id}`
                };
            }
        });
    }
    create(userInfo, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // precondition
            const missingFields = this.requiredResult(data, 'name', 'password', 'role');
            if (missingFields !== false)
                return missingFields;
            // checking privelege
            if (userInfo.rol !== 'ADMIN')
                return this.noPrivelegeResult(userInfo.nam, userInfo.rol);
            // critical operations
            const userData = data;
            if (userData.password !== undefined)
                userData.password = (0, password_hash_1.getPasswordHash)(userData.password);
            let result;
            try {
                result = yield this.prismaClient.user.create({
                    data: userData
                });
            }
            catch (ex) {
                return this.errorResult(ex);
            }
            // post condition
            if (result !== undefined) {
                return {
                    success: true,
                    message: 'user has been created'
                };
            }
            else {
                return {
                    success: false,
                    message: 'no entity created'
                };
            }
        });
    }
    update(userInfo, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // precondition: none
            // checking privelege
            if (userInfo.rol !== 'ADMIN' && id !== 0) {
                return {
                    success: false,
                    message: `user: ${userInfo.nam} is not admin and not the same user to update`
                };
            }
            // critical operatoin
            const userData = data;
            if (userData.password !== undefined)
                userData.password = (0, password_hash_1.getPasswordHash)(userData.password);
            const condition = { id: id !== 0 ? id : userInfo.id };
            let result;
            try {
                result = yield this.prismaClient.user.update({
                    where: condition,
                    data
                });
            }
            catch (ex) {
                return {
                    success: false,
                    message: `unique constraint error for user: ${id} or internal error`
                };
            }
            // post condition
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
        });
    }
    drop(userInfo, id) {
        return __awaiter(this, void 0, void 0, function* () {
            // precondition: none
            //  checking priveleges
            if (userInfo.rol !== 'ADMIN')
                return this.noPrivelegeResult(userInfo.nam, userInfo.rol);
            // critical operatoin
            let result;
            try {
                result = yield this.prismaClient.user.delete({
                    where: {
                        id
                    }
                });
            }
            catch (ex) {
                return {
                    success: false,
                    message: `user ${id} not found or internal error`
                };
            }
            // post condition
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
        });
    }
    findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            // precondition: none
            // critical operation
            let result;
            try {
                result = yield this.prismaClient.user.findUnique({
                    where: {
                        name
                    }
                });
            }
            catch (ex) {
                return null;
            }
            return result !== null && result !== void 0 ? result : null;
        });
    }
}
exports.default = UserController;
