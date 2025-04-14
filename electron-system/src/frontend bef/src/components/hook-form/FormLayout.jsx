import {Grid} from '@mui/material'

const FormLayout = ({main, side}) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={side ? 8 : 12} className={'flex !flex-col gap-5'}>
        {main}
      </Grid>

      {side ? (
        <Grid item xs={12} md={4} className={'flex !flex-col gap-5'}>
          {side}
        </Grid>
      ) : (
        ''
      )}
    </Grid>
  )
}

export default FormLayout
