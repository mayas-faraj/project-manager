import express, { Express, Request, Response } from 'express'
import * as ormLayer from './orm-layer'
import dotenv from 'dotenv'

dotenv.config()

const app: Express = express()
const port = process.env.PORT ?? '3000'

app.get('/', (req: Request, res: Response) => res.send('Express + Typescript server'))
app.listen(port, () => { console.log(`server is running at: http://localhost:${port}`) })
