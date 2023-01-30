import { EmployeeType } from '../types/employee.type'
import employeeModel from '../models/employee.model'
import { logger } from '../utils/logger'

export const getEmployeeFromDB = async () => {
  return await employeeModel
    .find()
    .then((data) => {
      return data
    })
    .catch((error) => {
      logger.info('Cannot get data employee from DB')
      logger.error(error)
    })
}

export const getEmployeeById = async (id: string) => {
  const res = await employeeModel.findOne({ employee_id: id })

  return res
}

export const createEmployeeFromDB = async (payload: EmployeeType) => {
  const res = await employeeModel.create(payload)

  return res
}

export const deleteEmployeeFromDB = async (id: string) => {
  const res = await employeeModel.findOneAndDelete({ employee_id: id })

  return res
}

export const updateEmployeeFromDB = async (id: string, payload: EmployeeType) => {
  const res = await employeeModel.findOneAndUpdate({ employee_id: id }, { $set: payload })

  return res
}
