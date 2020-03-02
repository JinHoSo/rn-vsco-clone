import actionTypes from './actionTypes'
import {Reducer} from 'redux'

export type FilterSet = string

export type FilterSetState = FilterSet

export interface FilterSetAction {
  type: string
  filterName?: string
}

const defaultFilterSetState = null

export const filterSet: Reducer<FilterSet, FilterSetAction> = (state = defaultFilterSetState, action: FilterSetAction) => {
  switch (action.type) {
    case actionTypes.UPSERT_FILTER_SET:
      return action.filterName
    case actionTypes.CLEAR_FILTER_SET:
      return null
    default:
      return state
  }
}