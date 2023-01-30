import { Request, Response } from 'express'
import { createEmployeeValidation, updateEmployeeValidation } from '../validation/employee.validation'
import { logger } from '../utils/logger'
import {
  createEmployeeFromDB,
  deleteEmployeeFromDB,
  getEmployeeById,
  getEmployeeFromDB,
  updateEmployeeFromDB
} from '../services/employee.service'
import { v4 as uuidv4 } from 'uuid'

export const getEmployee = async (req: Request, res: Response) => {
  const { id } = req.params

  if (id) {
    const data = await getEmployeeById(id)
    if (data) {
      logger.info('Success get employee data')
      return res.status(200).send({ status: true, statusCode: 200, data })
    } else {
      logger.info('Employee data not found')
      return res.status(404).send({ status: false, statusCode: 404, message: 'Employee data not found', data: {} })
    }
  }

  const data = await getEmployeeFromDB()
  logger.info('Success get all employee data')
  return res.status(200).send({ status: true, statusCode: 200, data })
}

export const createEmployee = async (req: Request, res: Response) => {
  req.body.employee_id = uuidv4()
  const { error, value } = createEmployeeValidation(req.body)
  if (error) {
    logger.error('ERR: employee - create = ', error.details[0].message)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message, data: {} })
  }

  try {
    await createEmployeeFromDB(value)

    logger.info('Success add new employee')
    res.status(201).send({ status: true, statusCode: 201, message: 'Add employee success', data: value })
  } catch (e) {
    logger.error('ERR: employee - create = ', e)
    return res.status(422).send({ status: false, statusCode: 422, message: e, data: {} })
  }
}

export const deleteEmployee = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const data = await deleteEmployeeFromDB(id)
    if (data) {
      logger.info('Success delete employee data')
      return res.status(200).send({ status: true, statusCode: 200, message: 'Success delete employee data' })
    } else {
      logger.info('Employee data not found')
      return res.status(404).send({ status: false, statusCode: 404, message: 'Employee data not found' })
    }
  } catch (error) {
    logger.error('ERR: employee - create = ', error)
    return res.status(422).send({ status: false, statusCode: 422, message: error })
  }
}

export const updateEmployee = async (req: Request, res: Response) => {
  const { id } = req.params

  const { error, value } = updateEmployeeValidation(req.body)
  if (error) {
    logger.error('ERR: employee - update = ', error.details[0].message)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message, data: {} })
  }

  try {
    const data = await updateEmployeeFromDB(id, value)
    if (data) {
      logger.info('Success update employee data')
      return res.status(200).send({ status: true, statusCode: 200, message: 'Success update employee data' })
    } else {
      logger.info('Employee data not found')
      return res.status(404).send({ status: false, statusCode: 404, message: 'Employee data not found' })
    }
  } catch (error) {
    logger.error('ERR: employee - create = ', error)
    return res.status(422).send({ status: false, statusCode: 422, message: error })
  }
}
