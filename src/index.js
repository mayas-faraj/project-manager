"use strict";
var _a;
exports.__esModule = true;
// importing dependecies
var express_1 = require("express");
var model_1 = require("./route/model");
var login_1 = require("./route/login");
var authorization_1 = require("./middleware/authorization");
var dotenv_1 = require("dotenv");
var path_1 = require("path");
var multer_1 = require("multer");
// reading config
dotenv_1["default"].config();
// server initialization
var app = (0, express_1["default"])();
var port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : '3000';
// define uploading image url
var getMulter = function (storagePath, namePrefix, allowedExtensions, maxSize) {
    return (0, multer_1["default"])({
        storage: multer_1["default"].diskStorage({
            filename: function (req, file, callback) {
                callback(null, namePrefix + Date.now().toString() + path_1["default"].extname(file.originalname));
            },
            destination: function (req, file, callback) {
                callback(null, storagePath);
            }
        }),
        limits: {
            fileSize: maxSize
        },
        fileFilter: function (req, file, callback) {
            console.log(file.mimetype);
            var fileTypes = allowedExtensions;
            var extName = fileTypes.test(path_1["default"].extname(file.originalname).toLowerCase());
            if (extName)
                callback(null, true);
            else
                callback(new Error('Error, you can only upload image'));
        }
    });
};
var userImageMiddleware = getMulter('dist/uploads/imgs/users', 'img_', /jpeg|jpg|png|gif|svg/, 800000).single('avatar');
var projectImageMiddleware = getMulter('dist/uploads/imgs/users', 'img_', /jpeg|jpg|png|gif|svg/, 800000).single('avatar');
var docMiddleware = getMulter('dist/uploads/docs', 'doc_', /doc|docx|txt|xls|xlsx|pdf/, 5000000).single('doc');
var fileOutput = function (req, res) {
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
app.use(express_1["default"].json());
app.use('/api', authorization_1["default"], model_1["default"]);
app.use('/', login_1["default"]);
app.use('/imgs/users', express_1["default"].static((0, path_1.join)(__dirname, '/uploads/imgs/users')));
app.use('/imgs/projects', express_1["default"].static((0, path_1.join)(__dirname, '/uploads/imgs/projects')));
app.use('/docs', express_1["default"].static((0, path_1.join)(__dirname, '/uploads/docs')));
app.post('/user-image', authorization_1["default"], function (req, res) {
    userImageMiddleware(req, res, function (error) {
        if (error != null) {
            res.json({
                success: false,
                message: error.message
            });
        }
        else
            fileOutput(req, res);
    });
});
app.post('/project-image', authorization_1["default"], function (req, res) {
    projectImageMiddleware(req, res, function (error) {
        if (error != null) {
            res.json({
                success: false,
                message: error.message
            });
        }
        else
            fileOutput(req, res);
    });
});
app.post('/project-docs', authorization_1["default"], function (req, res) {
    docMiddleware(req, res, function (error) {
        if (error != null) {
            res.json({
                success: false,
                message: error.message
            });
        }
        else
            fileOutput(req, res);
    });
});
// starting server
app.get('/', function (req, res) { return res.json({ message: 'server is running' }); });
app.listen(port, function () { console.log("server is running at: http://localhost:".concat(port)); });
