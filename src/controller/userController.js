"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var password_hash_1 = require("../password-hash");
var controllerBase_1 = require("./controllerBase");
var UserController = /** @class */ (function (_super) {
    __extends(UserController, _super);
    function UserController() {
        return _super.call(this) || this;
    }
    UserController.prototype.read = function (userInfo, take, skip) {
        return __awaiter(this, void 0, void 0, function () {
            var result, ex_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // precondition: none
                        // chekking priveleges
                        if (userInfo.rol !== 'ADMIN')
                            return [2 /*return*/, this.noPrivelegeResult(userInfo.nam, userInfo.rol)
                                // critical operation
                            ];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.prismaClient.user.findMany({
                                take: take,
                                skip: skip,
                                select: {
                                    id: true,
                                    name: true,
                                    avatar: true,
                                    role: true,
                                    lastLoginAt: true
                                }
                            })];
                    case 2:
                        result = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        ex_1 = _a.sent();
                        return [2 /*return*/, this.errorResult(ex_1)];
                    case 4: return [2 /*return*/, result];
                }
            });
        });
    };
    UserController.prototype.find = function (userInfo, id) {
        return __awaiter(this, void 0, void 0, function () {
            var recordId, result, ex_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (userInfo.rol === 'ADMIN' || (id === 0))
                            recordId = id !== 0 ? id : userInfo.id;
                        else {
                            return [2 /*return*/, {
                                    success: false,
                                    message: "user: ".concat(userInfo.nam, " is not admin and not the same user to fetch")
                                }];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.prismaClient.user.findFirst({
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
                            })];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 3:
                        ex_2 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                message: "server site error for user while finding user: ".concat(id)
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.create = function (userInfo, data) {
        return __awaiter(this, void 0, void 0, function () {
            var missingFields, userData, result, ex_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        missingFields = this.requiredResult(data, 'name', 'password', 'role');
                        if (missingFields !== false)
                            return [2 /*return*/, missingFields
                                // checking privelege
                            ];
                        // checking privelege
                        if (userInfo.rol !== 'ADMIN')
                            return [2 /*return*/, this.noPrivelegeResult(userInfo.nam, userInfo.rol)
                                // critical operations
                            ];
                        userData = data;
                        if (userData.password !== undefined)
                            userData.password = (0, password_hash_1.getPasswordHash)(userData.password);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.prismaClient.user.create({
                                data: userData
                            })];
                    case 2:
                        result = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        ex_3 = _a.sent();
                        return [2 /*return*/, this.errorResult(ex_3)];
                    case 4:
                        // post condition
                        if (result !== undefined) {
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'user has been created'
                                }];
                        }
                        else {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'no entity created'
                                }];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.update = function (userInfo, id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var userData, condition, result, ex_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // precondition: none
                        // checking privelege
                        if (userInfo.rol !== 'ADMIN' && id !== 0) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: "user: ".concat(userInfo.nam, " is not admin and not the same user to update")
                                }];
                        }
                        userData = data;
                        if (userData.password !== undefined)
                            userData.password = (0, password_hash_1.getPasswordHash)(userData.password);
                        condition = { id: id !== 0 ? id : userInfo.id };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.prismaClient.user.update({
                                where: condition,
                                data: data
                            })];
                    case 2:
                        result = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        ex_4 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                message: "unique constraint error for user: ".concat(id, " or internal error")
                            }];
                    case 4:
                        // post condition
                        if (result !== undefined) {
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'user has been updated'
                                }];
                        }
                        else {
                            return [2 /*return*/, {
                                    success: false,
                                    message: "user ".concat(id, " not found or user: ").concat(userInfo.nam, " is cann't update the user, or no update will made")
                                }];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.drop = function (userInfo, id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, ex_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // precondition: none
                        //  checking priveleges
                        if (userInfo.rol !== 'ADMIN')
                            return [2 /*return*/, this.noPrivelegeResult(userInfo.nam, userInfo.rol)
                                // critical operatoin
                            ];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.prismaClient.user["delete"]({
                                where: {
                                    id: id
                                }
                            })];
                    case 2:
                        result = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        ex_5 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                message: "user ".concat(id, " not found or internal error")
                            }];
                    case 4:
                        // post condition
                        if (result !== undefined) {
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'user has been delete'
                                }];
                        }
                        else {
                            return [2 /*return*/, {
                                    success: false,
                                    message: "user ".concat(id, " not found or user: ").concat(userInfo.nam, " is cann't delete the user")
                                }];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.findByName = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var result, ex_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.prismaClient.user.findUnique({
                                where: {
                                    name: name
                                }
                            })];
                    case 1:
                        result = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        ex_6 = _a.sent();
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/, result !== null && result !== void 0 ? result : null];
                }
            });
        });
    };
    return UserController;
}(controllerBase_1.ControllerBase));
exports["default"] = UserController;
