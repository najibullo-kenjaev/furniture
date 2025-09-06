import { api } from './axios'

export interface LoginDto { email: string; password: string }

export const login = (d: LoginDto) =>
  api.post<{ token: string }>('Auth/login', d)