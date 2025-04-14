/* eslint-disable prefer-const */
/* eslint-disable dot-notation */
/* eslint-disable no-plusplus */
import {TabContext, TabList, TabPanel} from '@mui/lab'
import {useEffect, useState} from 'react'
import {paramCase, capitalCase} from 'change-case'
import {useParams, useLocation} from 'react-router-dom'
// @mui
import {Box, Container, Tab} from '@mui/material'
// routes
import {routes} from '../../../routes/paths'
// hooks
import useSettings from '../../../hooks/useSettings'
// _mock_
import {_userList} from '../../../_mock'
// components
import Page from '../../../components/Page'
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs'
import AddOrEditForm from './components/AddOrEditForm'
// import { getGame } from '../../../services/game';
import {getBlog} from '../../../services/blog'

// ----------------------------------------------------------------------

export default function CreateNewBlog() {
  const {themeStretch} = useSettings()

  const {pathname} = useLocation()

  const {id} = useParams()

  const isEdit = pathname.includes('edit')

  // const currentUser = _userList.find((user) => paramCase(user.name) === name);

  const [TabValue, setTabValue] = useState('1')

  const [SingleData, setSingleData] = useState({})

  const handleGetSingleDetail = () => {
    getBlog(id)
      .then(({data}) => {
        let helpObj = data?.data
        // const categorySelectArr = [];

        // for (let i = 0; i < helpObj?.data?.game?.categories?.length; i++) {
        //   const element = helpObj?.data?.game?.categories[i];
        //   categorySelectArr.push({
        //     label : element?.title,
        //     value : element?._id,
        //   })
        // }

        // // helpObj.type = {
        // //   label : helpObj?.type?.title,
        // //   value : helpObj?.type?.id,
        // // };
        // helpObj["categoriesValue"] = categorySelectArr;

        // const helpGame = helpObj?.data?.game

        // helpObj = {...helpGame ,categoriesValue:categorySelectArr };

        console.log({helpObj})

        setSingleData(helpObj)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    if (isEdit) {
      handleGetSingleDetail()
    }
  }, [isEdit])

  return (
    <Page title='Create New Blog'>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create New Blog' : 'Edit Blog'}
          links={[
            {name: 'Dashboard', href: routes.root},
            {name: 'Blog', href: routes.blog.list},
            {name: !isEdit ? 'New Blog' : SingleData?.name || 'Edit Blog'},
          ]}
        />

        <AddOrEditForm isEdit={isEdit} currentItem={SingleData} />
      </Container>
    </Page>
  )
}
