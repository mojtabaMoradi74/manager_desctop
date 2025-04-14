import {useRef} from 'react'

const useDebounce = (props) => {
  // Debounced function
  const timeoutId = useRef()

  const debounce = (value, setDebounce) => {
    clearTimeout(timeoutId.current)
    timeoutId.current = setTimeout(() => {
      ;(props?.setDebounce || setDebounce)(value)
    }, 500)
  }

  return {
    debounce,
  }
}
export default useDebounce
