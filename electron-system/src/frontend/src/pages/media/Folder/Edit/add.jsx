/* eslint-disable */
import {yupResolver} from '@hookform/resolvers/yup'
import api from 'src/services/api.jsx'
import {useEffect, useMemo} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {fieldNames, validation} from './validation'
import {useMutationCustom} from 'src/utils/reactQueryHooks'
import {toast} from 'react-toastify'
import axiosInstance from 'src/utils/axios'
import {FormProvider, RHFTextField} from 'src/components/hook-form'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import CloseIcon from '@mui/icons-material/Close'
import {Button} from '@mui/material'
import {useTranslation} from 'react-i18next'

const Add = ({handleEditButton, ...props}) => {
  const {t} = useTranslation()
  let {id} = props?.data || {}
  // ----------------------------------------------------------------------------- Fetching Functions
  const creating = (params) => axiosInstance().post(api.folder.base, params)
  const updating = (params) => axiosInstance().put(api.folder.base + '/' + id, params)
  const getById = () => axiosInstance().get(api.folder.get + '/' + id)

  // ----------------------------------------------------------------------------- Form
  const methods = useForm({
    resolver: yupResolver(validation(id)),
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
  // ----------------------------------------------------------------------------- Mutation
  const onSuccessMutating = () => {
    toast.success(t('successfully'))
    handleEditButton()
  }

  const {isLoading, data, mutate} = useMutationCustom({
    name: `folder_add`,
    url: id ? updating : creating,
    invalidQuery: `folder_gets`,
    onSuccess: onSuccessMutating,
  })
  // ----------------------------------------------------------------------------- Query By ID
  useEffect(() => {
    if (!props.data) return
    reset({
      title: props.data.title,
    })
  }, [props.data])

  // ----------------------------------------------------------------------------- Functions
  function selectConvert(data) {
    return data?.map((param) => ({label: param.name, value: param._id}))
  }
  // --------------------------------------- Submit Form
  const onSubmit = () => {
    const values = getValues()
    console.log('values', values)
    const requestData = {
      // status: props?.data?.status,
      parent: props?.data?.parentId,
      title: values?.title,
    }
    // console.log({requestData}, 'requestData')

    mutate(requestData)
  }
  // console.log('* * * props : ', {props})

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {/* <form onSubmit={handleSubmit(onSubmit)} id={'form-container '} noValidate> */}
      <div className={['flex flex-col p-1 h-full flex-grow-1'].join(' ')}>
        <div className='flex-grow-1'>
          <RHFTextField
            require
            {...{
              name: fieldNames.title,
              label: 'title',
            }}
            groupClass={'mb-0'}
          />
        </div>
        <div className='relative'>
          <div className='absolute right-0 flex gap-1 ml-auto'>
            <Button
              color='success'
              variant='contained'
              type='submit'
              className='p-[2px] m-0 border-0'
              disabled={isLoading}
            >
              <DoneAllIcon className='fs-4 item pointer mdi mdi-check text-white' />
            </Button>
            <Button
              color='error'
              variant='contained'
              type='button'
              className='p-[2px] m-0 border-0 bg-danger'
              onClick={handleEditButton}
              disabled={isLoading}
            >
              <CloseIcon className='fs-4 item pointer mdi mdi-close text-white' />
            </Button>
          </div>
        </div>
      </div>
    </FormProvider>
  )
}

export default Add
