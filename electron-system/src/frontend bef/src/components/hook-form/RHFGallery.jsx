import PropTypes from 'prop-types'
// form
import {useFormContext, Controller} from 'react-hook-form'
// @mui
import {Button, Grid, IconButton, InputAdornment, TextField} from '@mui/material'

import {useState} from 'react'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import LazyImageComponent from '../LazyImageComponent'
import GalleryModal from '../galleryModal'
// ----------------------------------------------------------------------

RHFGallery.propTypes = {
  name: PropTypes.string,
}

export default function RHFGallery({name, label, required, isMulti, ...other}) {
  const [state, setState] = useState(false)
  const handleToggle = () => setState((p) => !p)

  const {control} = useFormContext()

  return (
    <div className={`flex flex-col`}>
      <div className={` flex items-center justify-between mb-[30px]`}>
        <p className='capitalize'>
          {label || 'image'}
          {required && ' *'}
        </p>
        <div className={` top-[10px] right-[10px] z-10`}>
          <Button variant='contained' color='success' onClick={handleToggle}>
            <AddIcon />
          </Button>
        </div>
      </div>
      <Controller
        name={name}
        control={control}
        render={({field: {value, onChange}, fieldState: {error}}) => {
          const handleRemove = (x) => {
            const newValue = isMulti ? value?.filter((y) => y.id !== x.id) : null
            console.log('* * * RHFGallery : ', {newValue})
            onChange(newValue)
          }
          const handleChange = (param) => {
            onChange(param)
            handleToggle()
          }

          // console.log({ value, error, errors, name, err }, errors.variants?.[1], "GalleryComponent");

          return (
            <>
              <GalleryModal
                {...{isMulti, show: state, toggle: handleToggle, value, onChange: handleChange}}
              />
              {isMulti ? (
                value?.length ? (
                  <Grid container spacing={2}>
                    {value?.map((x) => {
                      return (
                        <Grid item xs={6} className={`relative flex p-[5px] border`} key={x.id}>
                          {x ? (
                            <div className={`absolute top-[10px] right-[10px] z-10`}>
                              <Button
                                variant='contained'
                                color='error'
                                onClick={() => handleRemove(x)}
                                size='small'
                              >
                                <CloseIcon />
                              </Button>
                            </div>
                          ) : (
                            ''
                          )}

                          {<LazyImageComponent file={x} alt='thumbnail photo' />}
                        </Grid>
                      )
                    })}
                  </Grid>
                ) : (
                  ''
                )
              ) : value ? (
                <div className={`relative flex p-[5px] border`}>
                  {value ? (
                    <div className={`absolute top-[10px] right-[10px] z-10`}>
                      <Button variant='contained' color='error' onClick={handleRemove}>
                        <CloseIcon />
                      </Button>
                    </div>
                  ) : (
                    ''
                  )}
                  {value ? <LazyImageComponent file={value} alt='thumbnail photo' /> : ''}
                </div>
              ) : (
                ''
              )}{' '}
              {error ? <p className={'text-danger my-1'}>{error?.message}</p> : ''}
            </>
          )
        }}
      />
    </div>
  )
}
