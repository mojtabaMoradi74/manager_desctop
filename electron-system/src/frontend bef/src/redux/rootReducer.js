import {combineReducers} from 'redux'
import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
// slices
import adminReducer from './slices/user'
import mailReducer from './slices/mail'
import chatReducer from './slices/chat'
import productReducer from './slices/product'
import calendarReducer from './slices/calendar'
import kanbanReducer from './slices/kanban'
import token from './slices/token'
import modal from './slices/modal'

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['token'],
}
const tokenPersistConfig = {
  key: 'token',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['access', 'refresh'],
}

const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
}

const rootReducer = combineReducers({
  admin: adminReducer,
  mail: mailReducer,
  chat: chatReducer,
  calendar: calendarReducer,
  kanban: kanbanReducer,
  product: productReducer,
  token: persistReducer(tokenPersistConfig, token.reducer),
  modal: modal.reducer,
})

export {rootPersistConfig, rootReducer}
