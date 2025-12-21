import { api } from '../lib/api'

export interface Project {
  _id: string
  name: string
  description?: string
  hourlyRate: number
  isActive: boolean
  account: string
  createdAt: string
  updatedAt: string
}

export interface GetProjectsParams {
  page?: number
  limit?: number
}

export interface GetProjectsResponse {
  data: Project[]
  total: number
  page: number
  limit: number
}

export interface CreateProjectPayload {
  name: string
  description?: string
  hourlyRate?: number
  isActive?: boolean
}

export interface UpdateProjectPayload {
  name?: string
  description?: string
  hourlyRate?: number
  isActive?: boolean
}

export const getAllProjects = async (
  params?: GetProjectsParams
): Promise<GetProjectsResponse> => {
  const response = await api.get('/project', { params })
  return response.data
}

export const createProject = async (
  data: CreateProjectPayload
): Promise<Project> => {
  const response = await api.post('/project', data)
  return response.data
}

export const updateProject = async (
  id: string,
  data: UpdateProjectPayload
): Promise<Project> => {
  const response = await api.put(`/project/${id}`, data)
  return response.data
}

export const deleteProject = async (id: string): Promise<void> => {
  await api.delete(`/project/${id}`)
}
