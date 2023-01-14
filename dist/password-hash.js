"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = exports.getPasswordHash = void 0;
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
// read salt
dotenv_1.default.config();
const salt = (_a = process.env.SALT) !== null && _a !== void 0 ? _a : '';
// password validation
const getPasswordHash = (password) => {
    return crypto_1.default.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
};
exports.getPasswordHash = getPasswordHash;
const validatePassword = (password, hash) => {
    const passwordhash = crypto_1.default.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return passwordhash === hash;
};
exports.validatePassword = validatePassword;
