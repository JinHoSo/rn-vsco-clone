import actionTypes from './actionTypes'
import {ThunkAction} from 'redux-thunk'
import {RootState} from '../'
import {ActionType, FilterHistoryAction, FilterType} from './reducer'
import {default as React} from 'react'
import {resetFilter} from '../filter/actions'
import {resetFilterValue} from '../filterValue/actions'
import {EventRegister} from 'react-native-event-listeners'
import {SELECT_FILTER_SET} from '../../components/filterSet/filterSetComponent'
import {SELECT_FILTER} from '../../components/filterValue/filterValueComponent'

export const filterHistoryAdd = (actionType:ActionType, filterType:FilterType, filterIcon: (iconColor?) => React.ReactElement<any>, filterName: string, value: number) => ({
  type: actionTypes.ADD_FILTER_HISTORY,
  actionType,
  filterType,
  filterIcon,
  filterName,
  value,
})

export function addFilterHistory(actionType: ActionType, filterType:FilterType,filterIcon: (iconColor?) => React.ReactElement<any>, filterName: string, value: number): Thunk {
  return (dispatch, getState) => {
    if (actionType === ActionType.REMOVE) {
      const filterHistory = getState().filterHistory
      const hasAddedFilter = filterHistory.history.findIndex((fh) => fh.filterName === filterName && fh.actionType === ActionType.ADD)

      if (hasAddedFilter === -1) {
        return
      }
    }

    dispatch(filterHistoryAdd(actionType, filterType, filterIcon, filterName, value))
  }
}

export function clearFilterHistory(): Thunk {
  return (dispatch, getState) => {
    dispatch({
      type: actionTypes.CLEAR_FILTER_HISTORY,
    })
  }
}

export function undoFilterHistory(): Thunk {
  return (dispatch, getState) => {
    dispatch({
      type: actionTypes.UNDO_FILTER_HISTORY,
    })
  }
}

export function redoFilterHistory(): Thunk {
  return (dispatch, getState) => {
    dispatch({
      type: actionTypes.REDO_FILTER_HISTORY,
    })
  }
}

export function resetFilterHistoryIndex(resetIndex: number): Thunk {
  return (dispatch, getState) => {

    let filterValues = {}
    let filterSets = null

    EventRegister.emit(SELECT_FILTER, {deselect:true})
    EventRegister.emit(SELECT_FILTER_SET, {deselect:true})

    if (resetIndex >= 0) {
      const filterHistory = getState().filterHistory.history
      const resetFilterHistory = filterHistory.slice(resetIndex)

      resetFilterHistory.forEach(async (fh) => {
        if(fh.filterType === FilterType.Filter && filterValues[fh.filterName] === undefined){
          filterValues[fh.filterName] = fh
          EventRegister.emit(SELECT_FILTER, {filterName: fh.filterName, value: fh.value})
        }
        else if(fh.filterType === FilterType.FilterSet && !filterSets){
          filterSets = fh
          EventRegister.emit(SELECT_FILTER_SET, {filterName: fh.filterName, value: fh.value})
        }
      })
    }

    dispatch({
      type: actionTypes.RESET_FILTER_HISTORY,
      resetIndex,
    })
  }
}

export function setDirtyFilterHistory(isDirty):Thunk {
  return (dispatch, getState) => {
    dispatch({
      type: actionTypes.SET_DIRTY_FILTER_HISTORY,
      isDirty
    })
  }
}

export type Thunk = ThunkAction<void, RootState, null, FilterHistoryAction>