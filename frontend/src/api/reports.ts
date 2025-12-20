import { api } from '../lib/api'
import type { CreateReportPayload } from '@unclocked-app/shared'

export interface Report {
  _id: string
  account: string
  project: string
  name: string
  rangeStart: string
  rangeEnd: string
  totalHours: number
  totalEarnings: number
  createdAt: string
  updatedAt: string
}

export interface GetReportsParams {
  page?: number
  limit?: number
  project?: string
}

export interface GetReportsResponse {
  data: Report[]
  total: number
  page: number
  limit: number
}

export const getAllReports = async (
  params?: GetReportsParams
): Promise<GetReportsResponse> => {
  const response = await api.get('/reports', { params })
  return response.data
}

export const createReport = async (
  data: CreateReportPayload
): Promise<Report> => {
  const response = await api.post('/reports', data)
  return response.data
}

export const deleteReport = async (id: string): Promise<void> => {
  await api.delete(`/reports/${id}`)
}
