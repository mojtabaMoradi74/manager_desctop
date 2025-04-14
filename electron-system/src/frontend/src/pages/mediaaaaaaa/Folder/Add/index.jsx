/* eslint-disable */

import {yupResolver} from '@hookform/resolvers/yup'
import axiosInstance from 'src/utils/axios'

import api from 'src/services/api.jsx'
import {useEffect, useMemo} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {fieldNames, validation} from './validation'

import {useMutationCustom} from 'src/utils/reactQueryHooks'
import {toast} from 'react-toastify'
import {FormProvider, RHFTextField} from 'src/components/hook-form'
import {Button, Dialog, DialogContent, DialogTitle} from '@mui/material'

const Add = ({handleEditButton, folder, modal, ...props}) => {
  // let { id } = props?.folder || {};
  // ----------------------------------------------------------------------------- Fetching Functions
  const creating = (params) => axiosInstance().post(api.folder.base, params)
  // const updating = async (params) => await axiosInstance().put(api.folder.base + "/update/" + id, params);
  // const getById = async () => await axiosInstance().get(api.folder.get + "/" + id);

  // ----------------------------------------------------------------------------- Form
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
  } = methods
  const closeModal = () => {
    modal.toggle()
    reset({
      title: '',
    })
  }
  // ----------------------------------------------------------------------------- Mutation
  const onSuccessMutating = () => {
    toast.success('success')
    closeModal()
  }
  const {isLoading, mutate} = useMutationCustom({
    name: `${api.folder.base}_update`,
    url: creating,
    invalidQuery: `folder_gets`,
    onSuccess: onSuccessMutating,
  })

  // --------------------------------------- Submit Form
  const onSubmit = () => {
    const values = getValues()
    console.log('values', values)
    const requestData = {
      // status: data.status,
      parent: folder?.id,
      title: values?.title,
    }
    console.log({requestData}, 'requestData')
    mutate(requestData)
  }

  console.log('* * * props : ', {props, folder, errors})

  return (
    <Dialog open={modal?.show} onClose={closeModal} size='md' keyboard scrollable centered>
      <DialogTitle closeButton className='bg-white mb-3 capitalize'>
        {'add folder'}
      </DialogTitle>

      <DialogContent className='bg-white w-[30vw]'>
        <FormProvider
          methods={methods}
          //  onSubmit={handleSubmit(onSubmit)}
        >
          {/* <form onSubmit={handleSubmit(onSubmit)} id={'form-container '} noValidate> */}
          <div className={['flex flex-col p-1 h-full flex-grow-1 gap-3'].join(' ')}>
            <div className='flex-grow-1'>
              <RHFTextField
                required
                {...{
                  name: fieldNames.title,

                  placeholder: 'title',
                  label: 'Title',
                }}
                groupClass={'mb-0'}
              />
            </div>
            <div className='flex gap-1 ml-auto'>
              <Button
                onClick={handleSubmit(onSubmit)}
                color='success'
                variant='contained'
                block
                type='button'
                loading={isLoading}
              >
                {!isLoading ? 'Publish' : 'Loading...'}
              </Button>
            </div>
          </div>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default Add
