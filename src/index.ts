import bodyParser from 'body-parser'
import express, { Application } from 'express'
import { routes } from './routes'
import cors from 'cors'
import { logger } from './utils/logger'

// connect DB
import './utils/connectDB'
import deserializedToken from './middleware/deserializedToken'

const app: Application = express()
const port: Number = 4000

// parse body request
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// cors access handler
app.use(cors())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  next()
})

app.use(deserializedToken)

routes(app)

app.listen(port, () => logger.info(`Server is listening on port ${port}`))
