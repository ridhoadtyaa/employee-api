export interface UserType {
  user_id: string
  email: string
  name: string
  password: string
  role: string
}

export interface UserLoginType {
  email: string
  password: string
}
