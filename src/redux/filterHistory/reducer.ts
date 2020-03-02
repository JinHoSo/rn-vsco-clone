import actionTypes from './actionTypes'
import {Reducer} from 'redux'
import {default as React} from 'react'

export enum ActionType {
  ADD,
  REMOVE
}

export enum FilterType {
  Filter,
  FilterSet
}

export type FilterHistoryItem = {
  actionType: ActionType
  filterType: FilterType
  filterIcon: () => React.ReactElement<any>
  filterName: string
  value: number
  timestamp: number
}

export interface FilterHistoryState {
  history: FilterHistoryItem[]
  currentIndex: number
  isDirty: boolean
}

export interface FilterHistoryAction {
  type: string
  actionType?: ActionType
  filterType?: FilterType
  filterIcon?: () => React.ReactElement<any>
  filterName?: string
  value?: any
  resetIndex?: number
  isDirty?:boolean
}

const defaultFilterHistoryState: FilterHistoryState = {
  history     : [],
  currentIndex: 0,
  isDirty     : false,
}

export const filterHistory: Reducer<FilterHistoryState, FilterHistoryAction> = (state = defaultFilterHistoryState, action: FilterHistoryAction) => {
  switch (action.type) {
    case actionTypes.ADD_FILTER_HISTORY:
      return {
        currentIndex: 0,
        history     : [{
          actionType: action.actionType,
          filterType: action.filterType,
          filterIcon: action.filterIcon,
          filterName: action.filterName,
          value     : action.value,
          timestamp : Date.now(),
        }, ...state.history],
        isDirty     : true,
      }
    case actionTypes.CLEAR_FILTER_HISTORY:
      return {
        currentIndex: 0,
        history     : [],
        isDirty     : false,
      }
    case actionTypes.SET_DIRTY_FILTER_HISTORY:
      return {
        ...state,
        isDirty: action.isDirty,
      }
    case actionTypes.RESET_FILTER_HISTORY:
      return {
        ...state,
        currentIndex: action.resetIndex,
      }
    case actionTypes.UNDO_FILTER_HISTORY:
      return {
        ...state,
        currentIndex: state.currentIndex + 1 >= state.history.length ? state.currentIndex : state.currentIndex + 1,
      }
    case actionTypes.REDO_FILTER_HISTORY:
      return {
        ...state,
        currentIndex: state.currentIndex - 1 < 0 ? 0 : state.currentIndex - 1,
      }
    default:
      return state
  }
}
