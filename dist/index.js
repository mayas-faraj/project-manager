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
const multer_1 = __importDefault(require("multer"));
const cors_1 = __importDefault(require("cors"));
// reading config
dotenv_1.default.config();
// server initialization
const app = (0, express_1.default)();
const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : '3000';
// define uploading image url
const userImageUploader = (0, multer_1.default)({
    dest: 'dist/uploads/imgs/users',
    limits: {
        fileSize: 800000
    }
});
const project1ImageUploader = (0, multer_1.default)({
    dest: 'dist/uploads/imgs/projects',
    limits: {
        fileSize: 800000
    }
});
const docUploader = (0, multer_1.default)({
    dest: 'dist/uploads/docs',
    limits: {
        fileSize: 5000000
    }
});
// add middleware
app.use(express_1.default.json());
app.use('/api', authorization_1.default, model_1.default);
app.use('/', login_1.default);
app.use('/imgs/users', express_1.default.static((0, path_1.join)(__dirname, '/uploads/imgs/users')));
app.use('/imgs/projects', express_1.default.static((0, path_1.join)(__dirname, '/uploads/imgs/projects')));
app.use('/docs', express_1.default.static((0, path_1.join)(__dirname, '/uploads/docs')));
app.use((0, cors_1.default)({
    origin: '*'
}));
app.post('/user-image', authorization_1.default, userImageUploader.single('avatar'), (req, res) => {
    res.end(req.file);
});
app.post('/project-image', authorization_1.default, project1ImageUploader.single('avatar'), (req, res) => {
    res.end(req.file);
});
app.post('/project-docs', authorization_1.default, docUploader.single('doc'), (req, res) => {
    res.end(req.file);
});
// starting server
app.get('/', (req, res) => res.json({ message: 'server is running' }));
app.listen(port, () => { console.log(`server is running at: http://localhost:${port}`); });
