// importing dependecies
import express, { Express, Request, Response } from 'express'
import modelRouter from './route/model'
import loginRouter from './route/login'
import authorizationMiddleware from './middleware/authorization'
import dotenv from 'dotenv'
import path, { join } from 'path'
import multer, { Multer } from 'multer'

// reading config
dotenv.config()

// server initialization
const app: Express = express()
const port = process.env.PORT ?? '3000'

// define uploading image url
const getMulter = (storagePath: string, namePrefix: string, allowedExtensions: RegExp, maxSize: number): Multer => {
  return multer({
    storage: multer.diskStorage({
      filename: (req, file, callback) => {
        callback(null, namePrefix + Date.now().toString() + path.extname(file.originalname))
      },
      destination: (req, file, callback) => {
        callback(null, storagePath)
      }
    }),
    limits: {
      fileSize: maxSize
    },
    fileFilter: (req, file, callback) => {
      const fileTypes = allowedExtensions
      const extName = fileTypes.test(path.extname(file.originalname).toLowerCase())
      const mimeType = fileTypes.test(file.mimetype)
      if (extName && mimeType) callback(null, true)
      else callback(new Error('Error, you can only upload image'))
    }
  })
}

const userImageMulter = getMulter('dist/uploads/imgs/users', 'img_', /jpeg|jpg|png|gif|svg/, 800000)
const projectImageMulter = getMulter('dist/uploads/imgs/users', 'img_', /jpeg|jpg|png|gif|svg/, 800000)
const docMulter = getMulter('dist/uploads/docs', 'doc_', /doc|docx|txt|xls|xlsx|pdf/, 5000000)

const fileOutput = (req: Request, res: Response): void => {
  if (req.file != null) {
    req.file.path = req.file?.path.replace('dist/uploads', '')
    res.json(req.file)
  } else {
    res.json({
      success: false,
      message: 'no file to upload'
    })
  }
}

// add middleware
app.use(express.json())
app.use('/api', authorizationMiddleware, modelRouter)
app.use('/', loginRouter)
app.use('/imgs/users', express.static(join(__dirname, '/uploads/imgs/users')))
app.use('/imgs/projects', express.static(join(__dirname, '/uploads/imgs/projects')))
app.use('/docs', express.static(join(__dirname, '/uploads/docs')))

app.post('/user-image', authorizationMiddleware, userImageMulter.single('avatar'), (req: Request, res: Response) => {
  fileOutput(req, res)
})

app.post('/project-image', authorizationMiddleware, projectImageMulter.single('avatar'), (req: Request, res: Response) => {
  fileOutput(req, res)
})

app.post('/project-docs', authorizationMiddleware, docMulter.single('doc'), (req: Request, res: Response) => {
  fileOutput(req, res)
})

// starting server
app.get('/', (req: Request, res: Response) => res.json({ message: 'server is running' }))
app.listen(port, () => { console.log(`server is running at: http://localhost:${port}`) })
