import actionTypes from './actionTypes'
import {ThunkAction} from 'redux-thunk'
import {RootState} from '../'
import {FilterSet, FilterSetAction} from './reducer'
import {filterValueDelete, filterValueUpsert} from '../filterValue/actions'

const filterSetUpsert = (filterName:FilterSet) => ({
  type: actionTypes.UPSERT_FILTER_SET,
  filterName
})

const filterSetClear = () => ({
  type: actionTypes.CLEAR_FILTER_SET
})


export function upsertFilterSet(filterName:FilterSet, defaultSliderValue = 0): Thunk {
  return (dispatch, getState) => {
    const currentFilterSet = getState().filterSet
    // if(currentFilterSet){
    //   dispatch(filterValueDelete(currentFilterSet))
    // }
    // else{
    //   dispatch(filterValueUpsert({
    //     [filterName]:defaultSliderValue
    //   }))
    // }

    dispatch(filterSetUpsert(filterName))
  }
}

export function clearFilterSet(): Thunk {
  return (dispatch, getState) => {
    dispatch(filterSetClear())
  }
}

export type Thunk = ThunkAction<void, RootState, null, FilterSetAction>