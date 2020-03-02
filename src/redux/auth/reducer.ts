import actionTypes from './actionTypes'
import {Reducer} from 'redux'

export interface AuthState {
  isLoading: boolean
  isAuthenticated: boolean
}

export interface AuthAction {
  type: string
}

const defaultAuthState = {
  isLoading      : false,
  isAuthenticated: false,
} as AuthState

export const auth: Reducer<AuthState, AuthAction> = (state = defaultAuthState, action: AuthAction) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return {
        isAuthenticated: false,
        isLoading      : true,
      }
    case actionTypes.AUTH_SUCCESS:
      return {
        isAuthenticated: true,
        isLoading      : false,
      }
    case actionTypes.AUTH_FAIL:
      return {
        isAuthenticated: false,
        isLoading      : false,
      }
    default:
      return state
  }
}

