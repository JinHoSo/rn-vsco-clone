import actionTypes from './actionTypes'
import {ThunkAction} from 'redux-thunk'
import {RootState} from '../'
import {Filter, FilterAction} from './reducer'

const filterUpsert = (filter:Filter) => ({
  type: actionTypes.UPSERT_FILTER,
  filter
})

const filterDelete = (filterName:string) => ({
  type: actionTypes.DELETE_FILTER,
  filterName
})

const filterClear = () => ({
  type: actionTypes.CLEAR_FILTER
})

const filterReset = (filter:Filter) => ({
  type: actionTypes.RESET_FILTER,
  filter
})

export function upsertFilter(filter:Filter): Thunk {
  return (dispatch, getState) => {
    dispatch(filterUpsert(filter))
  }
}

export function deleteFilter(filterName:string): Thunk {
  return (dispatch, getState) => {
    dispatch(filterDelete(filterName))
  }
}

export function clearFilter(): Thunk {
  return (dispatch, getState) => {
    dispatch(filterClear())
  }
}

export function resetFilter(filter:Filter): Thunk {
  return (dispatch, getState) => {
    dispatch(filterReset(filter))
  }
}

export type Thunk = ThunkAction<void, RootState, null, FilterAction>