// @mui
import {Box, Typography, Stack} from '@mui/material'
import isString from 'lodash/isString'
// assets
import {UploadIllustration} from '../../assets'
import Image from '../Image'
import LazyImageComponent from '../LazyImageComponent'

// ----------------------------------------------------------------------

export default function BlockContent({title, description, file}) {
  // console.log('* * * UploadImage :', {
  //   file,
  //   src: isString(file) ? file : file?.location || file?.preview,
  // })
  return (
    <Stack
      spacing={2}
      alignItems='center'
      justifyContent='center'
      direction={{xs: 'column', md: 'row'}}
      sx={{width: 1, textAlign: {xs: 'center', md: 'left'}}}
    >
      {file ? (
        <div className='w-[100px]'>
          <LazyImageComponent
            src={isString(file) ? file : file?.location || file.preview}
            mimeType={file?.mimetype || file?.type}
          />
        </div>
      ) : (
        // <Image
        //   alt="file preview"
        //   src={isString(file) ? file : file.preview}
        //   sx={{
        //     top: 8,
        //     left: 8,
        //     borderRadius: 1,
        //     // position: 'absolute',
        //     // width: 'calc(100% - 16px)',
        //     // height: 'calc(100% - 16px)',
        //     width: '220px',
        //     height: '220px',
        //   }}
        // />
        <UploadIllustration sx={{width: 220}} />
      )}

      <Box sx={{p: 3}}>
        <Typography gutterBottom variant='h5'>
          {/**/}
          {title || ' Drop or Select file '}
        </Typography>
        <Typography variant='body2' sx={{color: 'text.secondary'}}>
          Drop files here or click&nbsp;
          <Typography
            variant='body2'
            component='span'
            sx={{color: 'primary.main', textDecoration: 'underline'}}
          >
            browse
          </Typography>
          &nbsp;thorough your machine
        </Typography>
      </Box>
    </Stack>
  )
}
