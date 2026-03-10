export interface LoginPayload {
  username: string
  password: string
}

export interface UserProfile {
  id: string
  name: string
  role: string
}

export interface LoginResponse {
  token: string
  user: UserProfile
}
