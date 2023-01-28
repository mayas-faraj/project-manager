"use strict";
exports.__esModule = true;
exports.Prisma = void 0;
var client_1 = require("@prisma/client");
var Prisma = /** @class */ (function () {
    function Prisma() {
        if (Prisma.client == null) {
            Prisma.client = new client_1.PrismaClient();
        }
    }
    Prisma.prototype.getPrismaClient = function () {
        return Prisma.client;
    };
    return Prisma;
}());
exports.Prisma = Prisma;
