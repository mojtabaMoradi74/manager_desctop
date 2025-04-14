/* eslint-disable */

import {useRef, useState} from 'react'
import styles from '../index.module.scss'
import swal from 'sweetalert'

import api from 'src/services/api.jsx'
import {useMutationCustom} from 'src/utils/reactQueryHooks'
import {yupResolver} from '@hookform/resolvers/yup'
import {fieldNames, validation} from './validation'
import {useForm} from 'react-hook-form'
import {StatusData} from 'src/components/StatusComponent/types'
import LazyImageComponent from 'src/components/LazyImageComponent'
import {toast} from 'react-toastify'
import axiosInstance from 'src/utils/axios'
import {FormProvider, RHFTextField} from 'src/components/hook-form'
import {Button, Chip, IconButton, ImageListItem, ImageListItemBar} from '@mui/material'

import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import {useTranslation} from 'react-i18next'

const Files = ({data, onClick, active, selectable, forGallery}) => {
  const {t} = useTranslation()

  const [edit, setEdit] = useState()

  const methods = useForm({
    resolver: yupResolver(validation()),
    mode: 'onSubmit',
  })
  const {
    register,
    handleSubmit,
    formState: {errors},
    getValues,
    setValue,
    control,
    reset,
    watch,
  } = methods
  const handleEditButton = () => {
    reset({
      title: data.title,
    })
    setEdit((p) => !p)
  }

  //  ----------------------------------------- UPDATING ----------------------------------------- //
  const updatingFile = async (params) =>
    await axiosInstance().put(api.gallery.base + '/' + data.id, params)

  const onSuccessUpdating = () => {
    toast.success(t('successfully'))
    handleEditButton()
    // resetFields();
    // handleCancelSelectedImage();
  }

  const {
    isLoading,
    data: updatedData,
    mutate,
  } = useMutationCustom({
    name: `${api.gallery.base}_update`,
    url: updatingFile,
    invalidQuery: `file_gets`,
    onSuccess: onSuccessUpdating,
  })
  // ---------------------------------------
  const changeStatus = async (params) =>
    await axiosInstance().put(api['gallery'].changeStatus, params)

  const onSuccessChangeStatusMutation = () => {
    toast.success(t('successfully'))
    // resetFields();
    // handleCancelSelectedImage();
  }

  const changeStatusMutation = useMutationCustom({
    name: 'gallery_changeStatus',
    url: changeStatus,
    invalidQuery: `file_gets`,
    onSuccess: onSuccessChangeStatusMutation,
    onError: () => modal.hide(),
  })

  const handleDeleteButton = () => {
    swal({
      // title: 'Are you sure?',
      // text: `You want to delete "${data.title}" ? `,
      title: t('are you sure'),
      text: t(`You want to {{status}} this {{title}}`, {status: t('delete')}),
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willBe) => {
      if (willBe) {
        changeStatusMutation.mutate({data: [data.id], status: StatusData.delete.value})
      }
    })
  }

  // ---------------------------------------

  const onSubmit = () => {
    const values = getValues()
    const requestedData = {
      folder: data?.folder?.id,
      title: values?.title,
    }
    mutate(requestedData)
  }
  console.log({active})
  return (
    // className={'w-[40%]'}
    // <div key={data.img}>
    //   <LazyImageComponent
    //     file={data}
    //     // srcSet={`${data.img}`}
    //     // src={`${data.img}`}
    //     alt={data.title}
    //     loading='lazy'
    //   />

    //   <div className='flex flex-col gap-2'>
    //     {edit ? (
    //       <form onSubmit={handleSubmit(onSubmit)} id={'form-container '} noValidate>
    //         <div className={['flex flex-col p-1 h-full flex-grow-1 gap-3'].join(' ')}>
    //           <div className='flex-grow-1'>
    //             <RHFTextField
    //               required
    //               {...{
    //                 name: fieldNames.title,
    //                 placeholder: 'title',
    //               }}
    //               groupClass={'mb-0'}
    //             />
    //           </div>
    //           <div className='flex gap-1 ml-auto'>
    //             <Button
    //               block
    //               variant='contained'
    //               color='warning'
    //               htmlType='button'
    //               disabled={isLoading}
    //               onClick={handleEditButton}
    //             >
    //               {'cancel'}
    //             </Button>
    //             <Button
    //               block
    //               variant='contained'
    //               color='success'
    //               htmlType='submit'
    //               loading={isLoading}
    //             >
    //               {!isLoading ? 'Publish' : 'Loading...'}
    //             </Button>
    //           </div>
    //         </div>
    //       </form>
    //     ) : (
    //       <div
    //         className={[
    //           // styles.imageDetailsWrapper_detailsWrapper,
    //           'flex mt-3 border-top p-2 flex-col gap-3',
    //         ].join(' ')}
    //       >
    //         <div className={`w-full flex flex-col gap-2`}>
    //           <h5 className='overflow-hidden text-ellipsis w-full'>{data?.title}</h5>
    //           <p>{data?.mimetype}</p>
    //           <div>
    //             <Chip
    //               // color='success'
    //               // variant='contained'
    //               size='small'
    //               label={data?.folder?.title}
    //             />
    //           </div>
    //         </div>
    //         <div className={`flex gap-2 `}>
    //           <Button variant='contained' color='info' onClick={handleEditButton}>
    //             Edit
    //           </Button>
    //           <Button variant='outlined' color='error' onClick={handleDeleteButton}>
    //             Delete
    //           </Button>
    //         </div>
    //       </div>
    //     )}
    //   </div>
    // </div>
    <div
      className={[
        data.atimageWrapper,
        'border  relative',
        selectable && 'cursor-pointer',
        active && 'border-green-600',
      ].join(' ')}
      onClick={onClick}
    >
      {/* {active ? ( */}
      <div
        className={[
          'absolute right-[5px] top-[5px] z-10',
          !selectable ? 'invisible' : 'visible',
        ].join(' ')}
      >
        {/* <i className='mdi mdi-checkbox-multiple-marked text-success' /> */}
        <CheckCircleRoundedIcon color={active ? 'success' : 'grey'} />
      </div>
      {/* ) : (
        ''
      )} */}
      <div className=' '>
        <LazyImageComponent file={data} alt={data?.title} />
      </div>
      {edit ? (
        <FormProvider
          onSubmit={handleSubmit(onSubmit)}
          methods={methods}
          id={'form-edit-file'}
          noValidate
        >
          <div className={['flex flex-col p-1 h-full flex-grow-1 gap-3'].join(' ')}>
            <div className='flex-grow-1'>
              <RHFTextField
                required
                {...{
                  name: fieldNames.title,
                  label: 'title',
                  defaultValue: data?.title,
                }}
                groupClass={'mb-0'}
              />
            </div>
            <div className='flex gap-1 ml-auto'>
              <Button
                block
                variant='contained'
                color='warning'
                htmlType='button'
                disabled={isLoading}
                onClick={(e) => {
                  e.preventDefault()
                  handleEditButton()
                }}
              >
                {t('cancel')}
              </Button>
              <Button
                block
                variant='contained'
                color='success'
                type='submit'
                loading={isLoading}
                form='form-edit-file'
                onClick={(e) => {
                  e.preventDefault()
                  handleSubmit(onSubmit)()
                  // handleSubmit(onSubmit)
                }}
              >
                {!isLoading ? t('confirm') : `${t('loading')}...`}
              </Button>
            </div>
          </div>
        </FormProvider>
      ) : (
        <div
          className={[
            styles.imageDetailsWrapper_detailsWrapper,
            'mt-3 border-top p-2 flex-col gap-3',
          ].join(' ')}
        >
          <div className={`w-full flex flex-col gap-2`}>
            <h5 className='overflow-hidden text-ellipsis w-full'>{data?.title}</h5>
            <p>{data?.mimetype}</p>
            <div>
              <Chip size='small' label={data?.folder?.title} />
            </div>
          </div>
          {!selectable && !forGallery ? (
            <div
              // className={styles.btnWrapper}
              className={`flex gap-2 `}
            >
              <Button variant='contained' color='info' onClick={handleEditButton}>
                {t('edit')}
              </Button>
              <Button variant='outlined' color='error' onClick={handleDeleteButton}>
                {t('delete')}
              </Button>
            </div>
          ) : (
            ''
          )}
        </div>
      )}
    </div>
  )
}

export default Files
