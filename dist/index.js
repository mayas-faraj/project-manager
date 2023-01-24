"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const path_1 = __importStar(require("path"));
const multer_1 = __importDefault(require("multer"));
// reading config
dotenv_1.default.config();
// server initialization
const app = (0, express_1.default)();
const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : '3000';
// define uploading image url
const getMulter = (storagePath, namePrefix, allowedExtensions, maxSize) => {
    return (0, multer_1.default)({
        storage: multer_1.default.diskStorage({
            filename: (req, file, callback) => {
                callback(null, namePrefix + Date.now().toString() + path_1.default.extname(file.originalname));
            },
            destination: (req, file, callback) => {
                callback(null, storagePath);
            }
        }),
        limits: {
            fileSize: maxSize
        },
        fileFilter: (req, file, callback) => {
            const fileTypes = allowedExtensions;
            const extName = fileTypes.test(path_1.default.extname(file.originalname).toLowerCase());
            const mimeType = fileTypes.test(file.mimetype);
            if (extName && mimeType)
                callback(null, true);
            else
                callback(new Error('Error, you can only upload image'));
        }
    });
};
const userImageMulter = getMulter('dist/uploads/imgs/users', 'img_', /jpeg|jpg|png|gif|svg/, 800000);
const projectImageMulter = getMulter('dist/uploads/imgs/users', 'img_', /jpeg|jpg|png|gif|svg/, 800000);
const docMulter = getMulter('dist/uploads/docs', 'doc_', /doc|docx|txt|xls|xlsx|pdf/, 5000000);
const fileOutput = (req, res) => {
    var _a;
    if (req.file != null) {
        req.file.path = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path.replace('dist/uploads', '');
        res.json(req.file);
    }
    else {
        res.json({
            success: false,
            message: 'no file to upload'
        });
    }
};
// add middleware
app.use(express_1.default.json());
app.use('/api', authorization_1.default, model_1.default);
app.use('/', login_1.default);
app.use('/imgs/users', express_1.default.static((0, path_1.join)(__dirname, '/uploads/imgs/users')));
app.use('/imgs/projects', express_1.default.static((0, path_1.join)(__dirname, '/uploads/imgs/projects')));
app.use('/docs', express_1.default.static((0, path_1.join)(__dirname, '/uploads/docs')));
app.post('/user-image', authorization_1.default, userImageMulter.single('avatar'), (req, res) => {
    fileOutput(req, res);
});
app.post('/project-image', authorization_1.default, projectImageMulter.single('avatar'), (req, res) => {
    fileOutput(req, res);
});
app.post('/project-docs', authorization_1.default, docMulter.single('doc'), (req, res) => {
    fileOutput(req, res);
});
// starting server
app.get('/', (req, res) => res.json({ message: 'server is running' }));
app.listen(port, () => { console.log(`server is running at: http://localhost:${port}`); });
