import { Router } from 'express'
import { requireAdmin } from '../middleware/auth'
import { createEmployee, deleteEmployee, getEmployee, updateEmployee } from '../controllers/employee.controller'

export const EmployeeRouter: Router = Router()

EmployeeRouter.get('/', getEmployee)
EmployeeRouter.get('/:id', getEmployee)
EmployeeRouter.post('/', requireAdmin, createEmployee)
EmployeeRouter.delete('/:id', requireAdmin, deleteEmployee)
EmployeeRouter.put('/:id', requireAdmin, updateEmployee)
