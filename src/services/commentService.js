import { ObjectId } from 'mongodb'
import { commentModel } from '../models/commentModel.js'

const addComment = async (productId, user, content, rating) => {
  const comment = {
    _id: new ObjectId(),
    productId,
    userId: user._id.toString(),
    username: user.email || 'Anonymous',
    content,
    rating, // Thêm rating vào comment
    createdAt: new Date(),
    updatedAt: new Date(),
    images: []
  }
  return await commentModel.createAComment(comment);
}


const getCommentsByProduct = async (productId) => {
  return await commentModel.getCommentsByProductId(productId)
}

const deleteComment = async (commentId, userId) => {
  try {
    const result = await commentModel.deleteCommentById(commentId, userId)

    if (result.deletedCount === 0) {
      throw new Error('No comment was deleted.')
    }

    return result
  } catch (error) {
    console.log('Error deleting comment:', error)
    throw error
  }
}

export const commentService = {
  addComment,
  getCommentsByProduct,
  deleteComment
}
