import mongoose from 'mongoose'

const employeeSchema = new mongoose.Schema(
  {
    employee_id: {
      type: String,
      unique: true
    },
    name: {
      type: String
    },
    phone: {
      type: String
    },
    email: { type: String },
    salary: { type: Number },
    job: { type: String }
  },
  { timestamps: true }
)

const employeeModel = mongoose.model('employees', employeeSchema)

export default employeeModel
