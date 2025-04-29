import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '../config/mongodb.js'

export const FLASH_SALE_COLLECTION = 'flash_sales'

const FLASH_SALE_SCHEMA = Joi.object({
  // productId: Joi.string().required(),           // Mã định danh duy nhất cho sản phẩm (kiểu chuỗi, bắt buộc)
  productName: Joi.string().required(),         // Tên sản phẩm (kiểu chuỗi, bắt buộc)
  productImage: Joi.string().uri().required(),  // Đường dẫn hình ảnh sản phẩm (URL, bắt buộc)
  salePrice: Joi.number().required(),           // Giá bán hiện tại (kiểu số, bắt buộc)
  originalPrice: Joi.number().required(),       // Giá gốc ban đầu (kiểu số, bắt buộc)
  quantity: Joi.number().min(1).required(),     // Số lượng sản phẩm nhập kho (tối thiểu 1, bắt buộc)

  sold: Joi.number().min(0).default(0),         // Số lượng sản phẩm đã bán (mặc định 0, tối thiểu 0)
  stockLeft: Joi.number().min(0).default(0),    // Số lượng tồn kho còn lại (mặc định 0, tối thiểu 0)
  video: Joi.string(),
  description: Joi.string().optional().allow(""), // Mô tả chi tiết về sản phẩm (tùy chọn, có thể là chuỗi rỗng)
  specs: Joi.string().optional().allow(""),       // Thông số kỹ thuật (tùy chọn, có thể là chuỗi rỗng)
  images: Joi.string().optional().allow(''),

  start: Joi.date().required(),                 // Ngày bắt đầu bán sản phẩm (bắt buộc)
  end: Joi.date().required(),                   // Ngày kết thúc bán sản phẩm hoặc khuyến mãi (bắt buộc)
  isActive: Joi.boolean().default(true),        // Trạng thái sản phẩm (đang hoạt động hay không, mặc định là true)

  createdAt: Joi.date().default(Date.now),      // Ngày tạo sản phẩm (mặc định là thời điểm hiện tại)
  updatedAt: Joi.date().default(null)           // Ngày cập nhật cuối cùng (mặc định là null nếu chưa có cập nhật)

})

const validateBeforeCreate = async (data) => {
  return await FLASH_SALE_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createFlashSale = async (data) => {
  const validatedData = await validateBeforeCreate(data)
  const db = GET_DB()
  const result = await db.collection(FLASH_SALE_COLLECTION).insertOne(validatedData)
  return result
}

const getActiveFlashSales = async () => {
  const now = new Date()
  return await GET_DB()
    .collection(FLASH_SALE_COLLECTION)
    .find({
      isActive: true,
      start: { $lte: now },
      end: { $gte: now }
    })
    .toArray()
}

const deleteFlashSale = async (id) => {
  return await GET_DB().collection(FLASH_SALE_COLLECTION).deleteOne({ _id: new ObjectId(id) })
}

const updateFlashSale = async (id, data) => {
  data.updatedAt = new Date()
  const result = await GET_DB().collection(FLASH_SALE_COLLECTION).findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: data },
    { returnDocument: 'after' }
  )
  return result.value
}

export const flashSaleModel = {
  createFlashSale,
  getActiveFlashSales,
  deleteFlashSale,
  updateFlashSale
}
