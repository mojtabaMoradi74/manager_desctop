/* eslint-disable no-nested-ternary */
import {useMemo, useRef} from 'react'
import PropTypes from 'prop-types'
import isString from 'lodash/isString'
import {useDropzone} from 'react-dropzone'
// @mui
import {styled} from '@mui/material/styles'
import {Box, Stack, Button} from '@mui/material'
//
import Image from '../Image'
import RejectionFiles from './RejectionFiles'
import BlockContent from './BlockContent'

// ----------------------------------------------------------------------

const DropZoneStyle = styled('div')(({theme}) => ({
  outline: 'none',
  overflow: 'hidden',
  position: 'relative',
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('padding'),
  backgroundColor: theme.palette.background.neutral,
  border: `1px dashed ${theme.palette.grey[500_32]}`,
  '&:hover': {opacity: 0.72, cursor: 'pointer'},
}))

const DropZoneStyle1 = styled('div')(({theme}) => ({
  outline: 'none',
  overflow: 'hidden',
  position: 'relative',
  padding: theme.spacing(0, 1),
  paddingRight: 0,
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('padding'),
  // backgroundColor: theme.palette.background.neutral,
  border: `1px solid ${theme.palette.grey[500_32]}`,
  '&:hover': {opacity: 0.72, cursor: 'pointer'},
}))

// ----------------------------------------------------------------------

UploadSingleFile.propTypes = {
  error: PropTypes.bool,
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  helperText: PropTypes.node,
  sx: PropTypes.object,
}

export default function UploadSingleFile({
  error = false,
  file,
  helperText,
  sx,
  title,
  description,
  accept,
  label,
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

  const isImage = file?.location ? file?.mimetype?.includes('image') : file?.type?.includes('image')
  const isVideo = file?.location ? file?.mimetype?.includes('video') : file?.type?.includes('video')

  console.log('* * * UploadImage :', {
    file,
    supportFormat,
    acceptedImage,
    acceptedVideo,
    isImage,
    isVideo,
  })

  const onDrop = (data) => {
    other.onDrop(data)
    // inputRef.current.value = ''
  }

  const {getRootProps, getInputProps, isDragActive, isDragReject, fileRejections} = useDropzone({
    multiple: false,
    ...other,
    onDrop,
    accept: supportFormat,
  })

  return (
    <Box sx={{width: '100%', ...sx}}>
      <label
        htmlFor='a'
        className={[
          'leading-[20px] min-h-[20px] text-[14px] ',
          error ? 'text-error-primary' : 'text-gray-800',
        ].join(' ')}
      >
        {label}
      </label>

      <DropZoneStyle
        {...getRootProps()}
        sx={{
          bgcolor: '#DAFBFF',
          ...(isDragActive && {opacity: 0.72}),
          ...((isDragReject || error) && {
            color: 'error.main',
            borderColor: 'error.light',
            bgcolor: 'error.lighter',
          }),
          // ...(file && {
          //   padding: '12% 0',
          // }),
        }}
      >
        {/* {file && (
          <Image
            alt="file preview"
            src={isString(file) ? file : file.preview}
            sx={{
              top: 8,
              left: 8,
              borderRadius: 1,
              // position: 'absolute',
              // width: 'calc(100% - 16px)',
              // height: 'calc(100% - 16px)',
              width: '150px',
              height: '150px',
            }}
          />
        )} */}
        <input ref={inputRef} {...getInputProps()} disabled={other.disabled} />

        <BlockContent {...{title, description, file}} />
      </DropZoneStyle>

      {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} />}

      {helperText && helperText}
    </Box>
  )
}

// ----------------------------------------------------------------------

UploadSingleFile1.propTypes = {
  title: PropTypes.string,
  error: PropTypes.bool,
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  helperText: PropTypes.node,
  sx: PropTypes.object,
}

export function UploadSingleFile1({
  title = 'آپلود تصویر',
  error = false,
  file,
  helperText,
  sx,
  ...other
}) {
  const {getRootProps, getInputProps, isDragActive, isDragReject, fileRejections} = useDropzone({
    multiple: false,
    ...other,
  })

  return (
    <Box sx={{width: '100%', ...sx}}>
      <DropZoneStyle1
        {...getRootProps()}
        sx={{
          ...(isDragActive && {opacity: 0.72}),
          ...((isDragReject || error) && {
            color: 'error.main',
            borderColor: 'error.light',
            bgcolor: 'error.lighter',
          }),
          ...(file &&
            {
              // padding: '12% 0',
            }),
        }}
      >
        <input {...getInputProps()} />

        {/* <BlockContent /> */}

        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
          {file ? (isString(file) ? 'image.png' : file?.name) : title}

          <Button
            variant='contained'
            sx={{
              fontSize: '14px',
              paddingTop: '15px',
              paddingBottom: '15px',
            }}
          >
            آپلود تصویر
          </Button>
        </Stack>

        {/* {file && (
          <Image
            alt="file preview"
            src={isString(file) ? file : file.preview}
            sx={{
              top: 8,
              left: 8,
              borderRadius: 1,
              position: 'absolute',
              width: 'calc(100% - 16px)',
              height: 'calc(100% - 16px)',
            }}
          />
        )} */}
      </DropZoneStyle1>

      {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} />}

      {helperText && helperText}
    </Box>
  )
}
