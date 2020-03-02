import actionTypes from './actionTypes'
import {Reducer} from 'redux'
import {Filter} from 'expo-pixi'

export type FilterSetThumbnailValue = {
  filterTitle:string
  filters:Filter[]
  thumbnailUri:string
  isFiltering:boolean
}

export type FilterSetThumbnail = {
  [filterName: string]: FilterSetThumbnailValue
}

export interface FilterSetThumbnailState extends FilterSetThumbnail {
}

export interface FilterAction {
  type: string
  filterName?: string
  filterSetThumbnail?: FilterSetThumbnail,
}

const defaultFilterSetThumbnailState: FilterSetThumbnailState = {}

export const filterSetThumbnail: Reducer<FilterSetThumbnailState, FilterAction> = (state = defaultFilterSetThumbnailState, action: FilterAction) => {
  switch (action.type) {
    case actionTypes.UPSERT_FILTER_SET_THUMBNAIL:
      return Object.assign({}, state, action.filterSetThumbnail)
    case actionTypes.DELETE_FILTER_SET_THUMBNAIL:
      delete state[action.filterName]
      return Object.assign({}, state)
    case actionTypes.CLEAR_FILTER_SET_THUMBNAIL:
      return {}
    case actionTypes.RESET_FILTER_SET_THUMBNAIL:
      return Object.assign({}, action.filterSetThumbnail)
    default:
      return state
  }
}