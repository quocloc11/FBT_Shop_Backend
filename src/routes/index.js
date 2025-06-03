import express from 'express'
import { helloRoute } from './helloRoute.js'
import { userRoute } from './userRoutes.js'
import { productRoute } from './productRoutes.js'
import { viewProductRoute } from './viewedProductRoute.js'
import { cartRoute } from './cartRoutes.js'
import { orderRoute } from './orderRoutes.js'
import { commentRoute } from './commentRoutes.js'


const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIS v1 ARE READY TO USE' })
})

Router.use('/', helloRoute)
Router.use('/users', userRoute)
Router.use('/', productRoute)
Router.use('/', viewProductRoute)
Router.use('/', cartRoute)
Router.use('/', orderRoute)
Router.use('/', commentRoute)

//module.exports = { APIs: Router };
export const APIs = Router
