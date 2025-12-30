import { api } from '../lib/api'
import type { CreateTimeEntryPayload, UpdateTimeEntryPayload } from '@unclocked-app/shared'

export interface TimeEntry {
  id: string
  account: string
  project: string
  startedAt: string
  endedAt?: string
  note?: string
  hourlyRate?: number
  createdAt: string
  updatedAt: string
}

export interface GetTimeEntriesParams {
  page?: number
  limit?: number
  project?: string
}

export interface GetTimeEntriesResponse {
  data: TimeEntry[]
  total: number
  page: number
  limit: number
}

export const createTimeEntry = async (
  entryData: CreateTimeEntryPayload
): Promise<TimeEntry> => {
  const response = await api.post('/time-entries', entryData)
  return response.data
}

export const getAllTimeEntries = async (
  params?: GetTimeEntriesParams
): Promise<GetTimeEntriesResponse> => {
  const response = await api.get('/time-entries', { params })
  return response.data
}

export const deleteTimeEntry = async (id: string): Promise<void> => {
  await api.delete(`/time-entries/${id}`)
}

export const endTimeEntry = async (
  id: string,
  endedAt: string
): Promise<TimeEntry> => {
  const response = await api.patch(`/time-entries/end/${id}`, { endedAt })
  return response.data
}

export const updateTimeEntry = async (
  id: string,
  data: UpdateTimeEntryPayload
): Promise<TimeEntry> => {
  const response = await api.patch(`/time-entries/${id}`, data)
  return response.data
}
