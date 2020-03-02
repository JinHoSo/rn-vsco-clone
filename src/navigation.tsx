import React from 'react'
import {BackHandler} from 'react-native'
import {connect} from 'react-redux'
import {NavigationActions, NavigationState, SafeAreaView} from 'react-navigation'
import {RootState} from './redux/'
import {reduxifyNavigator} from 'react-navigation-redux-helpers'
import {AppNavigator} from './route'

interface State {
}

interface OwnProps {
}

interface StateProps {
  nav: NavigationState
}

interface DispatchProps {
  back: Function
}

interface Props extends StateProps, DispatchProps, OwnProps {
}

export const navigatorWithRedux = reduxifyNavigator(AppNavigator, 'root')

export const AppWithNavigationState = connect((state: RootState) => ({
  state: state.nav,
}))(navigatorWithRedux as any)


class NavigationScreen extends React.Component<Props, State> {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress)
  }

  onBackPress = () => {
    if (this.props.nav.index === 0) {
      return false
    }

    this.props.back()
    return true
  }

  render() {
    return (
      <AppWithNavigationState/>
    )
  }
}

export const Navigation = connect<StateProps, DispatchProps, OwnProps>((state: RootState) => ({
  nav: state.nav,
}), {
  back: NavigationActions.back,
})(NavigationScreen)