"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
// importing dependecies
const express_1 = __importDefault(require("express"));
const model_1 = __importDefault(require("./route/model"));
const login_1 = __importDefault(require("./route/login"));
const authorization_1 = __importDefault(require("./middleware/authorization"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = require("path");
// reading config
dotenv_1.default.config();
// server initialization
const app = (0, express_1.default)();
const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : '3000';
// add middle ware
app.use(express_1.default.json());
app.use('/api', authorization_1.default, model_1.default);
app.use('/', login_1.default);
app.use('/uploads/imgs', express_1.default.static((0, path_1.join)(__dirname, '/uploads/imgs')));
// starting server
app.get('/', (req, res) => res.json({ message: 'server is running' }));
app.listen(port, () => { console.log(`server is running at: http://localhost:${port}`); });
