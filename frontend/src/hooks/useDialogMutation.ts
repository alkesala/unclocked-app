import { useState } from 'react'
import type { UseMutationResult } from '@tanstack/react-query'

export interface UseDialogMutationOptions {
  mutation: UseMutationResult<any, Error, any, unknown>
  onSuccess?: () => void
  onError?: (error: Error) => void
  defaultErrorMessage?: string
}

export interface UseDialogMutationResult {
  error: string | null
  setError: (error: string | null) => void
  clearError: () => void
  isPending: boolean
  handleMutate: <T>(data: T) => void
}

/**
 * Custom hook to manage mutations in dialogs
 *
 * Handles error state, loading state, and success/error callbacks
 *
 * @param options - Configuration options
 * @returns Mutation management utilities
 *
 * @example
 * const createMutation = useCreateProject()
 * const { error, setError, clearError, isPending, handleMutate } = useDialogMutation({
 *   mutation: createMutation,
 *   onSuccess: () => onOpenChange(false),
 *   defaultErrorMessage: "Failed to create project",
 * })
 *
 * const handleSubmit = (e: React.FormEvent) => {
 *   e.preventDefault()
 *   clearError()
 *
 *   if (!formState.name) {
 *     setError("Project name is required")
 *     return
 *   }
 *
 *   handleMutate({ name: formState.name })
 * }
 */
export function useDialogMutation(
  options: UseDialogMutationOptions
): UseDialogMutationResult {
  const { mutation, onSuccess, onError, defaultErrorMessage } = options
  const [error, setError] = useState<string | null>(null)

  const clearError = () => setError(null)

  const handleMutate = <T,>(data: T) => {
    mutation.mutate(data, {
      onSuccess: () => {
        clearError()
        onSuccess?.()
      },
      onError: (err: Error) => {
        const errorMessage = err.message || defaultErrorMessage || 'An error occurred'
        setError(errorMessage)
        onError?.(err)
      },
    })
  }

  return {
    error,
    setError,
    clearError,
    isPending: mutation.isPending,
    handleMutate,
  }
}
