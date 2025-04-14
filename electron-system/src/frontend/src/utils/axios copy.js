/* eslint-disable no-else-return */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable array-callback-return */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable dot-notation */
import axios from 'axios'
import {toast} from 'react-toastify'
import {routes} from 'src/routes/paths'
// import {store} from 'src/redux/store'
import {Logout} from 'src/redux/slices/user'
// import { useSnackbar } from 'notistack';
// config
import {HOST_API} from '../config'

// ----------------------------------------------------------------------
const axiosInstance = (props) => {
  let token = props?.token
  if (!props?.token) {
    try {
      let newStorageToken = localStorage.getItem('redux-token')
      // console.log({ newStorageToken });
      if (newStorageToken) {
        newStorageToken = JSON.parse(newStorageToken)
        // console.log({ newStorageToken });
        const access = JSON.parse(newStorageToken?.access)
        // console.log('* * * accessToken newStorageToken', {access})
        if (access) token = access?.token
      }
    } catch (error) {
      // console.log({error})
    }
  }

  const instance = axios.create({
    baseURL: `${HOST_API}/api`,
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })

  instance.interceptors.response.use(
    (response) => response,
    // (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
    (error) => {
      // const { enqueueSnackbar } = useSnackbar();
      // const { showError } = useNotification(); // Use the notification service
      console.log({error})
      if (error.response) {
        if (error.response.status === 401) {
          Logout()
          window.location.href = '/auth/login'
        } else if (error.response.status === 403) {
          window.location.href = routes.root
        } else {
          const errors = error?.response?.data?.errors
          if (errors?.length) {
            errors?.map((x) => {
              return toast.error(x?.message || x?.param ? `${x?.param} - ${x?.msg}` : x?.msg)
            })
          } else
            toast.error(error.response.data?.message || 'A problem has occurred with the server.')
        }
      } else {
        if (error?.message == 'Network Error') toast.error('Internet connection problem.')
        else toast.error('A problem has occurred with the server.')
      }
      if (error.response) {
        return Promise.reject(error)
      } else {
        return Promise.reject(error)
      }
    }
    // }
  )
  return instance
}

export default axiosInstance
