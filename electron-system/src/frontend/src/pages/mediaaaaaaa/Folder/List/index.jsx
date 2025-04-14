/* eslint-disable */
import {useRef, useState} from 'react'
import {Link} from 'react-router-dom'
import styles from '../index.module.scss'
import AddFolder from '../Edit/add'
import FolderIcon from '@mui/icons-material/Folder'
import CreateIcon from '@mui/icons-material/Create'
import {useTranslation} from 'react-i18next'
const Folder = ({data, onClick}) => {
  const [edit, setEdit] = useState()
  // ---------------------------------------
  const {t} = useTranslation()

  const handleEditButton = () => {
    setEdit((p) => !p)
  }

  return (
    <div
      className={`relative w-full bg-gray-300 bg-opacity-70 rounded-lg transition ease-in-out duration-300 text-inherit group`}
    >
      <div className={`w-full text-inherit hover:no-underline hover:text-inherit`}>
        <div className={`flex ga-3`}>
          <div className={`bg-gray-300 p-4 rounded-lg `} onClick={onClick}>
            <FolderIcon />
          </div>
          {edit ? (
            <AddFolder handleEditButton={handleEditButton} data={data} />
          ) : (
            <div
              className={[`lex flex-col justify-around`, 'p-1 h-full cursor-pointer'].join(' ')}
              onClick={onClick}
            >
              <h4 className='flex flex-col justify-around'>{data?.title}</h4>
              <div className='flex gap-2 justify-space-between'>
                <p className='m-0 capitalize'>
                  {data?.folderCounts || 0} {t('folders')}
                </p>
                <p className='m-0 capitalize'>
                  {data?.fileCounts || 0} {t('files')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {!edit ? (
        <div
          className='absolute top-2.5 ltr:right-2.5 rtl:left-2.5 flex justify-center items-center opacity-0 transform -translate-y-2.5 transition ease-in-out duration-300 group-hover:!opacity-100 group-hover:translate-y-0 cursor-pointer'
          // className={`absolute top-2.5 right-2.5 flex justify-center items-center opacity-0 transform -translate-y-2.5 z-[200] transition ease-in-out duration-300`}
          onClick={handleEditButton}
        >
          <CreateIcon />
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default Folder
