/* eslint-disable */

import api from 'src/services/api.jsx'
import {useEffect, useRef, useState} from 'react'

import {useMutationCustom} from 'src/utils/reactQueryHooks'
import styles from './UploadTab.module.scss'

import DragAndDrop from './DragAndDrop'
import {yupResolver} from '@hookform/resolvers/yup'
import {Controller, useForm} from 'react-hook-form'
import {fieldNames, validation} from './validation'

import {toast} from 'react-toastify'
import axiosInstance from 'src/utils/axios'
import {FormProvider, RHFTextField} from 'src/components/hook-form'
import {convertBytes} from 'src/utils/convertor'
import Loading from 'src/components/Loading'
import {Button, Grid} from '@mui/material'
import {useTranslation} from 'react-i18next'

const UploadTab = ({folder, toggle}) => {
  //  ----------------------------------------- STATES/REFS/CONST ----------------------------------------- //
  const {t} = useTranslation()
  // const [userUploadedFile, setUserUploadedFile] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({})
  const imageRef = useRef(null)
  const [selectedFolder, setSelectedFolder] = useState(null)
  const [folderError, setFolderError] = useState(true)
  const [previewImage, setPreviewImage] = useState(null)
  const [inputValue, setInputValue] = useState({})
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
  const userUploadedFile = watch(fieldNames.images)

  const values = getValues()
  console.log({errors, values})
  const sendingFile = async (params) =>
    await axiosInstance().post(api['gallery'].base + '/', params)
  // const getFolders = async () => await axiosInstance().get(api["folder"].list);

  //  ----------------------------------------- MUTATING ----------------------------------------- //
  const onSuccessMutating = () => {
    toast.success(t('successfully'))
    resetFields()
    toggle()
  }
  const {isLoading, data, mutate} = useMutationCustom({
    name: api['gallery'].base,
    url: sendingFile,
    invalidQuery: `file_gets`,
    onSuccess: onSuccessMutating,
  })
  //  ----------------------------------------- GETTING FOLDERS ----------------------------------------- //
  // const onSuccessGettingFolders = ({ data }) => {
  //   setFolderOptions(selectConvert(data?.result));
  // };
  // const foldersData = useQueryCustom({
  //   name: "foldersList",
  //   url: getFolders,
  //   onSuccess: onSuccessGettingFolders,
  //   params: { sort: "desc", page: 1, limit: 10, status: 1 },
  // });
  //  ----------------------------------------- HANDLERS ----------------------------------------- //
  const handleSelectFile = (e) => {
    console.log('* * *  handleSelectFile :', {e})
    if (e.target) {
      setValue(fieldNames.images, [...e.target.files])
      // console.log({ file: e.target.files[0] }, "uploaded photo");
      // setUserUploadedFile([...e.target.files]);
    } else {
      setValue(fieldNames.images, e)
      // setUserUploadedFile(e);
    }
  }

  const onSubmit = () => {
    const values = getValues()
    console.log('* * * onSubmit : ', {values})
    const formData = new FormData()
    for (let i = 0; i < userUploadedFile.length; i++) {
      formData.append(`images`, userUploadedFile[i])
      formData.append(`titles[${i}]`, values?.data?.[i]?.title)
    }
    formData.append('folder', folder?.id)
    // inputValue && formData.append("title", inputValue);
    // console.log(formData, "form data");

    // for (let entry of formData.entries()) {
    // 	console.log("* * * onSubmit : ", { key: entry[0] }, { value: entry[1] });
    // }
    mutate(formData)
  }

  const handleImageLoad = (e) => {
    if (imageRef.current.naturalWidth) {
      setImageDimensions({
        width: imageRef.current.naturalWidth,
        height: imageRef.current.naturalHeight,
      })
    }
  }

  const handleInputValue = (e) => {
    setInputValue((p) => ({...p, [e.target.name]: e.target.value}))
    // console.log({ value: e.target.value }, "input value");
  }
  //  ----------------------------------------- FUNCTIONS ----------------------------------------- //

  function resetFields() {
    setValue(fieldNames.images, null)
    setSelectedFolder()
    setFolderError()
    setInputValue('')
  }
  const handleCancelButton = () => {
    resetFields()
  }

  //  ----------------------------------------- EFFECTS ----------------------------------------- //
  // useEffect(() => {
  // 	if (userUploadedFile) {
  // 		const reader = new FileReader();
  // 		reader.onload = (e) => {
  // 			// onClick(e.target.result);
  // 			console.log({ e }, "reader");
  // 			setPreviewImage(e.target.result);
  // 		};
  // 		reader.readAsDataURL(userUploadedFile);
  // 	}
  // }, [userUploadedFile]);

  // useEffect(() => {
  //   if (FOLDER_SLUG && folderOptions) {
  //     const foundFolder = folderOptions.find((item) => item.slug === FOLDER_SLUG);
  //     handleSelectingFolder(foundFolder);
  //   }
  // }, [folderOptions, FOLDER_SLUG]);

  return (
    <div className={styles.uploadTab}>
      {/* <div className={styles.titleWrapper}><h3>Upload your File</h3></div> */}
      <div className='my-5'></div>
      {userUploadedFile?.length ? (
        <FormProvider
          methods={methods}
          // onSubmit={handleSubmit(onSubmit)}
          id={'form-container '}
          noValidate
        >
          <Grid spacing={3} container>
            {userUploadedFile?.map((x, i) => {
              return (
                <Grid item xs={12} md={6}>
                  <div className={[styles.flexWrapper, 'border p-4 gap-5'].join(' ')}>
                    <div className={styles.valueWrapper}>
                      {x ? (
                        <img
                          ref={imageRef}
                          src={URL.createObjectURL(x)}
                          alt='uploaded photo'
                          // onLoad={handleImageLoad}
                        />
                      ) : (
                        ''
                      )}
                    </div>
                    <div className={styles.controlWrapper}>
                      <div className={styles.photoDetails}>
                        <p>نام: {x?.name}</p>
                        <p>
                          {/* Size: {imageDimensions.width || imageDimensions.height ? imageDimensions?.width + " × " + imageDimensions?.height : "Calculating..."} -{" "} */}
                          {convertBytes(x?.size)}
                        </p>
                        <p>نوع: {x?.type}</p>
                      </div>
                      <div className={styles.extraInformationWrapper}>
                        <RHFTextField
                          {...{
                            name: `data.[${i}].${fieldNames.title}`,
                            placeholder: 'title',
                            label: 'title',
                          }}
                        />
                        {/* <h3>Upload :</h3> */}
                        {/* <Form.Group className={styles.formGroup}>
												<div className={"flex justify-content-between"}>
													<label htmlFor={"name"}>Title :</label>
												</div>
												<Form.Control
													id={"name"}
													name={`data.[${i}].${fieldNames.title}`}
													value={inputValue?.[i]}
													type="text"
													placeholder="Choose a new title"
													onChange={handleInputValue}
												/>
											</Form.Group> */}
                      </div>
                    </div>
                  </div>
                </Grid>
              )
            })}
          </Grid>
          <div className={[styles.buttonsWrapper, 'gap-2', 'my-5'].join(' ')}>
            <Button
              color='success'
              variant='contained'
              type='button'
              disabled={isLoading}
              onClick={handleSubmit(onSubmit)}
            >
              {isLoading ? <Loading size='sm' /> : t('upload')}
            </Button>
            <Button
              color='error'
              variant='contained'
              type='button'
              disabled={isLoading}
              onClick={handleCancelButton}
            >
              {t('cancel')}
            </Button>
          </div>
        </FormProvider>
      ) : (
        // <div className={styles.uploadHereWrapper}>
        <DragAndDrop {...{handleSelectFile}}>
          <input
            multiple
            type='file'
            name='file'
            id='file'
            accept='images/*'
            className={styles.fileInput}
            onChange={handleSelectFile}
          />
          <label htmlFor='file' className={styles.fileLabel}>
            برای انتخاب از دستگاه خود کلیک کنید
          </label>
          <p>یا</p>
          <p className={styles.dragAndDrop}>فایل خود را بکشید و رها کنید!</p>
          <p className={styles.accepted}>فایل های پذیرفته شده: jpg، .jpeg، .png</p>
        </DragAndDrop>
        // </div>
      )}
    </div>
  )
}

export default UploadTab
