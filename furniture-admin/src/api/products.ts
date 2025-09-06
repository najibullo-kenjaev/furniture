import { api } from './axios'

export interface Product {
  id: string
  name: string
  slug: string
  price?: number
  shortDescription?: string
  fullDescription?: string
  widthCm?: number
  depthCm?: number
  heightCm?: number
  materials?: string
  isActive: boolean
  categoryId: string
  images: string[]
}

export interface CreateProd {
  name: string
  slug: string
  price?: number
  shortDescription?: string
  fullDescription?: string
  widthCm?: number
  depthCm?: number
  heightCm?: number
  materials?: string
  categoryId: string
  images: File[]
}
export interface UpdateProd extends Omit<CreateProd, 'images'> {
  id: string
  isActive: boolean
  images?: File[]
  removeImages?: string[]
}

export const getProducts = () => api.get<Product[]>('products')
export const getProduct = (id: string) => api.get<Product>(`products/${id}`)
export const createProduct = (d: FormData) =>
  api.post<Product>('products', d, { headers: { 'Content-Type': 'multipart/form-data' } })
export const updateProduct = (id: string, d: FormData) =>
  api.put(`products/${id}`, d, { headers: { 'Content-Type': 'multipart/form-data' } })
export const deleteProduct = (id: string) => api.delete(`products/${id}`)