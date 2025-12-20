import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { CreateReportPayload } from '@unclocked-app/shared'
import {
  createReport,
  deleteReport,
  getAllReports,
  type GetReportsParams,
} from '../api/reports'

export const useReports = (params?: GetReportsParams) => {
  return useQuery({
    queryKey: ['reports', params],
    queryFn: () => getAllReports(params),
  })
}

export const useCreateReport = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateReportPayload) => createReport(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      toast.success('Report created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create report')
    },
  })
}

export const useDeleteReport = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      toast.success('Report deleted')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete report')
    },
  })
}
