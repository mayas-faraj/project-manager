"use strict";
exports.__esModule = true;
exports.ControllerBase = void 0;
var prismaClient_1 = require("../prismaClient");
var ControllerBase = /** @class */ (function () {
    function ControllerBase() {
        this.prismaClient = new prismaClient_1.Prisma().getPrismaClient();
    }
    ControllerBase.prototype.errorResult = function (ex) {
        return {
            success: false,
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            message: "server error, details: ".concat(ex.message)
        };
    };
    ControllerBase.prototype.noPrivelegeResult = function (userName, role) {
        return {
            success: false,
            message: "user: ".concat(userName, " is under role <").concat(role, "> and cann't perform operation")
        };
    };
    ControllerBase.prototype.requiredResult = function (object) {
        // precondition: none
        var fields = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            fields[_i - 1] = arguments[_i];
        }
        // checking fields
        var missingFields = [];
        for (var i = 0; i < fields.length; i++) {
            if (object[fields[i]] == null || object[fields[i]] === '') {
                missingFields.push(fields[i]);
            }
        }
        // post condition
        if (missingFields.length === 0)
            return false;
        else {
            var message = '';
            if (missingFields.length === 1) {
                message = "".concat(missingFields[0], " is required for this opeation");
            }
            else {
                message = "".concat(missingFields.join(', '), " are required for this operation");
            }
            return {
                success: false,
                message: message
            };
        }
    };
    return ControllerBase;
}());
exports.ControllerBase = ControllerBase;
