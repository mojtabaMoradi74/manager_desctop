/* eslint-disable */

import styles from '../Gallery.module.scss'
import Folder from './List'
import api from 'src/services/api.jsx'
import axiosInstance from 'src/utils/axios'

import Loading from 'src/components/Loading'
import {useState} from 'react'
import Add from './Add'
import {useQueryCustom} from 'src/utils/reactQueryHooks'
import PaginationM from 'src/components/PaginationM'
import {Button, Grid} from '@mui/material'
import {useTranslation} from 'react-i18next'

const FolderSection = ({select, folder, options}) => {
  const {t} = useTranslation()

  const [toggleModal, setToggleModal] = useState()
  const handleAddFolder = () => setToggleModal((p) => !p)
  const [Pagination, setPagination] = useState({
    page: 1,
    limit: 12,
  })
  const getting = async () =>
    await axiosInstance().get(api.folder.base, {params: {folder: options?.folder}})

  //  ----------------------------------------- GETTING QUERY ----------------------------------------- //
  const {
    data: {data = {}} = {},
    error,
    isError,
    isLoading,
    refetch,
  } = useQueryCustom({
    name: `folder_gets`,
    url: getting,
    params: {folder: options?.folder},
  })

  const changePage = (page) => {
    console.log('* * * FolderSection - changePage :', {page})
    setPagination((p) => ({...p, page}))
  }

  return (
    <div>
      <div className='flex items-center justify-between  mx-0 my-3'>
        <div className='col-sm-6 p-md-0'>{` ${
          folder?.title ? `فولدر های  ${folder?.title}` : 'فولدر ها'
        } (${data?.result?.length || 0})`}</div>
        <div className='col-sm-6 p-md-0 justify-end mt-2 mt-sm-0 flex'>
          <Button
            variant='contained'
            // color='success'
            // className={`btn btn-success btn-sm mr-2`}
            // type='success'
            onClick={handleAddFolder}
          >
            {t('addAuthor', {author: t('folder')})}
          </Button>
        </div>
      </div>

      <Add
        folder={folder}
        modal={{
          show: toggleModal,
          toggle: handleAddFolder,
        }}
      />

      {isLoading ? (
        <Loading />
      ) : data?.result && data.result.length ? (
        <div className={``}>
          <Grid container spacing={3} className=''>
            {data.result.map((x) => (
              <Grid item xs={12} md={6} lg={3} key={`folders-${x?.id}`}>
                <Folder data={x} onClick={() => select({data: x})} />
              </Grid>
            ))}
          </Grid>
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
        <h2>{'در این فولدر داده ای وجود ندارد'}</h2>
      )}
    </div>
  )
}

export default FolderSection
