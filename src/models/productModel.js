import Joi from "joi"
import { GET_DB } from "../config/mongodb.js"
import { ObjectId } from "mongodb";

const ORDER_COLLECTION_NAME = 'orders'


const PRODUCT = Joi.object({
  name: Joi.string().required().trim().strict(),
  category: Joi.string().required(), // ObjectId của categories
  price: Joi.number().required(),
  stock: Joi.number().default(0),
  description: Joi.string().trim().strict(),
  images: Joi.array().items(Joi.string()),
  rating: Joi.number().min(0).max(5).default(0),
  sold: Joi.number().default(0),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const validateBeforeCreateAProduct = async (data) => {
  return await PRODUCT.validateAsync(data, { abortEarly: false })

}
const createAProduct = async (data) => {
  console.log(data)
  try {
    const validData = await validateBeforeCreateAProduct(data)
    const newProduct = {
      ...validData,
    }

    const createdProduct = await GET_DB().collection("products").insertOne(newProduct)
    return createdProduct
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (Id) => {
  try {
    const result = await GET_DB().collection("product").findOne({
      _id: new ObjectId(Id)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}


const getProduct = async () => {
  try {
    const products = await GET_DB().collection("products")
      .find({}, { projection: { _id: 1, name: 1, price: 1, quantity: 1, image: 1 } })
      .toArray();
    if (!products) throw new Error("Product not found");
    return products;
  } catch (error) {
    throw new Error(error.message);
  }
};
const updateAProduct = async (id, data) => {
  console.log(data)
  try {
    const result = await GET_DB().collection("products").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after' }
    )

    return result
  } catch (error) {
    throw new Error(error)
  }
}
const deleteAProduct = async (id) => {
  try {
    const result = await GET_DB().collection("products").deleteMany({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const productModel = {
  PRODUCT,
  createAProduct, getProduct, deleteAProduct, updateAProduct,
  findOneById
}