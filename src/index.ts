// importing dependecies
import express, { Express, Request, Response } from 'express'
import modelRouter from './route/model'
import loginRouter from './route/login'
import authorizationMiddleware from './middleware/authorization'
import dotenv from 'dotenv'
import { join } from 'path'
import multer from 'multer'
import cors from 'cors'

// reading config
dotenv.config()

// server initialization
const app: Express = express()
const port = process.env.PORT ?? '3000'

// define uploading image url
const userImageUploader = multer({
  dest: 'dist/uploads/imgs/users',
  limits: {
    fileSize: 800000
  }
})

const project1ImageUploader = multer({
  dest: 'dist/uploads/imgs/projects',
  limits: {
    fileSize: 800000
  }
})

const docUploader = multer({
  dest: 'dist/uploads/docs',
  limits: {
    fileSize: 5000000
  }
})

// add middleware
app.use(express.json())
app.use('/api', authorizationMiddleware, modelRouter)
app.use('/', loginRouter)
app.use('/imgs/users', express.static(join(__dirname, '/uploads/imgs/users')))
app.use('/imgs/projects', express.static(join(__dirname, '/uploads/imgs/projects')))
app.use('/docs', express.static(join(__dirname, '/uploads/docs')))
app.use(cors({
  origin: '*'
}))
app.post('/user-image', authorizationMiddleware, userImageUploader.single('avatar'), (req: Request, res: Response) => {
  res.end(req.file)
})

app.post('/project-image', authorizationMiddleware, project1ImageUploader.single('avatar'), (req: Request, res: Response) => {
  res.end(req.file)
})

app.post('/project-docs', authorizationMiddleware, docUploader.single('doc'), (req: Request, res: Response) => {
  res.end(req.file)
})

// starting server
app.get('/', (req: Request, res: Response) => res.json({ message: 'server is running' }))
app.listen(port, () => { console.log(`server is running at: http://localhost:${port}`) })
