import { useState } from 'react'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const clear = () => {
    setValue('')
  }

  const properties = {
    type,
    value,
    onChange,
    clear
  }
  Object.defineProperty(properties, 'clear', {
    enumerable: false
  })

  return properties
}

export default useField