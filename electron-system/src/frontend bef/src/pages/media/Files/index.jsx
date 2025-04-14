/* eslint-disable */
import Files from './List'
import api from 'src/services/api.jsx'

import styles from './index.module.scss'
import PaginationM from 'src/components/PaginationM'
import {useState} from 'react'
import Loading from 'src/components/Loading'
// import AddFile from './Add'
import UploadTab from './UploadTab'
import swal from 'sweetalert'
import {toast} from 'react-toastify'
import {StatusData} from 'src/components/StatusComponent/types'
import axiosInstance from 'src/utils/axios'
import {useMutationCustom, useQueryCustom} from 'src/utils/reactQueryHooks'
import LazyImageComponent from 'src/components/LazyImageComponent'
import {
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  ListSubheader,
} from '@mui/material'
import ArchiveIcon from '@mui/icons-material/Archive'
import Button from '@mui/material/Button'
import CustomizedMenus from 'src/components/CustomizedMenus'
import DeleteIcon from '@mui/icons-material/Delete'
import {useTranslation} from 'react-i18next'
import QuestionComponent from 'src/components/modal/Question'
import {useSelector} from 'react-redux'

const FilesSection = ({options, folder, forGallery, value, isMulti, onChange}) => {
  const modal = useSelector((state) => state.modal.data)

  const {t} = useTranslation()
  const [changeFolderFiles, setChangeFolderFiles] = useState()
  const [selectable, setSelectable] = useState()

  const [toggleModal, setToggleModal] = useState()
  const [selectedItem, setSelectItem] = useState()
  const [Pagination, setPagination] = useState({
    page: 1,
    limit: 12,
  })

  const handleSelectingFiles = () => {
    setSelectItem()
    setSelectable((p) => !p)
  }

  if (selectable && !isMulti) isMulti = true
  // const handleSelect=()=>{

  // }

  const selectedValue = isMulti
    ? Array.isArray(selectedItem) && selectedItem.length > 0
      ? [...selectedItem]
      : [...(Array.isArray(value) ? value : [])]
    : selectedItem ?? value

  const getting = async () =>
    await axiosInstance().get(api.gallery.base, {params: {...Pagination, folder: options?.folder}})
  const handleAdd = () => setToggleModal((p) => !p)

  // --------------------------------------- Change Status
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
    modal.show(
      <QuestionComponent
        {...{
          title: t('are you sure'),
          description: t(`You want to {{status}} this {{title}}`, {status: t('delete')}),
          button: {
            confirm: {
              label: 'question.accept',
              loading: changeStatusMutation?.isLoading,
              onClick: () => {
                changeStatusMutation.mutate({
                  data: selectedItem?.map((x) => x.id),
                  status: StatusData.delete.value,
                })
              },
            },
            reject: {
              label: 'question.no',
              disabled: changeStatusMutation?.isLoading,
              onClick: () => {
                // console.log({modalIsOpen: modal.isOpen()})
                modal.hide()
              },
            },
          },
        }}
      />
    )
    // swal({
    //   title: t('are you sure'),
    //   text: t(`You want to {{status}} this {{title}}`, {status: t('delete')}),
    //   icon: 'warning',
    //   buttons: true,
    //   dangerMode: true,
    // }).then((willBe) => {
    //   if (willBe) {
    // changeStatusMutation.mutate({
    //   data: selectedItem?.map((x) => x.id),
    //   status: StatusData.delete.value,
    // })
    //   }
    // })
  }
  // --------------------------------------- Change Folder
  const changeFolder = async (params) =>
    await axiosInstance().put(api['gallery'].changeFolder, params)

  const onSuccessChangeFolderMutation = () => {
    toast.success(t('successfully'))
    setChangeFolderFiles()
    // resetFields();
    // handleCancelSelectedImage();
  }

  const changeFolderMutation = useMutationCustom({
    name: 'gallery_changeFolder',
    url: changeFolder,
    invalidQuery: `file_gets`,
    onSuccess: onSuccessChangeFolderMutation,
  })

  const handleChangeFolderButton = () => {
    modal.show(
      <QuestionComponent
        {...{
          title: t('are you sure'),
          description: 'آیا میخواهید در این فولدر بگذارید!',
          button: {
            confirm: {
              label: 'question.accept',
              loading: changeFolderMutation?.isLoading,
              onClick: () => {
                changeFolderMutation.mutate({
                  data: changeFolderFiles?.map((x) => x.id),
                  folder: folder?.id,
                })
              },
            },
            reject: {
              label: 'question.no',
              disabled: changeFolderMutation?.isLoading,
              onClick: () => {
                // console.log({modalIsOpen: modal.isOpen()})
                modal.hide()
              },
            },
          },
        }}
      />
    )

    // swal({
    //   title: t('are you sure'),
    //   text: 'آیا میخواهید در این فولدر بگذارید!',
    //   icon: 'warning',
    //   buttons: true,
    //   dangerMode: true,
    // }).then((willBe) => {
    //   if (willBe) {
    //     changeFolderMutation.mutate({data: changeFolderFiles?.map((x) => x.id), folder: folder?.id})
    //   }
    // })
  }
  const handleChangeFolders = () => {
    setChangeFolderFiles(selectedItem)
    handleSelectingFiles()
  }

  const dropdownData = [
    {
      ...StatusData.delete,
      onClick: handleDeleteButton,
      icon: <DeleteIcon />,
    },
    {
      label: t('changeFolder'),
      onClick: handleChangeFolders,
      icon: <ArchiveIcon />,
    },
  ]
  //  ----------------------------------------- GETTING QUERY ----------------------------------------- //
  const {
    data: {data = {}} = {},
    error,
    isError,
    isLoading,
    refetch,
  } = useQueryCustom({
    name: `file_gets`,
    url: getting,
    params: {...Pagination, folder: options?.folder},
  })

  const handlePase = () => {}

  const onSelectMulti = (image) => {
    let newValue = selectedValue || []
    let newMedia = [...newValue]
    const mediaId = (newValue || []).map((data) => data.id)
    if (mediaId.includes(image?.id)) {
      const filter = newMedia.filter((data) => data.id !== image.id)

      console.log({mediaId, image, newMedia, filter}, mediaId.includes(image?.id))
      setSelectItem(filter)
    } else setSelectItem([...newValue, image])
  }

  const handleSelect = (image) => {
    console.log({image})
    // value=value|| isMulti?

    if (isMulti) onSelectMulti(image)
    else setSelectItem(image)
  }

  const handleSave = () => {
    if (isMulti) {
      onChange([...(selectedItem || [])])
    } else onChange(selectedItem)
    // handleModal();
  }

  const changePage = (page) => {
    console.log('* * * FilesSection - changePage :', {page})
    setPagination((p) => ({...p, page}))
  }

  let ShowSaveButton = isMulti ? selectedItem?.length : selectedItem
  const isValue = isMulti ? [...(selectedValue || [])] : selectedValue
  const selectedImagesIdObject = isMulti
    ? (isValue || []).reduce((acc, curr) => {
        acc[curr.id] = curr
        return acc
      }, {})
    : {}
  console.log({changeFolderFiles})

  return (
    <div className='border-top pt-3'>
      <div className='flex items-center justify-between mx-0 '>
        <div className='flex justify-between'>
          <div className=''>{` ${folder?.title ? `فایل های پوشه ${folder?.title}` : 'فایل ها'} (${
            data?.result?.length || 0
          })`}</div>
        </div>
        <div className='gap-3  justify-end mt-2 mt-sm-0 flex'>
          {ShowSaveButton && !selectable ? (
            <Button color='success' variant='contained' onClick={handleSave}>
              {t('save')}
            </Button>
          ) : (
            ''
          )}
          {ShowSaveButton && selectable ? <CustomizedMenus options={dropdownData} /> : ''}
          {/* {ShowSaveButton && selectable ? (
            <Dropdown variant='primary'>
              <Dropdown.Toggle id='dropdown-basic' className='btn-sm filter-sort mr-3'>
                {'Action'}
              </Dropdown.Toggle>
              <Dropdown.Menu className='dropDown-menu-custom'>
                <Dropdown.Header className='text-capitalize' header>
                  {'An action for all the elect'}
                </Dropdown.Header>
                {dropdownData?.map((x) => (
                  <Dropdown.Item
                    key={x.label + '_x'}
                    onClick={x?.onClick}
                    className='dropDown-item-custom text-capitalize'
                  >
                    {x?.label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            ''
          )} */}
          {!forGallery ? (
            <Button color='info' variant='contained' onClick={handleSelectingFiles}>
              {selectable ? t('unselectFiles') : t('selectFiles')}
            </Button>
          ) : (
            ''
          )}
          <Button color='primary' variant='contained' onClick={handleAdd}>
            {toggleModal ? 'بستن' : t('addAuthor', {author: t('file')})}
          </Button>
        </div>
      </div>
      <div>
        {changeFolderFiles?.length ? (
          <div className='flex items-center gap-2'>
            <div>{`${changeFolderFiles?.length} فایل آماده تفییر فولدر`}</div>
            <Button
              color='success'
              variant='outlined'
              disabled={changeFolderMutation?.isLoading}
              onClick={() => setChangeFolderFiles()}
            >
              {t('cancel')}
            </Button>
            {folder?.id && changeFolderFiles?.[0]?.folder?.id !== folder?.id ? (
              <Button
                color='success'
                variant='contained'
                disabled={changeFolderMutation?.isLoading}
                onClick={handleChangeFolderButton}
              >
                {t('paste')}
              </Button>
            ) : (
              ''
            )}
          </div>
        ) : (
          ''
        )}
      </div>
      {/* <AddFile
				folder={folder}
				modal={{
					show: toggleModal,
					toggle: handleAdd,
				}}
			/> */}
      {isLoading ? (
        <Loading />
      ) : toggleModal ? (
        <UploadTab {...{folder, toggle: handleAdd}} />
      ) : data?.result && data.result.length ? (
        <div className={'mt-8'}>
          <Grid spacing={2} container className={`${styles.galleryWrapper}`}>
            {data.result.map((x) => {
              const active = isMulti ? selectedImagesIdObject[x.id] : isValue?.id == x.id
              return (
                <Grid item xs={6} lg={3} md={4} key={`files-${x?.id}`} className='py-3'>
                  <Files
                    data={x}
                    {...{
                      forGallery,
                      active,
                      onClick: () => (forGallery || selectable) && handleSelect(x),
                      // handleChangeFolderFiles: () => handleChangeFolderFiles(x),
                      handleSelect: () => handleSelect(x),
                      selectable,
                    }}
                  />
                </Grid>
              )
            })}
          </Grid>
          {/* <ImageList cols={4} gap={4}>
            {data?.result?.map((x) => {
              const active = isMulti ? selectedImagesIdObject[x.id] : isValue?.id == x.id
              return (
                <Files
                  data={x}
                  {...{
                    forGallery,
                    active,
                    onClick: () => (forGallery || selectable) && handleSelect(x),
                    // handleChangeFolderFiles: () => handleChangeFolderFiles(x),
                    handleSelect: () => handleSelect(x),
                  }}
                />
              )
            })}
          </ImageList> */}

          {/* <ImageList cols={4}>
            <ImageListItem key='Subheader' cols={5}>
              <ListSubheader component='div'>December</ListSubheader>
            </ImageListItem>
            {data?.result?.map((item) => (
              <ImageListItem key={item.img}>
                <LazyImageComponent
                  file={item}
                  // srcSet={`${item.img}`}
                  // src={`${item.img}`}
                  alt={item.title}
                  loading='lazy'
                />
                <ImageListItemBar
                  title={item.title}
                  subtitle={item.author}
                  actionIcon={
                    <IconButton
                      sx={{color: 'rgba(255, 255, 255, 0.54)'}}
                      aria-label={`info about ${item.title}`}
                    >
                    </IconButton>
                  }
                />
              </ImageListItem>
            ))}
          </ImageList> */}

          <PaginationM
            {...{
              activePage: Pagination.page,
              pages: Math.ceil(data.count / Pagination.limit),
              limited: 2,
            }}
            onClick={changePage}
          />
        </div>
      ) : (
        <h2>{'در این فولدر فایلی وجود ندارد'}</h2>
      )}
    </div>
  )
}

export default FilesSection
