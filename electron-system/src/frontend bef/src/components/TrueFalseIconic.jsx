import {CheckCircle, Cancel} from '@mui/icons-material'
import {Box} from '@mui/material'

const TrueFalseIconic = ({value}) => {
  return (
    <div className='flex items-center justify-content-between'>
      {value ? (
        <Box sx={{color: 'success.main'}}>
          <CheckCircle fontSize='small' />
        </Box>
      ) : (
        <Box sx={{color: 'error.main'}}>
          <Cancel fontSize='small' />
        </Box>
      )}
    </div>
  )
}

export default TrueFalseIconic
