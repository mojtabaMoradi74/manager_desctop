import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import tokenSlice from './token'
import axiosInstance from '../../utils/axios'
import api from 'src/services/api.jsx'

// Actions

// ----------------------------------------------------------------------

export const getAdminProfile = createAsyncThunk(
  'auth/get-admin',
  async (props, {rejectWithValue, getState}) => {
    // dispatch(slice.actions.startLoading());
    try {
      const response = await axiosInstance({token: props?.token}).get(api.users.current)
      for (let i = 0; i < response?.data?.role?.permissions?.length; i++) {
        const curr = response.data.role.permissions[i]
        response.data.permissions = response.data.permissions || {}
        response.data.permissions[curr.type] = curr
      }

      console.log('* * * getAdminProfile :', {response})
      // dispatch(slice.actions.getUserData(data?.data));
      return response?.data
    } catch (error) {
      // dispatch(slice.actions.hasError(error));
      console.log({error})
      rejectWithValue(error)
    }
  }
)

export const Logout = createAsyncThunk('auth/log-out', async (_, {rejectWithValue, dispatch}) => {
  // dispatch(slice.actions.startLoading());
  // alert()
  try {
    // setSession();
    dispatch(slice.actions.getUserData())
    dispatch(tokenSlice.actions.initial())
  } catch (error) {
    // dispatch(slice.actions.hasError(error));
    console.log({error})
    // alert()
    rejectWithValue(error)
  }
})
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  isFetching: false,
  data: false,
}

const slice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true
    },
    // END LOADING
    endLoading(state) {
      state.isLoading = true
    },

    // INIT
    getUserData(state, action) {
      state.isLoading = false
      state.data = action.payload
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(getAdminProfile.pending, (state, action) => {
        if (!state?.data?._id) state.isLoading = true
        else state.isFetching = true
      })
      .addCase(getAdminProfile.rejected, (state, action) => {
        state.isLoading = false
        state.isFetching = false
      })
      .addCase(getAdminProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.isFetching = false
        state.data = action.payload
      })
  },
})

// Reducer
export default slice.reducer
