import { Router, Request, Response } from 'express'
import { Model, OperationResult } from '../types'
import UserController from '../controller/userController'
import ProjectController from '../controller/projectController'

// define router
const router: Router = Router()

// available models

const models = [
  { route: 'users', controller: new UserController() },
  { route: 'projects', controller: new ProjectController() }
]

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

// generic routes
models.forEach(model => {
  const modelRoute = '/' + model.route
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.get(modelRoute, async (req: Request, res: Response) => {
    const take: number | undefined = req.query.pageSize !== undefined ? parseInt(req.query.pageSize as string) : undefined
    const page: number | undefined = req.query.page !== undefined ? parseInt(req.query.page as string) : undefined
    const skip: number | undefined = (take !== undefined && page !== undefined) ? page * take : undefined
    const result = await model.controller.read(req.userInfo, take, skip)
    if ((result as OperationResult).message === undefined) {
      (result as Model[]).forEach(model => {
        stripFields(model)
      })

      res.json(result)
    } else { res.json(result) }
  })

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.get(modelRoute + '/:id([0-9]+)', async (req: Request, res: Response) => {
    const result = await model.controller.find(req.userInfo, parseInt(req.params.id))
    if (result !== null && (result as OperationResult).message === undefined) {
      stripFields(result)
    }
    res.json(result)
  })

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.post(modelRoute, async (req: Request, res: Response) => {
    res.json(await model.controller.create(req.userInfo, req.body))
  })

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.put(modelRoute + '/:id([0-9]+)', async (req: Request, res: Response) => {
    res.json(await model.controller.update(req.userInfo, parseInt(req.params.id), req.body))
  })

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.delete(modelRoute + '/:id([0-9]+)', async (req: Request, res: Response): Promise<void> => {
    const result = await model.controller.drop(req.userInfo, parseInt(req.params.id))
    res.json(result)
  })
})

export default router
