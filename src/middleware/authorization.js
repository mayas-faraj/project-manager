"use strict";
var _a;
exports.__esModule = true;
var dotenv_1 = require("dotenv");
var jsonwebtoken_1 = require("jsonwebtoken");
// read secret key
dotenv_1["default"].config();
var secret = (_a = process.env.SECRET) !== null && _a !== void 0 ? _a : '';
// middle ware function
function authorizationMiddleware(req, res, next) {
    var authorization = req.header('Authorization');
    if (authorization !== '' && authorization !== undefined) {
        var authorizationToken = authorization.split(' ')[1];
        try {
            var result = (0, jsonwebtoken_1.verify)(authorizationToken, secret);
            req.userInfo = result;
            next();
        }
        catch (ex) {
            res.json(ex);
        }
    }
}
exports["default"] = authorizationMiddleware;
