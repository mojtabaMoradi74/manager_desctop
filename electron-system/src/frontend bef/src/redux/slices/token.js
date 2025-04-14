import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import api from 'src/services/api.jsx'
// utils
import {setSession, tokenMsAge} from 'src/utils/jwt'
import axios from '../../utils/axios'
//
import {dispatch} from '../store'
import {adminProfile, clientProfile} from '../../services/admin'
import {getAdminProfile} from './user'
import {REHYDRATE} from 'redux-persist'

// Actions

// ----------------------------------------------------------------------

let isRefreshing = false
let refreshSubscribers = []

function onRefreshed(token) {
  refreshSubscribers.forEach((callback) => callback(token))
  refreshSubscribers = []
}

function addRefreshSubscriber(callback) {
  refreshSubscribers.push(callback)
}

export const refreshTokenThunk = createAsyncThunk(
  'token/refresh',
  async (_, {rejectWithValue, getState, dispatch}) => {
    // dispatch(slice.actions.startLoading());

    try {
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((token) => {
            resolve(token)
          })
        })
      }

      isRefreshing = true

      const state = getState()
      const token = state?.token?.refresh?.token
      // console.log('* * * refreshTokenThunk : ', {token})
      const response = await axios({token}).post(api.auth.refresh)
      isRefreshing = false
      // console.log('* * * refreshTokenThunk : ', {response})
      const accessToken = response?.data?.accessToken
      if (!accessToken) return rejectWithValue('notfound')
      const exTimeAccess = tokenMsAge(accessToken)?.expTime
      dispatch(getAdminProfile({token: accessToken}))

      // Call all waiting requests with the new token
      onRefreshed({token: accessToken, expiresAt: exTimeAccess})

      return {token: accessToken, expiresAt: exTimeAccess}
    } catch (error) {
      isRefreshing = false
      // alert('error')
      // dispatch(slice.actions.hasError(error));
      // console.log(error)
      return rejectWithValue(error)
    }
  }
)

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  access: null,
  refresh: null,
}

const slice = createSlice({
  name: 'token',
  initialState: {...initialState},
  reducers: {
    setAccess(state, action) {
      // console.log('* * * action : ', {action})
      // setSession(action.payload?.token);
      state.access = action.payload
    },
    setRefresh(state, action) {
      // console.log('* * * action : ', {action})
      state.refresh = action.payload
    },
    setData(state, action) {
      // console.log('* * * action : ', {action})
      state = action.payload
      return state
    },
    initial(state, action) {
      state = {...initialState}
      return state
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(refreshTokenThunk.pending, (state, action) => {
        // alert('pending')

        state.isLoading = true
        state.access = false
      })
      .addCase(refreshTokenThunk.rejected, (state, action) => {
        // alert('rejected')
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(refreshTokenThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.error = false
        state.access = action.payload
      })
      .addCase(REHYDRATE, (state, action) => {
        state.isLoading = false // Reset isLoading on rehydrate
        state.error = false // Reset isLoading on rehydrate
      })
  },
})

const tokenSlice = {
  ...slice,
}

// Reducer
export default tokenSlice
