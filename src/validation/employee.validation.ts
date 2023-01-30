import Joi from 'joi'
import { EmployeeType } from '../types/employee.type'

export const createEmployeeValidation = (payload: EmployeeType) => {
  const schema = Joi.object({
    employee_id: Joi.string().required(),
    name: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().allow('', null).email(),
    salary: Joi.number().required(),
    job: Joi.string().required()
  })

  return schema.validate(payload)
}

export const updateEmployeeValidation = (payload: EmployeeType) => {
  const schema = Joi.object({
    name: Joi.string().allow('', null),
    phone: Joi.string().allow('', null),
    email: Joi.string().allow('', null).email(),
    salary: Joi.number().allow('', null),
    job: Joi.string().allow('', null)
  })

  return schema.validate(payload)
}
