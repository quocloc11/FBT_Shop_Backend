import { flashSaleModel } from '../models/flashSaleModel.js'

const createFlashSale = async (data) => {
  return await flashSaleModel.createFlashSale(data)
}

const getActiveFlashSales = async () => {
  return await flashSaleModel.getActiveFlashSales()
}

const deleteFlashSale = async (id) => {
  return await flashSaleModel.deleteFlashSale(id)
}

const updateFlashSale = async (id, data) => {
  return await flashSaleModel.updateFlashSale(id, data)
}

export const flashSaleService = {
  createFlashSale,
  getActiveFlashSales,
  deleteFlashSale,
  updateFlashSale
}
