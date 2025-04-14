import {createContext, useEffect, useMemo, useReducer} from 'react'
import PropTypes from 'prop-types'
// utils
import {useDispatch, useSelector} from 'react-redux'
import {refreshTokenSpacer} from 'src/enumeration'
import {getTimeRemaining} from 'src/utils/dating'
import axios from '../utils/axios'
import {adminProfile} from '../services/admin'
import {getAdminProfile} from '../redux/slices/user'
import tokenSlice, {refreshTokenThunk} from '../redux/slices/token'
import {store} from '../redux/store'
import api from '../services/api'
import {getClientMode, setClientMode} from '../utils'
import {Logout} from 'src/redux/slices/user'

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: {},
}

const handlers = {
  INITIALIZE: (state, action) => {
    const {isAuthenticated, user} = action.payload
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    }
  },
  LOGIN: (state, action) => {
    return {
      ...state,
      isAuthenticated: false,
      login: action.payload,
      // user,
    }
  },
  VERIFY: (state, action) => {
    const {user} = action.payload

    return {
      ...state,
      isAuthenticated: true,
      user,
    }
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
  REGISTER: (state, action) => {
    const {user} = action.payload

    return {
      ...state,
      isAuthenticated: true,
      user,
    }
  },
}

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state

const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
})

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
}

function AuthProvider({children}) {
  const [state, dispatch] = useReducer(reducer, initialState)
  // ------
  const tokenState = useSelector((state) => state.token)
  const adminState = useSelector((state) => state.admin)
  const refreshToken = tokenState?.refresh
  const accessToken = tokenState?.access

  const showComponent = useMemo(() => {
    const currentDate = +new Date()
    if (!refreshToken) return false
    const valid = refreshToken
      ? accessToken?.expiresAt
        ? accessToken?.expiresAt - currentDate - refreshTokenSpacer
        : 0
      : 1
    // if (!valid) queryClient.cancelQueries();
    return valid >= 0
  })

  console.log('* * * RefreshTokenProvider accessToken : ', {
    refreshToken,
    accessToken,
    tokenState,
    showComponent,
    adminState,
  })

  useEffect(() => {
    let timeOutAccess
    let timeOutRefresh

    const checker = async () => {
      if (tokenState?.isLoading) return
      if (refreshToken) {
        const current = +new Date()
        // const eee = new Date(accessToken?.expiresAt);
        let remainingTimeRefresh = refreshToken?.expiresAt - current - refreshTokenSpacer
        const maxTime = 2 * 24 * 60 * 60 * 1000 // 2 days
        if (remainingTimeRefresh > maxTime) remainingTimeRefresh = maxTime
        console.log('* * * RefreshTokenMiddleware : ', {
          remainingTimeRefreshs: getTimeRemaining(remainingTimeRefresh / 1000),
          remainingTimeRefresh,
        })
        if (remainingTimeRefresh <= 0) {
          logout()
          if (timeOutAccess) clearTimeout(timeOutAccess)
        } else {
          timeOutRefresh = setTimeout(() => {
            logout()
            if (timeOutAccess) clearTimeout(timeOutAccess)
          }, remainingTimeRefresh)

          // -------------------------------- access

          if (accessToken?.token) {
            const remainingTime = accessToken?.expiresAt - current - refreshTokenSpacer //- 120000;
            console.log('* * * RefreshTokenMiddleware : ', {
              remainingTimeAccessDate: getTimeRemaining(remainingTime / 1000),
              remainingTime,
            })
            if (remainingTime <= 0) {
              await mainStore.dispatch(refreshTokenThunk())
            } else
              timeOutAccess = setTimeout(async () => {
                await mainStore.dispatch(refreshTokenThunk())
                // const userData = await mainStore.dispatch(getAdminProfile());
              }, remainingTime)
          } else if (refreshToken && !tokenState?.error) mainStore.dispatch(refreshTokenThunk())
        }
      } else if (adminState?.data) {
        logout()
      }

      // timeOutAccess = setTimeout(() => {
      //   mainStore.dispatch(refreshTokenThunk());
      // }, 30000);
    }
    checker()

    return () => {
      if (timeOutRefresh) clearTimeout(timeOutRefresh)
      if (timeOutAccess) clearTimeout(timeOutAccess)
    }
  }, [refreshToken, accessToken])
  // ------

  const mainStore = store

  useEffect(() => {
    const initialize = async () => {
      try {
        // const accessToken = window.localStorage.getItem('accessToken');

        if (accessToken?.token) {
          // setSession(accessToken);

          // const {data} = await adminProfile();
          // const { user } = response.data;
          const userData = await mainStore.dispatch(getAdminProfile())

          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user: userData,
            },
          })
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null,
            },
          })
        }
      } catch (err) {
        console.error(err)
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        })
      }
    }

    if (showComponent) initialize()
  }, [])

  const login = async (email, password) => {
    console.log('* * * AuthProvider login')
    const response = await axios().post(api.auth.login, {
      email,
      password,
    })
    console.log('* * * AuthProvider login', {response})

    // console.log({response})
    // const accessToken = response.data?.data?.accessToken
    // const refreshToken = response.data?.data?.refreshToken

    // mainStore.dispatch(tokenSlice.actions.setAccess(accessToken))
    // mainStore.dispatch(tokenSlice.actions.setRefresh(refreshToken))
    // setSession(accessToken?.token);
    dispatch({
      type: 'LOGIN',
      payload: response?.data,
    })
    return response?.data
  }

  const verify = async (codeMelli, code) => {
    console.log('verify start')
    const response = await axios().post(api.code.verify, {
      verify_code: code,
      code_melli: codeMelli,
    })
    const token = response.data?.token
    // setSession(token);
    console.log({response})
    dispatch({
      type: 'LOGIN',
      payload: {
        user: {},
      },
    })
    return response
  }

  // const publicVerify = async (codeMelli, code) => {
  //   console.log('verify start')
  //   const response = await axios().post(api.client.auth.verify, {
  //     verify_code: code,
  //     code_melli: codeMelli,
  //   })
  //   const token = response.data?.token
  //   // setSession(token);
  //   console.log({response})
  //   dispatch({
  //     type: 'LOGIN',
  //     payload: {
  //       user: {},
  //     },
  //   })
  //   return response
  // }

  const register = async (email, password, firstName, lastName) => {
    const response = await axios().post('/api/account/register', {
      email,
      password,
      firstName,
      lastName,
    })
    const {token} = response.data

    // window.localStorage.setItem('accessToken', token);
    // dispatch({
    //   type: 'REGISTER',
    //   payload: {
    //     user: {},
    //   },
    // })
  }

  const logout = async () => {
    // setSession(null);
    // dispatch({type: 'LOGOUT'})
    // alert()
    mainStore.dispatch(Logout())
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
        verify,
        publicLogin: () => {},
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export {AuthContext, AuthProvider}
