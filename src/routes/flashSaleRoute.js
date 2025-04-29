import express from 'express'
import { flashSaleController } from '../controllers/flashSaleController.js'

const Router = express.Router()
Router.route('/flash-sales')
  .post(flashSaleController.createFlashSale)
Router.route('/flash-sales/active')
  .get(flashSaleController.getActiveFlashSales)
Router.route('/flash-sales/:id')
  .put(flashSaleController.updateFlashSale)
Router.route('/flash-sales/:id')
  .delete(flashSaleController.deleteFlashSale)



export const flashSaleRoute = Router


