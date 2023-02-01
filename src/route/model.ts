import { Router, Request, Response } from 'express'
import UserController from '../controller/userController'
import ProjectController from '../controller/projectController'
import MediaController from '../controller/mediaController'
import SuspendController from '../controller/suspendController'
import ExtensionController from '../controller/extensionController'
import PaymentController from '../controller/paymentController'

// define router
const router: Router = Router()

// available models
const models = [
  { route: 'users', controller: new UserController() },
  { route: 'projects', controller: new ProjectController() },
  { route: 'media', controller: new MediaController() },
  { route: 'suspends', controller: new SuspendController() },
  { route: 'extensions', controller: new ExtensionController() },
  { route: 'payments', controller: new PaymentController() }
]

// generic routes
models.forEach(model => {
  const modelRoute = '/' + model.route
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.get(modelRoute, async (req: Request, res: Response) => {
    const take: number | undefined = req.query.pageSize !== undefined ? parseInt(req.query.pageSize as string) : undefined
    const page: number | undefined = req.query.page !== undefined ? parseInt(req.query.page as string) : undefined
    const skip: number | undefined = (take !== undefined && page !== undefined) ? page * take : undefined
    const result = await model.controller.read(req.userInfo, take, skip)
    res.json(result)
  })

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.get(modelRoute + '/:id([0-9]+)', async (req: Request, res: Response) => {
    const result = await model.controller.find(req.userInfo, parseInt(req.params.id))
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
