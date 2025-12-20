import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { CreateTimeEntryPayload } from '@unclocked-app/shared'
import {
  createTimeEntry,
  deleteTimeEntry,
  endTimeEntry,
  getAllTimeEntries,
  type GetTimeEntriesParams,
} from '../api/timeEntry'

export const useTimeEntries = (params?: GetTimeEntriesParams) => {
  return useQuery({
    queryKey: ['timeEntries', params],
    queryFn: () => getAllTimeEntries(params),
  })
}

export const useCreateTimeEntry = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTimeEntryPayload) => createTimeEntry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] })
      toast.success('Time entry created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create time entry')
    },
  })
}

export const useDeleteTimeEntry = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteTimeEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] })
      toast.success('Time entry deleted')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete time entry')
    },
  })
}

export const useEndTimeEntry = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, endedAt }: { id: string; endedAt: string }) =>
      endTimeEntry(id, endedAt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] })
      toast.success('Time entry ended')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to end time entry')
    },
  })
}
