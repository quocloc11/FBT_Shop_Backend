import { StatusCodes } from 'http-status-codes'
import bcryptjs from 'bcryptjs'
import { userModel } from '../models/userModel.js'
import { v4 as uuidv4 } from 'uuid';
import { JwtProvider } from '../provider/JwtProvider.js';
import { pickUser } from '../utils/formatters.js'
import { env } from '../config/environment.js';
import ApiError from '../utils/ApiError.js';
// const salt = bcrypt.genSaltSync(10);
// const hash = bcrypt.hashSync("B4c0/\/", salt);

const login = async (reqBody) => {
  try {
    const existUser = await userModel.findOneByEmail(reqBody.email)

    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found')
    // if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active')
    if (!bcryptjs.compareSync(reqBody.password, existUser.password)) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your Email or Password is incorrect!')
    }
    const userInfo = {
      _id: existUser._id,
      email: existUser.email,
      role: existUser.role
    }
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    )

    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      env.REFRESH_TOKEN_LIFE
    )

    return { accessToken, refreshToken, ...pickUser(existUser) }
    return existUser
  } catch (error) {
    throw error
  }
}

const refreshToken = async (clientRefreshToken) => {
  try {

    const refreshTokenDecoded = await JwtProvider.verifyToken(
      clientRefreshToken,
      env.REFRESH_TOKEN_SECRET_SIGNATURE)
    const userInfo = {
      _id: refreshTokenDecoded._id,
      email: refreshTokenDecoded.email
    }
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    )
    return { accessToken }
  } catch (error) { throw error }

}

const register = async (reqBody) => {
  try {
    const nameFromEmail = reqBody.email.split('@')[0]
    const newUser = {
      email: reqBody.email,
      password: bcryptjs.hashSync(reqBody.password, 8), //tham so thu 2 do phuc tap
      name: nameFromEmail,
      displayName: nameFromEmail,
      verifyToken: uuidv4()
    }
    const createdUser = await userModel.register(newUser)
    //if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found')
    // if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active')
    // if (!bcryptjs.compareSync(reqBody.password, existUser.password)) {
    //   throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your Email or Password is incorrect!')
    // }
    // const userInfo = {
    //   _id: existUser._id,
    //   email: existUser.email
    // }
    // const accessToken = await JwtProvider.generateToken(
    //   userInfo,
    //   env.ACCESS_TOKEN_SECRET_SIGNATURE,
    //   env.ACCESS_TOKEN_LIFE
    // )

    // const refreshToken = await JwtProvider.generateToken(
    //   userInfo,
    //   env.REFRESH_TOKEN_SECRET_SIGNATURE,
    //   env.REFRESH_TOKEN_LIFE
    // )

    //return { accessToken, refreshToken, ...pickUser(existUser) }
    return createdUser
  } catch (error) {
    throw error
  }
}


export const userServices = {
  login, register, refreshToken
}