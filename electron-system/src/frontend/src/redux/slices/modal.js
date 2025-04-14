import {createSlice} from '@reduxjs/toolkit'
// utils
//

// ----------------------------------------------------------------------

const initialState = {
  // isLoading : false ,
  data: false,
}

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setData: (state, action) => {
      state.data = action?.payload
    },
  },
})

// Reducer
export default modalSlice

// Actions

// ----------------------------------------------------------------------
