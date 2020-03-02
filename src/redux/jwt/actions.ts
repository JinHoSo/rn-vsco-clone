import actionTypes from './actionTypes'
import {ThunkAction} from 'redux-thunk'
import {RootState} from '../'
import {JwtAction} from './reducer'

export const jwtSave = (token: string) => ({
  type: actionTypes.JWT_SAVE,
  token,
})

export const jwtDelete = () => ({
  type: actionTypes.JWT_DELETE,
})

export function saveJwt(token: string): Thunk {
  return (dispatch, getState) => {
    dispatch(jwtSave(token))
  }
}

export function deleteJwt(): Thunk {
  return (dispatch, getState) => {
    dispatch(jwtDelete())
  }
}

export type Thunk = ThunkAction<void, RootState, null, JwtAction>