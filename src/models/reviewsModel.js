const REVIEW_COLLECTION_NAME = 'reviews'

const REVIEW_COLLECTION_SCHEMA = Joi.object({
  user_id: Joi.string().required(), // ObjectId của users
  product_id: Joi.string().required(), // ObjectId của products
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().trim().strict(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})
