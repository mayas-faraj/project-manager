"use strict";
var _a;
exports.__esModule = true;
exports.validatePassword = exports.getPasswordHash = void 0;
var crypto_1 = require("crypto");
var dotenv_1 = require("dotenv");
// read salt
dotenv_1["default"].config();
var salt = (_a = process.env.SALT) !== null && _a !== void 0 ? _a : '';
// password validation
var getPasswordHash = function (password) {
    return crypto_1["default"].pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
};
exports.getPasswordHash = getPasswordHash;
var validatePassword = function (password, hash) {
    var passwordhash = crypto_1["default"].pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return passwordhash === hash;
};
exports.validatePassword = validatePassword;
