import React from 'react'
import {Text} from 'react-native'
import {AuthState} from '../redux/auth/reducer'
import {connect} from 'react-redux'
import {RootState} from '../redux'

interface State {
}

interface OwnProps {
}

interface StateProps {
  auth: AuthState,
}

interface DispatchProps {
}

interface Props extends StateProps, DispatchProps, OwnProps {
}

class LoginStatusComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
  }

  render() {
    return (
        <Text>
          is logged in : { this.props.auth.isAuthenticated ? 'Yes' : 'No' }
        </Text>
    )
  }
}

export const LoginStatus = connect<StateProps, DispatchProps, OwnProps>((state: RootState) => ({
  auth: state.auth,
}), {
})(LoginStatusComponent)