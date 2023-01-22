"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controller/userController"));
const projectController_1 = __importDefault(require("../controller/projectController"));
const projectViewerController_1 = __importDefault(require("../controller/projectViewerController"));
// define router
const router = (0, express_1.Router)();
// available models
const models = [
    { route: 'users', controller: new userController_1.default() },
    { route: 'projects', controller: new projectController_1.default() },
    { route: 'viewers', controller: new projectViewerController_1.default() }
];
/*
const stripFields = (model: object): void => {
  const inputModel = model as Partial<Model>
  if (inputModel != null) {
    const keys = Object.keys(model) as Array<keyof Model>
    for (let i: number = 0; i < keys.length; i++) {
      if (typeof inputModel[keys[i]] === 'object') {
        stripFields(inputModel[keys[i]] as unknown as Model)
      } else if ((Boolean(keys[i].endsWith('Id'))) || (Boolean(keys[i].endsWith('password')))) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete inputModel[keys[i]]
      }
    }
  }
}
*/
// generic routes
models.forEach(model => {
    const modelRoute = '/' + model.route;
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    router.get(modelRoute, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const take = req.query.pageSize !== undefined ? parseInt(req.query.pageSize) : undefined;
        const page = req.query.page !== undefined ? parseInt(req.query.page) : undefined;
        const skip = (take !== undefined && page !== undefined) ? page * take : undefined;
        const result = yield model.controller.read(req.userInfo, take, skip);
        res.json(result);
    }));
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    router.get(modelRoute + '/:id([0-9]+)', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield model.controller.find(req.userInfo, parseInt(req.params.id));
        res.json(result);
    }));
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    router.post(modelRoute, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.json(yield model.controller.create(req.userInfo, req.body));
    }));
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    router.put(modelRoute + '/:id([0-9]+)', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.json(yield model.controller.update(req.userInfo, parseInt(req.params.id), req.body));
    }));
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    router.delete(modelRoute + '/:id([0-9]+)', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield model.controller.drop(req.userInfo, parseInt(req.params.id));
        res.json(result);
    }));
});
exports.default = router;
