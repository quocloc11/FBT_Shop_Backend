import express from 'express'
import { helloRoute } from './helloRoute.js'
import { userRoute } from './userRoutes.js'
import { productRoute } from './productRoutes.js'


const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIS v1 ARE READY TO USE' })
})

Router.use('/', helloRoute)
Router.use('/users', userRoute)
Router.use('/', productRoute)

//module.exports = { APIs: Router };
export const APIs = Router
