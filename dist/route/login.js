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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = require("jsonwebtoken");
const password_hash_1 = require("../password-hash");
const userController_1 = __importDefault(require("../controller/userController"));
const dotenv_1 = __importDefault(require("dotenv"));
const prismaClient_1 = require("../prismaClient");
const router = (0, express_1.Router)();
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = { success: false, message: '', token: '', role: '' };
    const user = req.body.user;
    const password = req.body.password;
    if (user !== undefined && user.length === 0)
        result.message = 'user is empty';
    else if (password !== undefined && password.length === 0)
        result.message = 'password is empty';
    else {
        const userResult = yield new userController_1.default().findByName(user);
        if (userResult == null) {
            result.message = 'user not exists';
        }
        else {
            const userDb = userResult;
            if ((0, password_hash_1.validatePassword)(password, userDb.password)) {
                dotenv_1.default.config();
                const secret = (_a = process.env.SECRET) !== null && _a !== void 0 ? _a : '';
                result.message = 'login success';
                result.success = true;
                result.role = userDb.role;
                result.token = (0, jsonwebtoken_1.sign)({
                    id: userDb.id,
                    nam: userDb.name,
                    rol: userDb.role
                    // exp: (new Date().getTime() / 1000) + (60 * 60)
                }, secret);
                const prismaClient = new prismaClient_1.Prisma().getPrismaClient();
                yield prismaClient.user.update({
                    where: {
                        id: userDb.id
                    },
                    data: {
                        lastLoginAt: new Date()
                    }
                });
            }
            else {
                result.message = 'password is not valid';
            }
        }
    }
    res.json(result);
}));
exports.default = router;
