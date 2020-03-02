import React from 'react'
import {Button, View, StyleSheet, StatusBar, TouchableOpacity, Text} from 'react-native'
import {auth, AuthState} from '../redux/auth/reducer'
import {connect} from 'react-redux'
import {RootState} from '../redux'
import {login} from '../redux/auth/actions'
import {LoginStatus} from '../components/loginStatus'
import {NavigationActions} from 'react-navigation'
import {CameraRollPicker} from '../lib/cameraRollPicker'
import Swiper from 'react-native-swiper'
import {Feather, Entypo} from 'react-native-vector-icons'
import {Camera} from './camera'
import {hiddenStatusBarSize, statusBarSize} from '../lib/screenSize'
import {isIphoneX} from 'react-native-iphone-x-helper'
import {Roll} from './roll'
import {HAIR_LINE_WIDTH, PRIMARY_COLOR} from '../constant/env'
import {LoadingBar} from '../components/loadingBar'
import {Explore} from './explore'
import {SafeAreaView} from '../components/safeAreaView'
import {headerStyles} from '../route'

interface State {
  slideIndex: number
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

class HomeScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      slideIndex: 1,
    }

    this.onSlideIndexChanged = this.onSlideIndexChanged.bind(this)
    this.goToSlider = this.goToSlider.bind(this)
  }

  swiper: any

  goToSlider(index: number) {
    if (this.swiper) {
      this.swiper.scrollBy(index, true)
    }
  }

  onSlideIndexChanged(slideIndex) {
    this.setState({slideIndex})
  }

  _renderDot(){
    return (
      <View
        style={styles.dot}
      />
    )
  }

  _renderCamera() {
    return (
      <Camera
        enable={this.state.slideIndex === 0}
        goToSlider={this.goToSlider}
      />
    )
  }

  _renderRoll() {
    return (
      <Roll/>
    )
  }

  _renderRollHeader() {
    return (
      <View style={headerStyles.header}>
        <TouchableOpacity
          style={headerStyles.headerIcon}
          onPress={() => this.goToSlider(-1)}
        >
          <Feather
            name="camera"
            size={25}
            color={PRIMARY_COLOR}
          />
        </TouchableOpacity>
        <View style={styles.headerLogoContainer}>
          {
            this._renderDot()
          }
          <Text style={styles.headerLogo}>
            Roll
          </Text>
        </View>
        <TouchableOpacity
          style={headerStyles.headerIcon}
          onPress={() => this.goToSlider(1)}
        >
          <Feather
            name="globe"
            size={25}
            color={PRIMARY_COLOR}
          />
        </TouchableOpacity>
      </View>
    )
  }

  _renderExplore() {
    return (
      <Explore/>
    )
  }

  _renderExploreHeader() {
    return (
      <View style={headerStyles.header}>
        <TouchableOpacity
          style={headerStyles.headerIcon}
          onPress={() => this.goToSlider(-1)}
        >
          <Feather
            name="film"
            size={25}
            color={PRIMARY_COLOR}
          />
        </TouchableOpacity>
        <View style={styles.headerLogoContainer}>
          {
            this._renderDot()
          }
          <Text style={styles.headerLogo}>
            Explore
          </Text>
        </View>
        <TouchableOpacity
          style={headerStyles.headerIcon}
          onPress={() => this.goToSlider(1)}
        >
          <Feather
            name="user"
            size={25}
            color={PRIMARY_COLOR}
          />
        </TouchableOpacity>
      </View>
    )
  }

  _renderSlider() {
    return (
      <Swiper
        ref={ref => {
          this.swiper = ref
        }}
        index={1}
        onIndexChanged={this.onSlideIndexChanged}
        loop={false}
        showsButtons={false}
        showsPagination={false}>
        <View style={styles.container}>
          {
            this._renderCamera()
          }
        </View>
        <View style={styles.container}>
          {
            this._renderRollHeader()
          }
          {
            this._renderRoll()
          }
        </View>
        <View style={styles.container}>
          {
            this._renderExploreHeader()
          }
          {
            this._renderExplore()
          }
        </View>
      </Swiper>
    )
  }


  render() {
    return (
      <SafeAreaView>
        {
          this._renderSlider()
        }
      </SafeAreaView>
    )
  }
}

export const
  Home = connect<StateProps, DispatchProps, OwnProps>((state: RootState) => ({
    auth: state.auth,
  }), {
    login,
    navigate: NavigationActions.navigate,
  })(HomeScreen)

const styles = StyleSheet.create({
  container          : {
    flex           : 1,
    backgroundColor: '#ffffff',
  },
  headerLogoContainer: {
    paddingLeft    : 10,
    paddingRight   : 10,
    height         : 34,
    backgroundColor: '#ffffff',
    borderRadius   : 5,
    flexWrap       : 'wrap',
    alignItems     : 'center',
    justifyContent : 'center',
  },
  headerLogo         : {
    // fontSize  : 20,
    fontSize:16,
    fontWeight: '500',
    color     : PRIMARY_COLOR,
  },
  dot:{
    width:4,
    height:4,
    borderRadius:2,
    backgroundColor:PRIMARY_COLOR
  }
})