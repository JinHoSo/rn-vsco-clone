import actionTypes from './actionTypes'
import {Reducer} from 'redux'

export type LoadingBarState = string[]

export interface LoadingBarAction {
  type: string
  id?: string
}

export const loadingBar: Reducer<LoadingBarState, LoadingBarAction> = (state = [], action: LoadingBarAction) => {
  switch (action.type) {
    case actionTypes.LOADING_BAR_ON:
      return state.concat([action.id])
    case actionTypes.LOADING_BAR_OFF:
      return state.filter(x => x !== action.id)
    default:
      return state
  }
}

