import axios from 'axios'
import {toast} from 'react-toastify'
import {routes} from 'src/routes/paths'
import {store} from 'src/redux/store'
import {Logout} from 'src/redux/slices/user'
import {HOST_API} from '../config'
import {refreshTokenThunk} from 'src/redux/slices/token'

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: `${HOST_API}/api`,
  credentials: true,
})

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log('* * * axiosInstance :', {error})

    if (error.message === 'Network Error') return toast.error('مشکل اتصال به اینترنت')
    const originalRequest = error.config

    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const newAccessToken = await store.dispatch(refreshTokenThunk())
        originalRequest.headers.Authorization = `Bearer ${newAccessToken?.payload.token}`

        return axiosInstance(originalRequest) // Retry the original request
      } catch (err) {
        return Promise.reject(err)
      }
    }

    if (error.response) {
      if (error.response.status === 401) {
        store.dispatch(Logout())
        // window.location.href = '/auth/login'
      } else if (error.response.status === 403) {
        window.location.href = routes.root
      } else {
        const errors = error?.response?.data?.errors
        // console.log('* * * axiosInstance :', {errors})
        if (errors?.length) {
          errors?.forEach((x) => {
            toast.error(x?.message || (x?.param ? `${x?.param} - ${x?.msg}` : x?.msg))
          })
        } else {
          toast.error(error.response.data?.message || 'A problem has occurred with the server.')
        }
      }
    } else {
      if (error?.message === 'Network Error') {
        toast.error('Internet connection problem.')
      } else {
        toast.error('A problem has occurred with the server.')
      }
    }
    return Promise.reject(error)
  }
)

export const getAxiosInstance = (props) => {
  let token = props?.token
  if (!token) {
    try {
      let newStorageToken = localStorage.getItem('redux-token')
      if (newStorageToken) {
        newStorageToken = JSON.parse(newStorageToken)
        const access = newStorageToken?.access
        if (access) token = JSON.parse(access)?.token
      }
    } catch (error) {
      // Handle the error if necessary
    }
  }

  // Update the token in the Axios instance's headers
  axiosInstance.defaults.headers.Authorization = `Bearer ${token}`

  return axiosInstance
}

export default getAxiosInstance
