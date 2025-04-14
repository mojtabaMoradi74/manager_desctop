import {Dialog, DialogTitle, DialogContent, Box} from '@mui/material'
import MediaContainer from 'src/pages/media'

const GalleryModal = ({show, toggle, onChange, value, isMulti}) => {
  // console.log({ show, toggle, onClick, value, isGalleryDisabled, FOLDER_SLUG, isMulti });
  return (
    <Dialog maxWidth={'90%'} open={show} onClose={toggle} keyboard scrollable>
      <Box
        sx={{
          width: '90vw',
        }}
      >
        <DialogTitle closeButton className='bg-white'>
          <div className='w-full'>Files</div>
        </DialogTitle>
        <DialogContent className='bg-white'>
          <MediaContainer
            forGallery
            {...{
              onChange,
              value,
              isMulti,
            }}
          />
        </DialogContent>
      </Box>
    </Dialog>
  )
}

export default GalleryModal
