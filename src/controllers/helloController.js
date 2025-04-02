import { helloServices } from "../services/helloServices.js"

const hello = async (req, res, next) => {
  const hello = await helloServices.hello()
  res.json({ hello });
  // res.status(StatusCodes.CREATED).json(hello)
}


// const createNew = async (req, res, next) => {
//   try {
//     const createdCard = await userService.createNew(req.body)
//     res.status(StatusCodes.CREATED).json(createdCard)
//   } catch (error) {
//     next(error)
//     // console.log(error)
//     // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//     //   errors: error.message
//     // })
//   }
// }


export const helloController = {
  hello
}
