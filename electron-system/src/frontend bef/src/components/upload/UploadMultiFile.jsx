/* eslint-disable */
import PropTypes from 'prop-types'
import {useDropzone} from 'react-dropzone'
// @mui
import {styled} from '@mui/material/styles'
import {Box} from '@mui/material'
//
import BlockContent from './BlockContent'
import RejectionFiles from './RejectionFiles'
import MultiFilePreview from './MultiFilePreview'
import {useMemo, useRef} from 'react'

// ----------------------------------------------------------------------

const DropZoneStyle = styled('div')(({theme}) => ({
  outline: 'none',
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral,
  border: `1px dashed ${theme.palette.grey[500_32]}`,
  '&:hover': {opacity: 0.72, cursor: 'pointer'},
}))

// ----------------------------------------------------------------------

UploadMultiFile.propTypes = {
  error: PropTypes.bool,
  showPreview: PropTypes.bool,
  files: PropTypes.array,
  onRemove: PropTypes.func,
  onRemoveAll: PropTypes.func,
  helperText: PropTypes.node,
  sx: PropTypes.object,
}

export default function UploadMultiFile({
  error,
  showPreview = false,
  files,
  onRemove,
  onRemoveAll,
  helperText,
  sx,
  accept,
  title,
  description,
  ...other
}) {
  const inputRef = useRef()
  const acceptedImage = accept.includes('image')
  const acceptedVideo = accept.includes('video')

  const supportedImage = ['.png', '.jpg', '.jpeg', '.gif', '.x-ms-bmp', '.webp', '.avif']
  const supportedVideo = ['.mp4']

  const supportFormat = useMemo(() => {
    const final = []
    if (acceptedImage) final.push(...supportedImage)
    if (acceptedVideo) final.push(...supportedVideo)
    return final.join(' , ')
  }, [accept])

  let isImage = false //= file?.location ? file?.mimetype?.includes('image') : file?.type?.includes('image')
  let isVideo = false //= file?.location ? file?.mimetype?.includes('video') : file?.type?.includes('video')

  for (let index = 0; index < files?.length; index++) {
    const file = files[index]
    if (file?.location ? file?.mimetype?.includes('image') : file?.type?.includes('image'))
      isImage = true
    if (file?.location ? file?.mimetype?.includes('video') : file?.type?.includes('video'))
      isVideo = true
  }

  console.log('* * * UploadImage :', {
    supportFormat,
    acceptedImage,
    acceptedVideo,
    isImage,
    isVideo,
  })

  const onDrop = (data) => {
    other.onDrop(data)
    inputRef.current.value = ''
  }

  const {getRootProps, getInputProps, isDragActive, isDragReject, fileRejections} = useDropzone({
    ...other,
    onDrop,
  })

  return (
    <Box sx={{width: '100%', ...sx}}>
      <DropZoneStyle
        {...getRootProps()}
        sx={{
          ...(isDragActive && {opacity: 0.72}),
          ...((isDragReject || error) && {
            color: 'error.main',
            borderColor: 'error.light',
            bgcolor: 'error.lighter',
          }),
        }}
      >
        <input ref={inputRef} {...getInputProps()} disabled={other.disabled} />

        <BlockContent {...{title, description}} />
      </DropZoneStyle>

      {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} />}

      <MultiFilePreview
        files={files}
        showPreview={showPreview}
        onRemove={onRemove}
        onRemoveAll={onRemoveAll}
      />

      {helperText && helperText}
    </Box>
  )
}
