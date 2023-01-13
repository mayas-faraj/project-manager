// importing dependecies
import express, { Express, Request, Response, Router } from 'express'
import * as companyController from './controller/companyController'
import * as departmentController from './controller/departmentController'
import * as engineerController from './controller/engineerController'
import * as userController from './controller/userController'
import * as projectController from './controller/projectController'
import dotenv from 'dotenv'
import { Company, Department, Engineer, Project, User } from '@prisma/client'

// reading config
dotenv.config()

// server initialization
const app: Express = express()
const router: Router = Router()
const port = process.env.PORT ?? '3000'

// available models
type Model = Company | Department | Engineer | User | Project

const models = [
    { route: 'companies', contoller: companyController},
    { route: 'departments', contoller: departmentController},
    { route: 'engineers', contoller: engineerController},
    { route: 'users', contoller: userController},
    { route: 'projects', contoller: projectController}
]

//generic routes
models.forEach(model=>{
    const modelRoute = '/' + model.route;
    router.get(modelRoute, async (req: Request, res: Response) => {
        const take: number | undefined = req.query.pageSize != undefined ? parseInt(req.query.pageSize as string): undefined
        const page: number | undefined = req.query.page != undefined ? parseInt(req.query.page as string): undefined
        const skip: number | undefined = (take !== undefined && page !== undefined) ? page * take: undefined
        const result = await model.contoller.read(take, skip)

        const outputResult: Model[] = result.map((item: Model) => {
            const keys = Object.keys(item) as Array<keyof Model>
            for(let i:number = 0; i< keys.length; i++)
                if(keys[i].endsWith('Id'))
                    delete item[keys[i]]

            return item
        })

        res.json(result)
    })

    router.get(modelRoute + '/:id([0-9]+)', async (req: Request, res: Response) => {
        res.json(await model.contoller.find(parseInt(req.params.id)))
    })

    router.post(modelRoute, async (req:Request, res: Response) => {
        const data = req.body
        data.creatorId = 1  
        res.json(await model.contoller.create(req.body))
    })

    router.put(modelRoute, async (req:Request, res: Response) => {
        const {id, ...data} = req.body;
        res.json(await model.contoller.update(id, data))
    })

    router.delete(modelRoute, async (req:Request, res: Response) => {
        const {id, ...data} = req.body;
        const result = await model.contoller.drop(id)
        res.json(result)
    })
})

// add middle ware
app.use(express.json())
app.use('/api', router)
app.use('/uploads', express.static('/uploads'))
// starting server
app.get('/', (req: Request, res: Response) => res.json({message: 'server is running'}))
app.listen(port, () => { console.log(`server is running at: http://localhost:${port}`) })
