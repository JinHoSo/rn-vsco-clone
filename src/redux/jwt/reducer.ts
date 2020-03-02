import actionTypes from './actionTypes'
import {Reducer} from 'redux'

export interface JwtState {
  token: string,
}

export interface JwtAction {
  type: string
  token?: string
}

const defaultJwtState = {
  token: '',
}

export const jwt: Reducer<JwtState, JwtAction> = (state = defaultJwtState, action: JwtAction) => {
  switch (action.type) {
    case actionTypes.JWT_SAVE:
      return {
        token: action.token,
      }
    case actionTypes.JWT_DELETE:
      return {
        token: '',
      }
    default:
      return state
  }
}

