"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = require("jsonwebtoken");
// read secret key
dotenv_1.default.config();
const secret = (_a = process.env.SECRET) !== null && _a !== void 0 ? _a : '';
// middle ware function
function authorizationMiddleware(req, res, next) {
    const authorization = req.header('Authorization');
    if (authorization !== '' && authorization !== undefined) {
        const authorizationToken = authorization.split(' ')[1];
        try {
            const result = (0, jsonwebtoken_1.verify)(authorizationToken, secret);
            req.userInfo = result;
            next();
        }
        catch (ex) {
            res.json(ex);
        }
    }
}
exports.default = authorizationMiddleware;
