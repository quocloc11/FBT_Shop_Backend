const ORDER_COLLECTION_NAME = 'orders'

const ORDER_COLLECTION_SCHEMA = Joi.object({
  user_id: Joi.string().required(), // ObjectId của users
  products: Joi.array().items(
    Joi.object({
      product_id: Joi.string().required(), // ObjectId của products
      quantity: Joi.number().required(),
      price: Joi.number().required()
    })
  ),
  total_price: Joi.number().required(),
  status: Joi.string().valid("Processing", "Shipped", "Delivered", "Cancelled").default("Processing"),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})
