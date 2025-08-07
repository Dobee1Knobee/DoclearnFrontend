export interface ComboboxOptionsType {
  id: string
  label: string
  value?: any
}

export interface ComboboxProps {
  options: ComboboxOptionsType[]
  value?: ComboboxOptionsType | null
  onChange: (option: ComboboxOptionsType | null) => void
  placeholder?: string
  error?: boolean
  searchable?: boolean
  onBlur?: () => void
  disabled?: boolean
}
