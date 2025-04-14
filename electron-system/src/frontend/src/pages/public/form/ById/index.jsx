import {useState, useRef} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {Box, Container, Modal, Button, Typography, CircularProgress} from '@mui/material'
import {useForm, Controller} from 'react-hook-form'
import * as yup from 'yup'
import {ControlPoint} from '@mui/icons-material'
import {yupResolver} from '@hookform/resolvers/yup'
import {isArray} from 'lodash'
import {toast} from 'react-toastify'
import {useTranslation} from 'react-i18next'
import {LoadingButton} from '@mui/lab'
import axiosInstance from '../../../../utils/axios'
import Enum from '../enum'
import {useMutationCustom, useQueryCustom} from '../../../../utils/reactQueryHooks'
import Page from '../../../../components/Page'
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs'
import useSettings from '../../../../hooks/useSettings'
import WaitingBox from '../../../../components/WaitingBox/index'
import SectionPublic from '../Section'
import FormProvider from '../../../../components/hook-form/FormProvider'
import {formTypesObject} from '../../../../enumeration'
import errorsText from '../../../../utils/errorsText'
import validation from './validation'
import api from '../../../../services/api'
import {routes} from '../../../../routes/paths'
import persianToEnglishNumber from '../../../../utils/persianToEnglishNumber'
import {fDateForApi} from '../../../../utils/formatTime'
import ModalLayout from '../../../../components/ModalLayout'
import QuestionComponent from '../../../../components/modal/Question/index'

const ById = () => {
  const ModalLayoutQuestionInputRef = useRef()
  const queryParams = useParams()
  const {id, travel} = queryParams
  const {themeStretch} = useSettings()
  const {t} = useTranslation()
  const [validationState, setValidationState] = useState({})
  const [TravelApi, setTravelApi] = useState()
  const [beforeRegistrant, setBeforeRegistrant] = useState()
  const [companionSectionId, setCompanionSectionId] = useState()
  // const ModalSectionFormRef = useRef();

  const navigate = useNavigate()

  const methods = useForm({
    resolver: yupResolver(validation.schema(validationState)),
    mode: 'onChange',
    // mode: 'all',
    shouldUnregister: false,
  })

  const {
    reset,
    watch,
    control,
    setValue,
    setError,
    handleSubmit,
    getValues,
    formState: {errors, isSubmitting},
  } = methods

  const values = getValues()
  console.log({errors, values})
  // ------------------------------------------------------------------------------ modal ref

  // ------------------------------------------------------------------------------ modal toggle

  // ------------------------------------------------------------------------------ Mutation service
  // ----------------------------------------------------------------------------- SERVICE
  const creating = (params) => axiosInstance().post(api.public.travelRegister.base, params)
  // const updating = (params) => axiosInstance().put(`${api.section.base}/${data.id}`, params);
  const getById = async ({queryKey}) => {
    const [_, params] = queryKey || []
    return axiosInstance().get(`${Enum?.api?.base}/${params?.id}`)
  }
  // const getById = () => axiosInstance().get(`${api.input.base}/${data}`);
  // ------------------------------------------------------------------------------ Mutation
  const onSuccessMutating = () => {
    // toast.success(t('successfully'));

    // reset({

    // });

    navigate(routes.registered.root)
  }

  const onErrorMutating = (error) => {
    console.log({error})
    const errorTitle = error.response.data.message || t('errorTryAgain')

    const errors = Object.values(error?.response?.data?.errors || {})
    if (errors?.length) {
      errors?.map((x) => {
        return toast.error(x?.[0])
      })
    } else toast.error(errorTitle)
  }

  const {isLoading, mutate} = useMutationCustom({
    url:
      // data ? updating :
      creating,
    name: `${api.public.travelRegister.base}_add`,
    invalidQuery: `${Enum?.api?.base}_get_${id}`,
    onSuccess: onSuccessMutating,
    onError: onErrorMutating,
  })
  // -------
  // ------------------------------------------------------------------------------ handler

  const onSubmit = async () => {
    handleQuestionModal()
    const values = getValues()
    const final = {}
    let i = 0
    let companionsIndex = 0

    console.log('* * * onSubmit : ', {values, companionSectionId})

    const formData = new FormData()
    formData.append('form_id', id)
    formData.append('travel_id', travel)

    Object.keys(values || {})?.forEach((x) => {
      const currentX = values[x]
      if (+x === +companionSectionId) {
        currentX?.forEach((current) => {
          Object.keys(current || {})?.forEach((y) => {
            console.log('* * * onSubmit isCompanion : ', {y})
            const currentY = current[y]
            if (currentY) {
              let newVal = currentY?.value || currentY

              try {
                if (newVal instanceof Date) {
                  console.log('* * * onSubmit isCompanion The value is a Date object.')
                  newVal = fDateForApi(newVal)
                }
              } catch (error) {
                console.log({error})
              }
              const [_, id] = y?.split('_')
              const val = persianToEnglishNumber(newVal)

              formData.append(`companions[${companionsIndex}][input_id]`, id)
              if (isArray(newVal)) {
                newVal = newVal?.forEach((x, j) => {
                  formData.append(`companions[${companionsIndex}][value][${j}]`, x?.value)
                })
              } else {
                formData.append(`companions[${companionsIndex}][value]`, val)
              }

              // console.log("* * * onSubmit : ",{id,val},   isArray(val));
              final[x] = {
                ...final[x],
                [id]: val,
              }
              companionsIndex += 1
            }
          })
        })
      } else {
        Object.keys(currentX || {})?.forEach((y) => {
          console.log('* * * onSubmit : ', {y})
          const currentY = currentX[y]
          if (currentY) {
            let newVal = currentY?.value || currentY

            try {
              if (newVal instanceof Date) {
                console.log('* * * onSubmit The value is a Date object.')
                newVal = fDateForApi(newVal)
              }
            } catch (error) {
              console.log({error})
            }
            const [_, id] = y?.split('_')
            const val = persianToEnglishNumber(newVal)

            formData.append(`array[${i}][input_id]`, id)
            if (isArray(newVal)) {
              newVal = newVal?.forEach((x, j) => {
                formData.append(`array[${i}][value][${j}]`, x?.value)
              })
            } else {
              formData.append(`array[${i}][value]`, val)
            }

            // console.log("* * * onSubmit : ",{id,val},   isArray(val));
            final[x] = {
              ...final[x],
              [id]: val,
            }
            i += 1
          }
        })
      }

      return true
    })

    // Object.values(formData)?.forEach((x)=>{
    //   console.log("* * * onSubmit values: ",{x});
    //   })

    console.log('* * * onSubmit : ', {final, entries: formData.values()})

    for (const keys of formData.keys()) {
      console.log('* * * onSubmit : ', {keys, value: formData.get(keys)})
    }

    mutate(formData)
  }
  const handleQuestionModal = (params) =>
    ModalLayoutQuestionInputRef.current.show((p) => !p, params)

  // const persianNumber = 'asdad۱۲۳۴۵۶';
  // const englishNumber = persianToEnglishNumber(persianNumber);
  // console.log({englishNumber});
  // const getting = async () =>
  //   axiosInstance().get(api.section.base, {
  //     params: {
  //       form_id: id,
  //     },
  //   });

  const onSuccess = (data) => {
    console.log({data})

    // const missafirRooms = yup
    // 	.object({
    // 		// [fieldNames.address]: yup.string().required(ERRORS.pleaseEnterYour(fieldNames.address)).label(fieldNames.address),
    // 		// [fieldNames.roomNumber]: yup.string().required(ERRORS.pleaseEnterYour(fieldNames.roomNumber)).label(fieldNames.roomNumber),
    // 	})
    // 	.defined();

    const validationsObject = {}
    const resetData = {}
    const companionInfo = {
      section: null,
      id: null,
      count: 0,
    }
    let isBeforeRegistrant = false

    // let sectionIndex=0

    for (let i = 0; i < data?.data?.sections?.length; i += 1) {
      let resetValue = null
      let findItem

      if (data?.data?.sections?.[i]?.label?.trim() === 'اطلاعات همراه'?.trim()) {
        // console.log({companions:section});
        data.data.sections[i].isCompanions = true
        data.data.sections[i].parentId = companionInfo.id
        setCompanionSectionId(data.data.sections[i].id)
        companionInfo.section = data.data.sections[i].id
      }
      const section = {...data?.data?.sections?.[i]}

      validationsObject[section.id] = validationsObject[section.id] || {}

      let parentProvinceName
      let parentProvinceIndex

      for (let j = 0; j < section.inputs.length; j += 1) {
        resetValue = null

        if (section.inputs[j]?.label?.trim() === 'تعداد همراه'?.trim()) {
          section.inputs[j].isCompanions = true
          companionInfo.id = `${section.id}.${Enum.bseName}${section.inputs[j].id}`
          companionInfo.count = section.inputs[j]?.client_inputs?.[0]?.value
          // companionsId
        }

        const input = section.inputs[j]

        const options = JSON.parse(input.options || '{}')
        let valid
        data.data.sections[i].inputs[j].options = options

        if (options?.isProvince) {
          parentProvinceName = `${section.id}.${Enum.bseName + input.id}`
          parentProvinceIndex = j
        }
        if (options?.isCity && parentProvinceName) {
          data.data.sections[i].inputs[j].parentProvinceName = parentProvinceName
          data.data.sections[i].inputs[parentProvinceIndex].childCityName = `${section.id}.${
            Enum.bseName + input.id
          }`
        }

        const phoneRegex = /^(۰۹|09)[0-9\u06F0-\u06F9]{9}$/
        const nationalCodeRegex = /^[\u06F0-\u06F90-9]{10}$/

        switch (input?.type) {
          case formTypesObject.STRING.value:
            // options.required
            // console.log("* * * onSuccess - STRING",{ options },options.required);
            valid = yup.string()
            if (options.required) valid = valid.required(errorsText.blankError())
            if (section.isCompanions) resetValue = input?.client_inputs?.map((x) => x.value)
            else resetValue = input?.client_inputs?.[0]?.value
            break
          case formTypesObject.CHECKBOX.value:
            // console.log("* * * onSuccess - CHECKBOX",{ options },options.required);
            valid = yup.array()
            if (options.required) valid = valid.required(errorsText.blankError())
            if (section.isCompanions) resetValue = input?.client_inputs?.map((x) => x.value)
            else resetValue = input?.client_inputs?.[0]?.value

            break

          case formTypesObject.RADIO.value:
            // console.log("* * * onSuccess - RADIO",{ options },options.required);
            valid = yup.mixed()
            if (options.required) valid = valid.required(errorsText.blankError())
            findItem = options?.items?.filter((x) =>
              input?.client_inputs?.some((y) => y?.value === x.label)
            )
            if (section.isCompanions)
              resetValue = findItem?.map((x) => ({label: x.label, value: x.label}))
            else
              resetValue = findItem?.length && {
                label: findItem[0]?.label,
                value: findItem[0]?.label,
              }

            break

          case formTypesObject.SELECT.value:
            // console.log("* * * onSuccess - SELECT",{ options },options.required);
            valid = yup.mixed()
            if (options.required) valid = valid.required(errorsText.blankError())
            findItem = options?.items?.filter((x) =>
              input?.client_inputs?.some((y) => y?.value === x.label)
            )
            if (section.isCompanions)
              resetValue = findItem?.map((x) => ({label: x.label, value: x.label}))
            else
              resetValue = findItem?.length && {
                label: findItem[0]?.label,
                value: findItem[0]?.label,
              }

            break

          case formTypesObject.IMAGE.value:
            // console.log("* * * onSuccess - IMAGE",{ options },options.required);
            valid = yup.mixed()
            if (options.required) valid = valid.required(errorsText.blankError())
            break

          case formTypesObject.NUMBER.value:
            // console.log("* * * onSuccess - NUMBER",{ options },options.required);

            valid = yup.number().nullable().typeError(errorsText.blankError())
            //  .typeError(errorsText.blankError())
            if (options.min >= 0) valid = valid.min(options.min, errorsText.min(options.min))
            if (options.max >= 0) valid = valid.max(options.max, errorsText.max(options.max))

            if (options.required) valid = valid.required(errorsText.blankError())
            else valid.nullable()
            if (section.isCompanions) resetValue = input?.client_inputs?.map((x) => x.value)
            else resetValue = input?.client_inputs?.[0]?.value
            break

          case formTypesObject.SOCIAL_MEDIA.value:
            // console.log("* * * onSuccess - SOCIAL_MEDIA",{ options },options.required);
            valid = yup.string()
            if (options.required) valid = valid.required(errorsText.blankError())
            break

          case formTypesObject.LOCATION.value:
            // console.log("* * * onSuccess - LOCATION",{ options },options.required);
            valid = yup.mixed()
            if (options.required) valid = valid.required(errorsText.blankError())
            // if(options?.isAddress){ resetValue=input?.client_inputs?.[0]?.value;}
            // else  resetValue=null
            //  resetValue=input?.client_inputs?.[0]?.value;
            //  if(options?.isProvince){}
            //  if(options?.isCity){}
            if (options?.isAddress) resetValue = input?.client_inputs?.[0]?.value
            break

          case formTypesObject.code_melli.value:
            // console.log("* * * onSuccess - code_melli",{ options },options.required);
            valid = yup.string().matches(nationalCodeRegex, errorsText.invalidValue(input.label))
            if (options.required) valid = valid.required(errorsText.blankError())
            if (section.isCompanions) resetValue = input?.client_inputs?.map((x) => x.value)
            else resetValue = input?.client_inputs?.[0]?.value
            break

          case formTypesObject.phone.value:
            // console.log("* * * onSuccess - phone",{ options },options.required);
            valid = yup.string().matches(phoneRegex, errorsText.invalidValue(input.label))
            if (options.required) valid = valid.required(errorsText.blankError())
            if (section.isCompanions) resetValue = input?.client_inputs?.map((x) => x.value)
            else resetValue = input?.client_inputs?.[0]?.value
            break

          default:
            // console.log("* * * onSuccess - ANY",{ options },options.required);
            valid = yup.mixed()
            if (options.required) valid = valid.required(errorsText.blankError())
            if (section.isCompanions) resetValue = input?.client_inputs?.map((x) => x.value)
            else resetValue = input?.client_inputs?.[0]?.value
            break
        }
        // if(section.isCompanions){
        //   validationsObject[section.id]
        // }
        // else
        validationsObject[section.id][`${Enum.bseName + input.id}`] = valid
        if (!section.isCompanions) {
          resetData[section.id] = resetData[section.id] || {}
          resetData[section.id][`${Enum.bseName + input.id}`] = resetValue
        } else {
          resetData[section.id] = resetData[section.id] || []
          console.log({resetValue}, companionInfo.count)
          for (let k = 0; k < companionInfo.count; k += 1) {
            const currentValue = resetValue[k]
            resetData[section.id][k] = resetData[section.id][k] || {}
            resetData[section.id][k][`${Enum.bseName + input.id}`] = currentValue
            // const element = array[k];
          }
        }
        if (resetValue) {
          // console.log({resetValue});
          isBeforeRegistrant = true
        }
      }
    }
    // const resetValues= Object.values(resetData||{})
    console.log('* * * onSuccess', {
      resetData,
      validationsObject,
      companionInfo,
      isBeforeRegistrant,
    })
    reset(resetData)
    setBeforeRegistrant(isBeforeRegistrant)

    // const handly={
    //   1:yup.object().shape({2:yup.string().required(errorsText.blankError())})
    // }
    const finalValidation = {}

    Object.keys(validationsObject || {})?.forEach((key) => {
      console.log(
        '* * * onSuccess',
        {key, value: validationsObject[key]},
        +key === +companionInfo.section
      )
      if (+key === +companionInfo.section)
        finalValidation[key] = yup.array().of(yup.object(validationsObject[key]).defined())
      else finalValidation[key] = yup.object().shape(validationsObject[key])
    })
    setValidationState(finalValidation)
    console.log('* * * onSuccess', {
      validationsObject,
      finalValidation,
      obj: Object.keys(validationsObject || {}),
    })

    setTravelApi(data?.data)
  }

  const resQuery = useQueryCustom({
    name: `${Enum?.api?.base}_get_${id}`,
    url: getById,
    params: {id},
    onSuccess: onSuccess,
  })

  // const sectionsQuery = useQueryCustom({
  //   name: `${api.section.base}_get_${id}`,
  //   url: getting,
  // });

  console.log({resQuery, travel, TravelApi})

  return (
    <Box
      sx={
        {
          // py:3
        }
      }
    >
      {resQuery.isLoading ? (
        <WaitingBox />
      ) : resQuery.isError ? (
        ''
      ) : (
        <Page
          sx={{
            py: 3,
          }}
          title={resQuery?.data?.data?.name}
        >
          <ModalLayout ref={ModalLayoutQuestionInputRef}>
            <QuestionComponent
              {...{
                // loading,
                title: 'آیا از تایید ثبت نام مطمئن هستید؟',
                description:
                  'پس از تایید اطلاعات شما در لیست زاعرین قرار خواهد گرفت . آیا ادامه میدهید؟',
                button: {
                  confirm: {
                    label: 'question.yesProcess',
                    onClick: (_, data) => onSubmit(data),
                  },
                  reject: {
                    label: 'question.no',
                    onClick: () => handleQuestionModal(),
                  },
                },
                // ...question,

                // button: {
                //   confirm: {
                //     label: t('question.delete.yes'),
                //     onClick: (_, data) => handleDelete(data),
                //   },
                //   reject: {
                //     label: t('question.delete.no'),
                //     onClick: () => handleQuestionModal(),
                //   },
                // },
              }}
              onClose={() => handleQuestionModal()}
            />
          </ModalLayout>
          <Container maxWidth={themeStretch ? false : 'lg'}>
            <HeaderBreadcrumbs heading={resQuery?.data?.data?.name}>
              <Typography>{resQuery?.data?.data?.travel?.name}</Typography>
            </HeaderBreadcrumbs>

            <FormProvider methods={methods} onSubmit={handleSubmit(handleQuestionModal)}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                {TravelApi?.sections?.map((x) => {
                  return (
                    <SectionPublic
                      key={x.id}
                      data={x}
                      loading={isLoading}
                      // disabled={beforeRegistrant}
                    />
                  )
                })}
              </Box>
              {!beforeRegistrant ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: 5,
                  }}
                >
                  <LoadingButton
                    loading={isLoading}
                    type='submit'
                    variant='contained'
                    color={'success'}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 2,
                        alignItems: 'center',
                      }}
                    >
                      <Typography>{'ثبت اطلاعات'}</Typography>
                      <ControlPoint />
                    </Box>
                  </LoadingButton>
                </Box>
              ) : (
                ''
              )}
            </FormProvider>
          </Container>
        </Page>
      )}
    </Box>
  )
}

export default ById
