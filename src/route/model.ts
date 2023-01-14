import { Router, Request, Response } from 'express'
import { Model, OperationResult} from '../types'
import CompanyController from '../controller/companyController'
import DepartmentController from '../controller/departmentController'
import EngineerController from '../controller/engineerController'
import UserController from '../controller/userController'
import ProjectController from '../controller/projectController'

// define router
const router: Router = Router()

// available models

const models = [
    { route: 'companies', controller: new CompanyController()},
    { route: 'departments', controller: new DepartmentController()},
    { route: 'engineers', controller: new EngineerController()},
    { route: 'users', controller: new UserController()},
    { route: 'projects', controller: new ProjectController()}
]

//generic routes
models.forEach(model=>{
    const modelRoute = '/' + model.route;
    router.get(modelRoute, async (req: Request, res: Response) => {
        const take: number | undefined = req.query.pageSize != undefined ? parseInt(req.query.pageSize as string): undefined
        const page: number | undefined = req.query.page != undefined ? parseInt(req.query.page as string): undefined
        const skip: number | undefined = (take !== undefined && page !== undefined) ? page * take: undefined
        const result = await model.controller.read(req.userInfo, take, skip)
        if((result as OperationResult).message == undefined) {
            const modelResult: Model[] = result as Model[]
            modelResult.forEach((item: Model) => {
                const keys = Object.keys(item) as Array<keyof Model>
                for(let i:number = 0; i< keys.length; i++)
                    if(keys[i].endsWith('Id') || keys[i].endsWith('password'))
                        delete item[keys[i]]

                return item
                
            })

            res.json(modelResult)
        }
        else
            res.json(result)
    })

    router.get(modelRoute + '/:id([0-9]+)', async (req: Request, res: Response) => {
        res.json(await model.controller.find(req.userInfo, parseInt(req.params.id)))
    })

    router.post(modelRoute, async (req:Request, res: Response) => {
        res.json(await model.controller.create(req.userInfo, req.body))
    })

    router.put(modelRoute + '/:id([0-9]+)', async (req:Request, res: Response) => {

        res.json(await model.controller.update(req.userInfo,  parseInt(req.params.id), req.body))
    })

    router.delete(modelRoute + '/:id([0-9]+)', async (req:Request, res: Response) => {
        const result = await model.controller.drop(req.userInfo, parseInt(req.params.id))
        res.json(result)
    })
})

export default router