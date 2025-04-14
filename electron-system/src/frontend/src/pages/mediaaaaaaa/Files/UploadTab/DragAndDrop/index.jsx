import {memo, useEffect, useRef, useState} from 'react'
import {toast} from 'react-toastify'
import styles from './DragAndDrop.module.scss'

const DragAndDrop = ({handleSelectFile, children}) => {
  //  ----------------------------------------- VARIABLES/STATES/REFS ----------------------------------------- //
  const dropRef = useRef(null)
  const dragRef = useRef(null)
  const formats = ['jpg', 'jpeg', 'png']
  const [dragging, setDragging] = useState(false)

  //  ----------------------------------------- EFFECTS ----------------------------------------- //
  useEffect(() => {
    dropRef?.current?.addEventListener('dragover', handleDragOver)
    dropRef?.current?.addEventListener('drop', handleDrop)
    dropRef?.current?.addEventListener('dragenter', handleDragEnter)
    dropRef?.current?.addEventListener('dragleave', handleDragLeave)

    return () => {
      dropRef?.current?.removeEventListener('dragover', handleDragOver)
      dropRef?.current?.removeEventListener('drop', handleDrop)
      dropRef?.current?.removeEventListener('dragenter', handleDragEnter)
      dropRef?.current?.removeEventListener('dragleave', handleDragLeave)
    }
  }, [])

  //  ----------------------------------------- HANDLERS ----------------------------------------- //
  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.target !== dragRef.current) {
      setDragging(true)
    }
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.target === dragRef.current) {
      setDragging(false)
    }
  }
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const files = [...e.dataTransfer.files]
    if (files.length > 1) {
      toast.error('Only 1 file at a time!')
      setDragging(false)
      return
    }

    if (
      formats &&
      files.some(
        (file) => !formats.some((format) => file.name.toLowerCase().endsWith(format.toLowerCase()))
      )
    ) {
      toast.error(`Only "${formats.join(', ')}" formats are acceptable !`)
      setDragging(false)
      return
    }

    if (files && files.length) {
      //   console.log({ files }, "dropped files");
      handleSelectFile(files[0])
    }

    setDragging(false)
  }

  return (
    <div className={styles.dragAndDropWrapper} ref={dropRef}>
      {dragging && (
        <div className={styles.dragAndDropOverlay} ref={dragRef}>
          <p>Drop it here . . .</p>
        </div>
      )}
      {children}
    </div>
  )
}

export default memo(DragAndDrop)
