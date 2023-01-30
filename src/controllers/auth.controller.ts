import { Request, Response } from 'express'
import { createUserValidation, loginUserValidation, refreshTokenValidation } from '../validation/auth.validation'
import { v4 as uuidv4 } from 'uuid'
import { logger } from '../utils/logger'
import { findUserByEmail, createUser } from '../services/auth.service'
import bcrypt from 'bcrypt'
import { signJwt, verifyJWT } from '../utils/jwt'

export const registerUser = async (req: Request, res: Response) => {
  req.body.user_id = uuidv4()

  const { error, value } = createUserValidation(req.body)

  if (error) {
    logger.error('ERR: user - register = ', error.details[0].message)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message, data: {} })
  }

  try {
    value.password = bcrypt.hashSync(value.password, 10)
    await createUser(value)

    logger.info('Success add new user')
    res.status(201).send({ status: true, statusCode: 201, message: 'Add user success', data: value })
  } catch (e) {
    logger.error('ERR: employee - create = ', e)
    return res.status(422).send({ status: false, statusCode: 422, message: e, data: {} })
  }
}

export const createSession = async (req: Request, res: Response) => {
  const { error, value } = loginUserValidation(req.body)

  if (error) {
    logger.error('ERR: user - createSession = ', error.details[0].message)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message })
  }

  try {
    const user: any = await findUserByEmail(value.email)
    const isValid = bcrypt.compareSync(value.password, user.password)

    if (!isValid) return res.status(401).send({ status: false, statusCode: 401, message: 'Invalid email or password' })
    const accessToken = signJwt({ ...user }, { expiresIn: '1d' })
    const refreshToken = signJwt({ ...user }, { expiresIn: '1y' })

    return res
      .status(200)
      .send({ status: false, statusCode: 200, message: 'Login success', data: { accessToken, refreshToken } })
  } catch (e: any) {
    logger.error('ERR: user - createSession = ', e.message)
    return res.status(422).send({ status: false, statusCode: 422, message: e.message })
  }
}

export const refreshSession = async (req: Request, res: Response) => {
  const { error, value } = refreshTokenValidation(req.body)

  if (error) {
    logger.error('ERR: user - refresh session = ', error.details[0].message)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message })
  }

  try {
    const { decoded, valid }: any = verifyJWT(value.refreshToken)

    if (!valid) {
      logger.error('ERR: user - refresh session = token not valid')
      return res.status(422).send({ status: false, statusCode: 422, message: 'token not valid' })
    }

    const user = await findUserByEmail(decoded._doc.email)
    if (!user) {
      logger.error('ERR: user - refresh session = user not found')
      return res.status(422).send({ status: false, statusCode: 422, message: 'user not found' })
    }

    const accessToken = signJwt({ ...user }, { expiresIn: '1d' })

    return res
      .status(200)
      .send({ status: true, statusCode: 200, message: 'Refresh Session Success', data: { accessToken } })
  } catch (e: any) {
    logger.error('ERR: user - createSession = ', e.message)
    return res.status(422).send({ status: false, statusCode: 422, message: e.message })
  }
}
