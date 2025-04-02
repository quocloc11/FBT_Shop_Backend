import express from 'express'
import { helloController } from "../controllers/helloController.js";

const Router = express.Router()

Router.route('/hello')
  .get(helloController.hello)

export const helloRoute = Router

