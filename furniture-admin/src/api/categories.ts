import { api } from './axios'

export interface Category {
  id: string
  name: string
  slug: string
  isActive: boolean
  parentId: string | null
  children?: Category[]
}
export interface CreateCat { name: string; parentId: string | null }
export interface UpdateCat extends CreateCat { id: string; isActive: boolean }

export const getCategories = () => api.get<Category[]>('categories')
export const getCategory = (id: string) => api.get<Category>(`categories/${id}`)
export const createCategory = (d: CreateCat) => api.post<Category>('categories', d)
export const updateCategory = (d: UpdateCat) => api.put(`categories/${d.id}`, d)
export const deleteCategory = (id: string) => api.delete(`categories/${id}`)