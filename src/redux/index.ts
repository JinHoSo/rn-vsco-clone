import {combineReducers} from 'redux'
import {auth, AuthState} from './auth/reducer'
import {PersistedState} from 'redux-persist/es/types'
import {createNavigationReducer, ReducerState as NavigationReducerState} from 'react-navigation-redux-helpers'
import {AppNavigator} from '../route'
import {jwt, JwtState} from './jwt/reducer'
import {filter, FilterState} from './filter/reducer'
import {filterHistory, FilterHistoryState} from './filterHistory/reducer'
import {filterValue, FilterValueState} from './filterValue/reducer'
import {filterSet, FilterSetState} from './filterSet/reducer'
import {filterSetThumbnail, FilterSetThumbnailState} from './filterSetThumbnail/reducer'
import {loadingBar, LoadingBarState} from './loadingBar/reducer'
//for navigation
export const navReducer = createNavigationReducer(AppNavigator)

export interface RootState extends PersistedState {
  auth: AuthState,
  jwt: JwtState,
  nav: NavigationReducerState,
  filter: FilterState,
  filterHistory: FilterHistoryState,
  filterValue: FilterValueState,
  filterSet: FilterSetState,
  filterSetThumbnail: FilterSetThumbnailState
  loadingBar: LoadingBarState
}

export const rootReducer = combineReducers<RootState>({
  auth,
  jwt,
  nav: navReducer,
  filter,
  filterHistory,
  filterValue,
  filterSet,
  filterSetThumbnail,
  loadingBar
})