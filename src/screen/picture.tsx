import React from 'react'
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {AuthState} from '../redux/auth/reducer'
import {connect} from 'react-redux'
import {RootState} from '../redux'
import {login} from '../redux/auth/actions'
import {NavigationActions, NavigationScreenProp} from 'react-navigation'
import PinchZoomView from 'react-native-pinch-zoom-view'
import {screenHeight, screenWidth} from '../lib/screenSize'
import ScaledImage from 'react-native-scaled-image'
import {SafeAreaView} from '../components/safeAreaView'
import {HAIR_LINE_WIDTH, PRIMARY_COLOR} from '../constant/env'
import {Feather, Entypo} from 'react-native-vector-icons'
import {headerStyles} from '../route'
import {getImageSize} from '../lib/imageSize'
import ZoomableScrollView from '../components/zoomableScrollView/ZoomableScrollView'

export type Picture = {
  uri: string
  height: number
  width: number
}

interface State {
}

interface OwnProps {
  navigation?: NavigationScreenProp<State>
  picture: Picture
}

interface StateProps {
  auth: AuthState,
}

interface DispatchProps {
  login: typeof login
  navigate: typeof NavigationActions.navigate
  back: typeof NavigationActions.back
}

interface Props extends StateProps, DispatchProps, OwnProps {
}

class PictureScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.picture = props.navigation.getParam('picture')

    //100 is included header and image controller heights
    const newImageSize = getImageSize(this.picture.width, this.picture.height, screenWidth, screenHeight - 100)

    this.pictureWidth = newImageSize.width
    this.pictureHeight = newImageSize.height
  }

  picture: Picture
  pictureWidth: number
  pictureHeight: number

  render() {
    return (
      <SafeAreaView>
        <View style={headerStyles.header}>
          <TouchableOpacity
            style={headerStyles.headerBackIcon}
            onPress={() => this.props.back()}
          >
            <Feather
              name="chevron-left"
              size={25}
              color={PRIMARY_COLOR}
            />
          </TouchableOpacity>
        </View>
        <ZoomableScrollView pictures={[this.picture]}/>
      </SafeAreaView>
    )
  }
}

export const
  Picture = connect<StateProps, DispatchProps, OwnProps>((state: RootState) => ({
    auth: state.auth,
  }), {
    login,
    navigate: NavigationActions.navigate,
    back    : NavigationActions.back,
  })(PictureScreen)

const styles = StyleSheet.create({
  container: {
    flex           : 1,
    backgroundColor: '#ffffff',
    padding        : 0,
    margin         : 0,
  },
})