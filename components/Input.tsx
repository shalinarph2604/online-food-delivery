import * as React from "react"

interface InputProps {
  placeholder?: string
  value?: string
  type?: string
  disabled?: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  type,
  disabled,
  onChange,
}) => {
  return (
    <input 
      disabled={disabled}
      onChange={onChange}
      value={value}
      type={type}
      placeholder={placeholder}
    />
  )
}

export default Input