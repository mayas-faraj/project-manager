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
var controllerBase_1 = require("./controllerBase");
var ProjectController = /** @class */ (function (_super) {
    __extends(ProjectController, _super);
    function ProjectController() {
        return _super.call(this) || this;
    }
    ProjectController.prototype.read = function (userInfo, take, skip) {
        return __awaiter(this, void 0, void 0, function () {
            var condition, result, ex_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (userInfo.rol === 'PROJECT_MANAGER') {
                            condition = {
                                creatorId: userInfo.id
                            };
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.prismaClient.project.findMany({
                                take: take,
                                skip: skip,
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
    ProjectController.prototype.find = function (userInfo, id) {
        return __awaiter(this, void 0, void 0, function () {
            var condition, result, ex_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        condition = {
                            id: id,
                            creatorId: undefined
                        };
                        if (userInfo.rol === 'PROJECT_MANAGER') {
                            condition.creatorId = userInfo.id;
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.prismaClient.project.findFirst({
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
                            })];
                    case 2:
                        result = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        ex_2 = _a.sent();
                        return [2 /*return*/, this.errorResult(ex_2)];
                    case 4: return [2 /*return*/, result];
                }
            });
        });
    };
    ProjectController.prototype.create = function (userInfo, data) {
        return __awaiter(this, void 0, void 0, function () {
            var missingFields, projectData, result, ex_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        missingFields = this.requiredResult(data, 'name', 'cost', 'amountPaid', 'duration');
                        if (missingFields !== false)
                            return [2 /*return*/, missingFields
                                // checking privelege
                            ];
                        // checking privelege
                        if (userInfo.rol === 'VIEWER')
                            return [2 /*return*/, this.noPrivelegeResult(userInfo.nam, userInfo.rol)
                                // critical operation
                            ];
                        projectData = data;
                        projectData.creatorId = userInfo.id;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.prismaClient.project.create({
                                data: data
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
                                    message: 'project has been created'
                                }];
                        }
                        else {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'no data created'
                                }];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ProjectController.prototype.update = function (userInfo, id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var condition, result, ex_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // precondition: none
                        // checking privelege
                        if (userInfo.rol === 'VIEWER')
                            return [2 /*return*/, this.noPrivelegeResult(userInfo.nam, userInfo.rol)];
                        condition = {
                            id: id,
                            creatorId: undefined
                        };
                        if (userInfo.rol === 'PROJECT_MANAGER') {
                            condition.creatorId = userInfo.id;
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.prismaClient.project.updateMany({
                                where: {
                                    AND: condition
                                },
                                data: data
                            })];
                    case 2:
                        result = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        ex_4 = _a.sent();
                        return [2 /*return*/, this.errorResult(ex_4)];
                    case 4:
                        // post condition
                        if (result.count > 0) {
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'project has been updated'
                                }];
                        }
                        else {
                            return [2 /*return*/, {
                                    success: false,
                                    message: "project ".concat(id, " not found or user: ").concat(userInfo.nam, " is cann't update the project, or no update will made")
                                }];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ProjectController.prototype.drop = function (userInfo, id) {
        return __awaiter(this, void 0, void 0, function () {
            var condition, result, ex_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // precondition: none
                        // checking privelege
                        if (userInfo.rol === 'VIEWER')
                            return [2 /*return*/, this.noPrivelegeResult(userInfo.nam, userInfo.rol)];
                        condition = {
                            id: id,
                            creatorId: undefined
                        };
                        if (userInfo.rol === 'PROJECT_MANAGER') {
                            condition.creatorId = userInfo.id;
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.prismaClient.project.deleteMany({
                                where: {
                                    AND: condition
                                }
                            })];
                    case 2:
                        result = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        ex_5 = _a.sent();
                        return [2 /*return*/, this.errorResult(ex_5)];
                    case 4:
                        // post condition
                        if (result.count > 0) {
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'project has been delete'
                                }];
                        }
                        else {
                            return [2 /*return*/, {
                                    success: false,
                                    message: "project ".concat(id, " not found or user: ").concat(userInfo.nam, " is cann't delete the project")
                                }];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return ProjectController;
}(controllerBase_1.ControllerBase));
exports["default"] = ProjectController;
