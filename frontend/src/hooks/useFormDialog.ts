import { useState, useEffect } from 'react'

export interface UseFormDialogOptions<T> {
  open: boolean
  defaultValues: T | (() => T)  // Static or factory function
  dependencies?: any[]           // Additional reset triggers
}

export interface UseFormDialogResult<T> {
  formState: T
  setFormState: React.Dispatch<React.SetStateAction<T>>
  resetForm: () => void
  updateField: <K extends keyof T>(field: K, value: T[K]) => void
}

/**
 * Custom hook to manage form state in dialogs
 *
 * Automatically resets form when dialog opens or dependencies change
 *
 * @param options - Configuration options
 * @returns Form state management utilities
 *
 * @example
 * const { formState, updateField } = useFormDialog({
 *   open,
 *   defaultValues: { name: '', description: '' },
 * })
 *
 * // In JSX
 * <Input
 *   value={formState.name}
 *   onChange={(e) => updateField('name', e.target.value)}
 * />
 */
export function useFormDialog<T extends Record<string, any>>(
  options: UseFormDialogOptions<T>
): UseFormDialogResult<T> {
  const { open, defaultValues, dependencies = [] } = options

  // Get initial values (handle both static and factory)
  const getInitialValues = (): T => {
    return typeof defaultValues === 'function'
      ? (defaultValues as () => T)()
      : defaultValues
  }

  const [formState, setFormState] = useState<T>(getInitialValues)

  // Reset form when dialog opens or dependencies change
  useEffect(() => {
    if (open) {
      setFormState(getInitialValues())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, ...dependencies])

  const resetForm = () => {
    setFormState(getInitialValues())
  }

  const updateField = <K extends keyof T>(field: K, value: T[K]) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  return {
    formState,
    setFormState,
    resetForm,
    updateField,
  }
}
