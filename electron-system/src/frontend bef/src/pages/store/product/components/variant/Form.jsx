import {useState} from 'react'
import Grid from '@mui/material/Grid'
import Collapse from '@mui/material/Collapse'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import {useFormContext, useWatch} from 'react-hook-form'
import RHFSelector from 'src/components/hook-form/RHFSelector'
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import validation from '../../Add/validation'
import {IconButton} from '@mui/material'
import {RHFCheckbox, RHFTextField} from 'src/components/hook-form'
import PriceManager from './PriceManager'
import shippingClassSelector from '../../../../shippings/shippingClass/selector'
import RHFCkEditor from 'src/components/hook-form/RHFCkEditor'
import RHFGallery from 'src/components/hook-form/RHFGallery'

const ProductVariantForms = ({baseName, index}) => {
  const [collapse, setCollapse] = useState()
  const contextParentForm = useFormContext()

  const watchAttributes = useWatch({
    control: contextParentForm.control,
    name: validation.fieldNames.attributes,
  })

  const watchStock = contextParentForm.watch(baseName + validation.fieldNames.manageStock)
  const watchManageShipping = contextParentForm.watch(
    baseName + validation.fieldNames.manageShipping
  )
  // const watchAttributes = useWatch({
  //     control: contextParentForm.control,
  //     name: validation.fieldNames.attributes,
  //   })
  //   const watchVariants = useWatch({
  //     control: contextParentForm.control,
  //     name: validation.fieldNames.variants,
  //   })
  //   const currentVariants = watch(validation.fieldNames.variants)

  return (
    <Card className='flex flex-col gap-4 p-[20px] border rounded-[8px] overflow-visible'>
      <Grid spacing={2} container>
        {watchAttributes?.map((x, i) => {
          if (!x.usedForVariation) return <></>
          return (
            <Grid xs={12} md={6} item>
              <RHFSelector
                {...{
                  name:
                    baseName +
                    `${validation.fieldNames.attributes}.${i}.${validation.fieldNames.attributeValues}`,
                  options: watchAttributes[i]?.attributeValues,
                  label: x.label,
                }}
              />
            </Grid>
          )
        })}
      </Grid>
      <div className='flex justify-end'>
        <div className='flex gap-2'>
          <IconButton>
            <DragIndicatorIcon fontSize='11' />
          </IconButton>
          <IconButton onClick={() => setCollapse((p) => !p)}>
            <ExpandCircleDownIcon fontSize='11' />
          </IconButton>
        </div>
      </div>

      <Collapse in={collapse}>
        <CardContent className='border-t flex flex-col gap-4'>
          <Grid spacing={4} container>
            <Grid xs={6} item>
              <RHFCheckbox
                {...{
                  name: baseName + `${validation.fieldNames.manageStock}`,
                  label: 'manageStock',
                }}
              />
            </Grid>
            <Grid xs={6} item>
              <RHFCheckbox
                {...{
                  name: baseName + `${validation.fieldNames.manageShipping}`,
                  label: 'manageShipping',
                }}
              />
            </Grid>
            <Grid xs={12} item>
              <RHFTextField
                {...{
                  name: baseName + `${validation.fieldNames.title}`,
                  label: 'title',
                }}
              />
            </Grid>
            <Grid xs={12} item>
              <RHFTextField
                {...{
                  name: baseName + `${validation.fieldNames.sku}`,
                  label: 'sku',
                }}
              />
            </Grid>

            {watchStock ? (
              <Grid xs={12} item>
                <RHFTextField
                  {...{
                    name: baseName + `${validation.fieldNames.stockCount}`,
                    label: 'stockCount',
                    type: 'number',
                  }}
                />
              </Grid>
            ) : (
              ''
            )}

            <PriceManager {...{baseName, index}} />
          </Grid>

          {watchManageShipping ? (
            <>
              <Grid xs={12} item>
                <shippingClassSelector.Element
                  {...{
                    name: baseName + `${validation.fieldNames.shippingClass}`,
                    label: 'shippingClass',
                  }}
                />
              </Grid>
              <Grid xs={12} item>
                <RHFTextField
                  {...{
                    name: baseName + `${validation.fieldNames.weight}`,
                    label: 'weight (kg)',
                  }}
                />
              </Grid>
              <div className='flex flex-col gap-3 max-w-full'>
                <div>Dimensions (cm)</div>
                <Grid className='' container spacing={4}>
                  <Grid xs={4} item>
                    <RHFTextField
                      {...{
                        name: baseName + `${validation.fieldNames.length}`,
                        label: 'length',
                      }}
                    />
                  </Grid>

                  <Grid xs={4} item>
                    <RHFTextField
                      {...{
                        name: baseName + `${validation.fieldNames.width}`,
                        label: 'width',
                      }}
                    />
                  </Grid>

                  <Grid xs={4} item>
                    <RHFTextField
                      {...{
                        name: baseName + `${validation.fieldNames.height}`,
                        label: 'height',
                      }}
                    />
                  </Grid>
                </Grid>
              </div>
            </>
          ) : (
            ''
          )}
          <Grid spacing={4} container>
            <Grid item xs={12} md={12}>
              <RHFCkEditor
                required
                name={baseName + validation.fieldNames.description}
                label={'description'}
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <RHFGallery label={'thumbnail'} name={baseName + validation.fieldNames.image} />
            </Grid>

            <Grid item xs={12} md={12}>
              <RHFGallery
                label={'galleries'}
                isMulti
                name={baseName + validation.fieldNames.images}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  )
}

export default ProductVariantForms
