import {useEffect, useRef} from 'react'
import {useDispatch} from 'react-redux'
import modalSlice from 'src/redux/slices/modal'

const useModal = () => {
  const modalRef = useRef()
  const dispatch = useDispatch()

  // init modal
  useEffect(() => {
    dispatch(modalSlice.actions.setData(modalRef.current))
  }, [dispatch])

  return modalRef
}

export default useModal
