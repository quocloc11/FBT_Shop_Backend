import Joi from "joi"
import { GET_DB } from "../config/mongodb.js"
import { EMAIL_RULE, EMAIL_RULE_MESSAGE } from "../utils/validators.js"

import { ObjectId } from 'mongodb'
const USER_ROLES = {
  CLIENT: 'client',
  ADMIN: 'admin'
}

const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
  password: Joi.string().required(),
  name: Joi.string().required().trim().strict(),
  displayName: Joi.string().required().trim().strict(),
  avatar: Joi.string().default(null),
  role: Joi.string().valid(...Object.values(USER_ROLES)).default(USER_ROLES.CLIENT),
  phone: Joi.string().default(null),
  address: Joi.string().default(null),
  isActive: Joi.boolean().default(false),
  verifyToken: Joi.string(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})


const INVALID_UPDATE_FIELDS = ['_id', 'email', 'username', 'createdAt']
const validateBeforeCreate = async (data) => {
  console.log('data', data)
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })

}
const register = async (data) => {
  console.log(data)
  try {
    const validData = await validateBeforeCreate(data)
    const createdUser = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validData)
    return createdUser
  } catch (error) {
    throw new Error(error)
  }
}
const findOneByEmail = async (emailValue) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      email: emailValue
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const findOneById = async (userId) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      _id: new ObjectId(userId)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const update = async (userId, updateData) => {
  try {
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return result.value
  } catch (error) {
    throw new Error(error)
  }
}

const getAllUsers = async () => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .find({ _destroy: false }) // Lọc những user chưa bị "xóa mềm"
      .toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteUser = async (userId) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).updateOne(
      { _id: new ObjectId(userId) },
      { $set: { _destroy: true } }
    )
    return result // ⚡
  } catch (error) {
    throw new Error(error)
  }
}


const updateUser = async (userId, data) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).updateOne(
      { _id: new ObjectId(userId) },
      { $set: data }
    )
    return result // ⚡ BẮT BUỘC phải return
  } catch (error) {
    throw new Error(error)
  }
}

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  USER_ROLES,
  findOneByEmail,
  register,
  update, findOneById, getAllUsers,
  deleteUser, updateUser
}