import { GET_DB } from "../config/mongodb.js"
import Joi from "joi"
import { ObjectId } from "mongodb"

const COMMENT_COLLECTION_NAME = 'comments'

const COMMENT_SCHEMA = Joi.object({
  _id: Joi.object(),
  productId: Joi.string().required(),
  userId: Joi.string().required(),
  username: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  content: Joi.string().required().trim(),
  images: Joi.array().items(Joi.string().uri()).default([]),
  createdAt: Joi.date().timestamp('javascript').default(() => new Date()),  // Ngày hiện tại nếu không có
  updatedAt: Joi.date().timestamp('javascript').default(() => new Date())   // Ngày hiện tại nếu không có
})

const validateBeforeCreateComment = async (data) => {
  return await COMMENT_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createAComment = async (data) => {
  const validData = await validateBeforeCreateComment(data)
  const db = await GET_DB()
  const result = await db.collection(COMMENT_COLLECTION_NAME).insertOne(validData)
  return await db.collection(COMMENT_COLLECTION_NAME).findOne({ _id: result.insertedId })
}

const getCommentsByProductId = async (productId) => {
  const db = await GET_DB()
  return await db.collection(COMMENT_COLLECTION_NAME)
    .find({ productId })
    .sort({ createdAt: -1 })
    .toArray()
}

const deleteCommentById = async (commentId, userId) => {
  const db = await GET_DB()
  // Thực hiện xóa bình luận và lưu kết quả vào biến result
  const result = await db.collection(COMMENT_COLLECTION_NAME).deleteOne({
    _id: new ObjectId(commentId), // Chuyển commentId thành ObjectId nếu cần
    userId: userId
  })

  // Kiểm tra xem xóa thành công hay không
  return result // Kết quả của việc xóa
}


export const commentModel = {
  createAComment,
  getCommentsByProductId,
  deleteCommentById
}
