import express from 'express'
import { commentController } from '../controllers/commentController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const Router = express.Router()

Router.route('/comments/:productId')
  .post(authMiddleware.isAuthorized, commentController.addComment)
  .get(commentController.getCommentsByProduct)

Router.route('/comments/:productId/:commentId')
  .delete(authMiddleware.isAuthorized, authMiddleware.isAdmin, commentController.deleteComment)

export const commentRoute = Router
