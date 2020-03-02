import actionTypes from './actionTypes'
import {Reducer} from 'redux'
import {Filter} from 'expo-pixi'

export type FilterValue = {
  [filterName: string]: number
}

export interface FilterValueState extends FilterValue {
}

export interface FilterAction {
  type: string
  filterName?: string
  filterValue?: FilterValue,
}

const defaultFilterState: FilterValueState = {}

export const filterValue: Reducer<FilterValueState, FilterAction> = (state = defaultFilterState, action: FilterAction) => {
  switch (action.type) {
    case actionTypes.UPSERT_FILTER_VALUE:
      return Object.assign({}, state, action.filterValue)
    case actionTypes.DELETE_FILTER_VALUE:
      delete state[action.filterName]
      return Object.assign({}, state)
    case actionTypes.CLEAR_FILTER_VALUE:
      return {}
    case actionTypes.RESET_FILTER_VALUE:
      return Object.assign({}, action.filterValue)
    default:
      return state
  }
}