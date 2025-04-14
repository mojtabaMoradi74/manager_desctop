import {Box} from '@mui/material'
import {Link} from 'react-router-dom'
import LazyImageComponent from './LazyImageComponent'

const ImageWithText = ({image, title, subtitle, isCircle = false, isSmall = false, link}) => {
  console.log({image})
  return (
    <div className='flex items-center'>
      {image ? (
        <Box
          sx={{
            height: isSmall ? '50px' : '90px',
            width: isSmall ? '50px' : '90px',
            minWidth: isSmall ? '50px' : '90px',
            objectFit: 'cover',
            borderRadius: isCircle ? '50%' : '6px',
            mr: '1rem',
            overflow: 'hidden',
          }}
        >
          <LazyImageComponent
            file={image}
            ratio='4/3'
            // src={image?.url}
            // key={image?.name}
            // mimeType={image?.mimetype}
            // alt=''
          />
        </Box>
      ) : (
        ''
      )}
      {(title || subtitle) && (
        <div className='flex justify-start flex-col '>
          {title && link ? (
            <Link to={link} className='fw-bold fs-6'>
              {title}
            </Link>
          ) : (
            <div className='text-dark fw-bold text-hover-primary fs-6'>{title}</div>
          )}
          {subtitle && (
            <span
              className='text-muted fw-bold text-muted d-block fs-7'
              style={{whiteSpace: 'break-spaces', overflow: 'clip', maxWidth: '250px'}}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default ImageWithText
