import actionTypes from './actionTypes'
import {ThunkAction} from 'redux-thunk'
import {RootState} from '../'
import {JwtAction} from './reducer'

export const loadingBarOn = (id: string) => ({
  type: actionTypes.LOADING_BAR_ON,
  id,
})

export const loadingBarOff = (id: string) => ({
  type: actionTypes.LOADING_BAR_OFF,
  id
})

export function onLoadingBar(id: string): Thunk {
  return (dispatch, getState) => {
    dispatch(loadingBarOn(id))
  }
}

export function offLoadingBar(id: string): Thunk {
  return (dispatch, getState) => {
    dispatch(loadingBarOff(id))
  }
}

export type Thunk = ThunkAction<void, RootState, null, JwtAction>