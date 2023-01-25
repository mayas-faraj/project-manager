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
      console.log(file.mimetype)
      const fileTypes = allowedExtensions
      const extName = fileTypes.test(path.extname(file.originalname).toLowerCase())
      if (extName) callback(null, true)
      else callback(new Error('Error, you can only upload image'))
    }
  })
}

const userImageMiddleware = getMulter('dist/uploads/imgs/users', 'img_', /jpeg|jpg|png|gif|svg/, 800000).single('avatar')
const projectImageMiddleware = getMulter('dist/uploads/imgs/users', 'img_', /jpeg|jpg|png|gif|svg/, 800000).single('avatar')
const docMiddleware = getMulter('dist/uploads/docs', 'doc_', /doc|docx|txt|xls|xlsx|pdf/, 5000000).single('doc')

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

app.post('/user-image', authorizationMiddleware, (req: Request, res: Response) => {
  userImageMiddleware(req, res, (error: any) => {
    if (error != null) {
      res.json({
        success: false,
        message: error.message
      })
    } else fileOutput(req, res)
  })
})

app.post('/project-image', authorizationMiddleware, (req: Request, res: Response) => {
  projectImageMiddleware(req, res, (error: any) => {
    if (error != null) {
      res.json({
        success: false,
        message: error.message
      })
    } else fileOutput(req, res)
  })
})

app.post('/project-docs', authorizationMiddleware, (req: Request, res: Response) => {
  docMiddleware(req, res, (error: any) => {
    if (error != null) {
      res.json({
        success: false,
        message: error.message
      })
    } else fileOutput(req, res)
  })
})

// starting server
app.get('/', (req: Request, res: Response) => res.json({ message: 'server is running' }))
app.listen(port, () => { console.log(`server is running at: http://localhost:${port}`) })
