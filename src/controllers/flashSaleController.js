import { flashSaleService } from "../services/flashSaleServices.js"

const createFlashSale = async (req, res, next) => {
  try {

    const result = await flashSaleService.createFlashSale(req.body)
    console.log('result', result)
    res.status(201).json({ message: 'Created flash sale successfully!', id: result.insertedId })
  } catch (error) {
    res.status(400).json({ error: error.message })
    //  next()
  }
}

const getActiveFlashSales = async (req, res) => {
  try {
    const flashSales = await flashSaleService.getActiveFlashSales()
    res.status(200).json(flashSales)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const updateFlashSale = async (req, res) => {
  try {
    const { id } = req.params
    const updated = await flashSaleService.updateFlashSale(id, req.body)
    res.status(200).json(updated)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const deleteFlashSale = async (req, res) => {
  try {
    const { id } = req.params
    const result = await flashSaleService.deleteFlashSale(id)
    res.status(200).json({ deletedCount: result.deletedCount })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const flashSaleController = {
  createFlashSale,
  getActiveFlashSales,
  updateFlashSale,
  deleteFlashSale
}
