/* eslint-disable */

import {yupResolver} from '@hookform/resolvers/yup'
import {useEffect, useMemo} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {fieldNames, validation} from './validation'
import axiosInstance from 'src/utils/axios'
import api from 'src/services/api.jsx'
import {toast} from 'react-toastify'
import {Box, Button, Modal} from '@mui/material'
import {FormProvider, RHFTextField} from 'src/components/hook-form'
import {useMutationCustom} from 'src/utils/reactQueryHooks'

const AddFile = ({handleEditButton, folder, modal, ...props}) => {
  // let { id } = props?.folder || {};
  // ----------------------------------------------------------------------------- Fetching Functions
  const creating = async (params) => await axiosInstance().post(api.folder.base + '/create', params)
  // const updating = async (params) => await axiosClient().put(api.folder.base + "/update/" + id, params);
  // const getById = async () => await axiosClient().get(api.folder.get + "/" + id);

  // ----------------------------------------------------------------------------- Form
  const {
    register,
    handleSubmit,
    formState: {errors},
    getValues,
    setValue,
    control,
    reset,
  } = useForm({
    resolver: yupResolver(validation()),
    mode: 'onSubmit',
  })

  const closeModal = () => {
    modal.toggle()
    reset({
      title: '',
    })
  }
  // ----------------------------------------------------------------------------- Mutation
  const onSuccessMutating = () => {
    toast.success(t('successfully'))
    closeModal()
  }
  const {isLoading, data, mutate} = useMutationCustom({
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
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  }

  console.log('* * * props : ', {props, folder, errors})

  return (
    <Modal open={modal?.show} onClose={closeModal} size='md' keyboard scrollable centered>
      <Box sx={style}>
        <Box closeButton className='bg-white'>
          <Box className='w-full'>{'add folder'}</Box>
        </Box>
        <Box className='bg-white'>
          <FormProvider
            methods={methods}
            // onSubmit={handleSubmit(onSubmit)}
          >
            {/* <form onSubmit={handleSubmit(onSubmit)} id={'form-container '} noValidate> */}
            <div className={['flex flex-col p-1 h-full flex-grow-1'].join(' ')}>
              <div className='flex-grow-1'>
                <RHFTextField
                  required
                  {...{
                    name: fieldNames.title,
                    placeholder: 'title',
                    label: 'title',
                  }}
                  groupClass={'mb-0'}
                />
              </div>
              <div className='flex gap-1 ml-auto'>
                <Button
                  block
                  type='button'
                  // htmlType='submit'
                  loading={isLoading}
                  onClick={handleSubmit(onSubmit)}
                >
                  {!isLoading ? 'Publish' : 'Loading...'}
                </Button>
              </div>
            </div>
          </FormProvider>
        </Box>
      </Box>
    </Modal>
  )
}

export default AddFile
