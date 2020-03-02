import actionTypes from './actionTypes'
import {ThunkAction} from 'redux-thunk'
import {RootState} from '../'
import {FilterSetThumbnail, FilterAction} from './reducer'

export const filterSetThumbnailUpsert = (filterSetThumbnail: FilterSetThumbnail) => ({
  type: actionTypes.UPSERT_FILTER_SET_THUMBNAIL,
  filterSetThumbnail,
})

export const filterSetThumbnailDelete = (filterName: string) => ({
  type: actionTypes.DELETE_FILTER_SET_THUMBNAIL,
  filterName,
})

const filterSetThumbnailClear = () => ({
  type: actionTypes.CLEAR_FILTER_SET_THUMBNAIL,
})

const filterSetThumbnailReset = (filterSetThumbnail: FilterSetThumbnail) => ({
  type: actionTypes.RESET_FILTER_SET_THUMBNAIL,
  filterSetThumbnail,
})

export function upsertFilterSetThumbnail(filterSetThumbnail: FilterSetThumbnail): Thunk {
  return (dispatch, getState) => {
    dispatch(filterSetThumbnailUpsert(filterSetThumbnail))
  }
}

export function deleteFilterSetThumbnail(filterName: string): Thunk {
  return (dispatch, getState) => {
    dispatch(filterSetThumbnailDelete(filterName))
  }
}

export function clearFilterSetThumbnail(): Thunk {
  return (dispatch, getState) => {
    dispatch(filterSetThumbnailClear())
  }
}

export function resetFilterSetThumbnail(filterSetThumbnail: FilterSetThumbnail): Thunk {
  return (dispatch, getState) => {
    dispatch(filterSetThumbnailReset(filterSetThumbnail))
  }
}

export type Thunk = ThunkAction<void, RootState, null, FilterAction>