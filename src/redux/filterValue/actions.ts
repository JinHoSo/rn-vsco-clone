import actionTypes from './actionTypes'
import {ThunkAction} from 'redux-thunk'
import {RootState} from '../'
import {FilterValue, FilterAction} from './reducer'

export const filterValueUpsert = (filterValue:FilterValue) => ({
  type: actionTypes.UPSERT_FILTER_VALUE,
  filterValue
})

export const filterValueDelete = (filterName:string) => ({
  type: actionTypes.DELETE_FILTER_VALUE,
  filterName
})

const filterValueClear = () => ({
  type: actionTypes.CLEAR_FILTER_VALUE
})

const filterValueReset = (filterValue:FilterValue) => ({
  type: actionTypes.RESET_FILTER_VALUE,
  filterValue
})

export function upsertFilterValue(filterValue:FilterValue): Thunk {
  return (dispatch, getState) => {
    dispatch(filterValueUpsert(filterValue))
  }
}

export function deleteFilterValue(filterName:string): Thunk {
  return (dispatch, getState) => {
    dispatch(filterValueDelete(filterName))
  }
}

export function clearFilterValue(): Thunk {
  return (dispatch, getState) => {
    dispatch(filterValueClear())
  }
}

export function resetFilterValue(filterValue:FilterValue): Thunk {
  return (dispatch, getState) => {
    dispatch(filterValueReset(filterValue))
  }
}

export type Thunk = ThunkAction<void, RootState, null, FilterAction>