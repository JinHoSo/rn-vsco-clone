import React from 'react'
import {StyleSheet, View} from 'react-native'
import {AuthState} from '../redux/auth/reducer'
import {connect} from 'react-redux'
import {RootState} from '../redux'
import {login} from '../redux/auth/actions'
import {NavigationActions} from 'react-navigation'
import {CameraRollPicker} from '../lib/cameraRollPicker'
import {Editor} from './editor'

export type CameraRollImage = {
  uri: string
  height: number
  width: number
  isStored?: boolean
}

interface State {
  picture: CameraRollImage
}

interface OwnProps {
}

interface StateProps {
  auth: AuthState,
}

interface DispatchProps {
  login: typeof login
  navigate: typeof NavigationActions.navigate
}

interface Props extends StateProps, DispatchProps, OwnProps {
}

class RollScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      picture  : null,
    }

    this.getSelectedPictures = this.getSelectedPictures.bind(this)
  }

  async getSelectedPictures(picture) {
    if (picture) {
      // this.setState({
      //   picture  : picture,
      //   isVisible: true,
      // })
      this.props.navigate({routeName: 'Editor', params:{picture, resizeMode:'contain'}})
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <CameraRollPicker
          onSubmit={this.getSelectedPictures}
          maximum={1}/>
      </View>
    )
  }
}

export const
  Roll = connect<StateProps, DispatchProps, OwnProps>((state: RootState) => ({
    auth: state.auth,
  }), {
    login,
    navigate: NavigationActions.navigate,
  })(RollScreen)

const styles = StyleSheet.create({
  container: {
    flex           : 1,
    backgroundColor: '#ffffff',
    padding        : 0,
    margin         : 0,
  },
})