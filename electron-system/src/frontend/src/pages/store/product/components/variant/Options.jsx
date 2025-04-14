import RHFSelector from 'src/components/hook-form/RHFSelector'
import {useState} from 'react'
import {Button} from '@mui/material'
import {useTranslation} from 'react-i18next'

const ProductVariantOption = ({handleAddNewVariant, handleCreateForAllVariants}) => {
  const [state, setState] = useState()
  const {t} = useTranslation()
  const options = [
    {
      label: 'Add variation',
      value: 1,
    },
    {
      label: 'Create variations for all attribute',
      value: 2,
    },
  ]

  const handleChange = () => {
    console.log({state}, state?.value)
    if (!state) return
    switch (state.value) {
      case 1:
        handleAddNewVariant()
        break
      case 2:
        handleCreateForAllVariants()
        break
      default:
        break
    }
  }

  return (
    <div className='flex gap-2'>
      <div className='w-full'>
        <RHFSelector
          custom
          {...{
            name: 'a',
            label: 'setting',
            placeholder: 'Select multi attribute',
            options,
            // element: {
            //     right: <div className="d-flex" > <div className="mr-2" /> <Badge
            //     label
            //     disabled={!state} onClick={handleChange} className="d-flex align-items-center cursor-pointer" bg="primary"/> </div>
            // },
            onChange: setState,
            value: state,
          }}
        />
      </div>

      <Button onClick={handleChange} variant='outlined' color='success'>
        {t('go')}
      </Button>
    </div>
  )
}

export default ProductVariantOption
