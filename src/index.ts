// importing dependecies
import express, { Express, Request, Response } from 'express'
import modelRouter from './route/model'
import loginRouter from './route/login'
import authorizationMiddleware from './middleware/authorization'
import dotenv from 'dotenv'

// reading config
dotenv.config()

// server initialization
const app: Express = express()
const port = process.env.PORT ?? '3000'

// add middle ware

app.use(express.json())
app.use('/api', authorizationMiddleware, modelRouter)
app.use('/', loginRouter)
app.use('/imgs', express.static('/uploads/imgs'))
// starting server
app.get('/', (req: Request, res: Response) => res.json({message: 'server is running'}))
app.listen(port, () => { console.log(`server is running at: http://localhost:${port}`) })
