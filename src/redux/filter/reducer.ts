import actionTypes from './actionTypes'
import {Reducer} from 'redux'
import {Filter} from 'expo-pixi'

export type Filter = {
  [filterName: string]: Filter
}

export interface FilterState extends Filter {
}

export interface FilterAction {
  type: string
  filterName?: string
  filter?: Filter,
}

const defaultFilterState: FilterState = {}

export const filter: Reducer<FilterState, FilterAction> = (state = defaultFilterState, action: FilterAction) => {
  switch (action.type) {
    case actionTypes.UPSERT_FILTER:
      return Object.assign({}, state, action.filter)
    case actionTypes.DELETE_FILTER:
      delete state[action.filterName]
      return Object.assign({}, state)
    case actionTypes.CLEAR_FILTER:
      return {}
    case actionTypes.RESET_FILTER:
      return Object.assign({}, action.filter)
    default:
      return state
  }
}