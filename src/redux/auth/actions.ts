import actionTypes from './actionTypes'
import {ThunkAction} from 'redux-thunk'
import {RootState} from '../'
import {AuthAction} from './reducer'
import {jwtDelete, jwtSave} from '../jwt/actions'
import {NavigationActions, StackActions} from 'react-navigation'

const authSuccess = () => ({
  type: actionTypes.AUTH_SUCCESS,
})

const authFail = () => ({
  type: actionTypes.AUTH_FAIL,
})

export function login(token: string): Thunk {
  return (dispatch, getState) => {
    dispatch(jwtSave(token))
    dispatch(authSuccess())
    // dispatch(StackActions.reset({
    //   index  : 0,
    //   actions: [
    //     NavigationActions.navigate({routeName: 'Profile'}),
    //   ],
    // }))
  }
}

export function logout(): Thunk {
  return (dispatch, getState) => {
    dispatch(jwtDelete())
    dispatch(authFail())
    // dispatch(StackActions.reset({
    //   index  : 0,
    //   actions: [
    //     NavigationActions.navigate({routeName: 'Home'}),
    //   ],
    // }))
  }
}

export type Thunk = ThunkAction<void, RootState, null, AuthAction>