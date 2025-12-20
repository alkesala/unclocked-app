import { api } from '../lib/api'
import type { CreateTimeEntryPayload } from '@unclocked-app/shared'

export const createTimeEntry = async (
  entryData: CreateTimeEntryPayload
) => {
  const response = await api.post('/time-entries', entryData)
  return response.data
}
