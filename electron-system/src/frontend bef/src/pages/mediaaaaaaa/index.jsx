/* eslint-disable */
import {useEffect, useMemo, useState} from 'react'
import styles from './Gallery.module.scss'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import FolderSection from './Folder'
import FilesSection from './Files'
import RemoveNullObjectValue from 'src/utils/RemoveNullObjectValue'
import useQueryString from 'src/utils/useQueryString'
import createQueryString from 'src/utils/createQueryString'
import {useQueryCustom} from 'src/utils/reactQueryHooks'
import axiosInstance from 'src/utils/axios'
import api from 'src/services/api.jsx'
import {Breadcrumbs, Typography} from '@mui/material'

const MediaContainer = ({forGallery, value, isMulti, onChange}) => {
  const location = useLocation()

  const cacheFolder = useMemo(() => {
    return JSON.parse(localStorage.getItem('galleryFolder') || 'null')
  }, [location])

  const [state, setState] = useState({
    folder: cacheFolder,
  })

  const QueryString = useQueryString({folder: cacheFolder})

  const options = forGallery ? state : QueryString

  const navigate = useNavigate()

  const changeUrl = (params) => ({
    pathname: location.pathname,
    search: createQueryString(RemoveNullObjectValue({...QueryString, ...params})).toString(),
  })

  const navigateUrl = (obj) => navigate(changeUrl(obj))
  //  ----------------------------------------- VARIABLES/STATES/ROUTES ----------------------------------------- //
  const getting = async () =>
    await axiosInstance().get(`${api.folder.base}/${options?.folder}`, {
      params: {withParents: true},
    })

  //  ----------------------------------------- GETTING QUERY ----------------------------------------- //
  const {
    data: {data = {}} = {},
    error,
    isError,
    isLoading,
    refetch,
  } = useQueryCustom({
    name: `folder_get_${options.folder}`,
    url: getting,
    params: {folder: options?.folder},
    enabled: !!options?.folder,
  })
  //  ----------------------------------------- HANDLERS ----------------------------------------- //

  //  ----------------------------------------- EFFECTS ----------------------------------------- //

  //  ----------------------------------------- GALLERY MODAL----------------------------------------- //
  const handleSelectFolder = ({data}) => {
    console.log('* * * MediaContainer - handleSelectFolder : ', {data})
    // setoptions((p) => ({ ...p, folder: data?.id }));
    if (forGallery) setState((p) => ({...p, folder: data?.id || null}))
    else {
      setState((p) => ({...p, folder: data?.id || null}))
      navigateUrl({folder: data?.id})
    }
  }

  //  ----------------------------------------- LOGS ----------------------------------------- //

  // <FolderDetail />

  const findParentInDepth = (data, params) => {
    if (data?.id) params.unshift(data)
    if (data?.parent) findParentInDepth(data?.parent, params)
    // if (cat?.subcategories?.length) {
    // 	for (let i = 0; i < cat?.subcategories?.length; i++) {
    // 		let curr = cat?.subcategories?.[i];
    // 		curr.depth = subDepth;
    // 		findParentInDepth(curr, categories);
    // 	}
    // }
  }

  const pathParams = useMemo(() => {
    const params = []
    if (!data) return params
    findParentInDepth(data, params)
    return params
  }, [data])

  console.log('* * * MediaContainer : ', {QueryString, options, cacheFolder, data, pathParams})

  useEffect(() => {
    console.log('* * * useEffect', {options})
    localStorage.setItem('galleryFolder', options?.folder)
  }, [options])

  return (
    <div className={`w-full h-full`}>
      {/* <GalleryModal {...{ showModal, handleModal: handleGalleryModal, isGalleryDisabled: true }} /> */}
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col  gap-2 '>
          {/* <div>{"مسیر"}</div> */}
          <div className='flex items-center h-full'>
            <Breadcrumbs aria-label='breadcrumb'>
              <Link
                to={{pathname: location.pathname}}
                onClick={(e) => {
                  if (forGallery) {
                    e.preventDefault()
                    handleSelectFolder({data: null})
                  }
                  localStorage.removeItem('galleryFolder')
                }}
                underline='hover'
                color='inherit'
              >
                {'خانه'}
              </Link>

              {pathParams?.map((x, index) =>
                pathParams?.length > index + 1 ? (
                  <li className='-item text-capitalize'>
                    <Link
                      to={{
                        pathname: location.pathname,
                        search: new URLSearchParams({folder: x.id}).toString(),
                      }}
                      onClick={(e) => {
                        if (forGallery) {
                          e.preventDefault()
                          handleSelectFolder({data: x})
                        }
                      }}
                    >
                      {x.title}
                    </Link>
                  </li>
                ) : (
                  <Typography color='text.primary'> {x.title}</Typography>
                )
              )}
            </Breadcrumbs>
          </div>
        </div>
        <FolderSection select={handleSelectFolder} {...{folder: data, options, forGallery}} />
        <FilesSection {...{folder: data, options, forGallery, value, isMulti, onChange}} />
      </div>
    </div>
  )
}

export default MediaContainer
