import {configureStore} from '@reduxjs/toolkit'
import {useDispatch as useAppDispatch, useSelector as useAppSelector} from 'react-redux'
import {persistStore, persistReducer} from 'redux-persist'
import {rootPersistConfig, rootReducer} from './rootReducer'
// import { getAdminProfile } from './slices/user';
// import { isAuthenticated } from '../utils';

// ----------------------------------------------------------------------

const store = configureStore({
  reducer: persistReducer(rootPersistConfig, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
})

const persistor = persistStore(store)

const {dispatch} = store

const useSelector = useAppSelector

const useDispatch = () => useAppDispatch()

export {store, persistor, dispatch, useSelector, useDispatch}
