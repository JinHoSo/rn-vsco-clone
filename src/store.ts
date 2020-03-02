import Config from 'react-native-config'

import {NavigationState} from 'react-navigation'

import {applyMiddleware, compose, createStore} from 'redux'
import {createReactNavigationReduxMiddleware} from 'react-navigation-redux-helpers'

import createSensitiveStorage from 'redux-persist-sensitive-storage'

import logger from 'redux-logger'
import thunk from 'redux-thunk'
import {persistReducer, persistStore} from 'redux-persist'

import {rootReducer, RootState} from './redux'
import {stage} from './constant/env'
import {AsyncStorage} from 'react-native'

//for persist
const sensitiveStorage = createSensitiveStorage({
  keychainService      : Config.KEYCHAIN_SERVICE,
  sharedPreferencesName: Config.SHARED_PREFERENCES_NAME,
})

// const normalPersistConfig: PersistConfig = {
//   key    : 'root',
//   storage: AsyncStorage,
// }
//
// const normalPersistedReducer = persistReducer(normalPersistConfig, rootReducer)

const sensitivePersistConfig = {
  key    : 'root',
  whitelist : ['jwt'],
  storage: AsyncStorage,
}

const sensitivePersistedReducer = persistReducer(sensitivePersistConfig, rootReducer)

const navigationReduxMiddleware = createReactNavigationReduxMiddleware(
  'root',
  (state) => (state as RootState).nav as NavigationState,
)

function getMiddleware(){
  if(stage === 'dev'){
    // return [navigationReduxMiddleware, thunk, logger]
    return [navigationReduxMiddleware, thunk]
  }

  return [navigationReduxMiddleware, thunk]
}
export const store = createStore(
  // combineReducers({
  //   root: rootPersistedReducer,
  //   jwt : jwtPersistedReducer,
  // }),
  sensitivePersistedReducer,
  compose(applyMiddleware(...getMiddleware())),
)

export const persistor = persistStore(store)