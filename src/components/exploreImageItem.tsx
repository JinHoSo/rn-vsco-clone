import React, {PureComponent} from 'react'
import {StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native'
import {screenWidth} from '../lib/screenSize'
import {View as AnimationView} from 'react-native-animatable'
import ScaledImage from 'react-native-scaled-image'
import {Ionicons} from '@expo/vector-icons'
import {LIMITED_CLAP_COUNT} from '../constant/env'

const IMAGE_WIDTH = (screenWidth - 40) / 2
import Confetti from '../lib/confetti'
import {NavigationActions} from 'react-navigation'
import {login} from '../redux/auth/actions'
import {connect} from 'react-redux'
import {RootState} from '../redux'
import {AuthState} from '../redux/auth/reducer'

type MasonryImage = {
  width: number
  height: number
  uri: string
  createdAt: number
  clap?: number
}

interface State {
  isClapping: boolean
  clapCount: number
}

interface OwnProps {
  item: MasonryImage
}

interface StateProps {
}

interface DispatchProps {
  navigate: typeof NavigationActions.navigate
}

interface Props extends StateProps, DispatchProps, OwnProps {
}

export class ExploreImageItemComponent extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.originClapCount = this.props.item && this.props.item.clap ? this.props.item.clap : 0

    this.state = {
      isClapping: false,
      clapCount : this.originClapCount,
    }

    this.doPulse = this.doPulse.bind(this)
    this.startRepeatDoPulse = this.startRepeatDoPulse.bind(this)
    this.stopRepeatDoPulse = this.stopRepeatDoPulse.bind(this)
  }

  animationViewRef = null

  confettiViewRef = null

  clappingTimer = null
  originClapCount: number

  startingClappingTimer = null
  isStartingClapping = false

  startClapInterval = null

  doPulse() {
    if (this.isStartingClapping) {
      clearTimeout(this.startingClappingTimer)

      if (this.animationViewRef) {
        this.animationViewRef.pulse(300)
      }

      if (this.confettiViewRef) {
        this.confettiViewRef.start({fettiCount: 15, fettiWidth: 10, fettiHeight: 20})
      }

      if (LIMITED_CLAP_COUNT > this.state.clapCount - this.originClapCount) {
        this.setState({
          clapCount: this.state.clapCount + 1,
        })
      }

      if (!this.state.isClapping) {
        this.setState({
          isClapping: true,
        })
      }

      if (this.clappingTimer) {
        clearTimeout(this.clappingTimer)
      }

      this.clappingTimer = setTimeout(() => {
        this.setState({
          isClapping: false,
        })

        this.isStartingClapping = false
      }, 300)
    }
    else {
      this.isStartingClapping = true
      this.startingClappingTimer = setTimeout(() => {
        this.isStartingClapping = false
        this.props.navigate({routeName: 'Picture', params: {picture: this.props.item}})
      }, 300)
    }
  }

  startRepeatDoPulse() {
    this.startClapInterval = setInterval(() => {
      this.doPulse()
    }, 200)
  }

  stopRepeatDoPulse() {
    if (this.startClapInterval) {
      clearInterval(this.startClapInterval)
    }
  }

  _renderConfetti() {
    return (
      <Confetti
        ref={(ref) => this.confettiViewRef = ref}
      />
    )
  }

  _renderClap() {
    if (this.state.clapCount > 0) {
      return (
        <View style={styles.imageClapContainer}>
          <Ionicons
            name='md-hand'
            size={11}
            color={this.state.isClapping ? '#ff13ef' : '#b3b3b3'}
            style={styles.imageClap}
          />
          <Text style={[styles.imageInfoText, {color: this.state.isClapping ? '#ff13ef' : '#b3b3b3'}]}>
            {
              this.state.clapCount
            }
          </Text>
        </View>
      )
    }

    return null
  }

  _renderImageInfo(item: MasonryImage) {
    return (
      <View
        style={styles.imageInfoContainer}>
        <Text style={styles.imageInfoText}>
          @JinHoSo
        </Text>
        {
          this._renderConfetti()
        }
        {
          this._renderClap()
        }
      </View>
    )
  }

  generateStyle(decisionNumber) {
    const decisionPaddingLeft = parseInt(decisionNumber) * 1.5 + 5
    const decisionPaddingVertical = parseInt(decisionNumber) * 1.5 + 7

    return {
      paddingLeft  : decisionPaddingLeft,
      paddingRight : Math.max(0, 10 - decisionPaddingLeft),
      paddingTop   : decisionPaddingVertical,
      paddingBottom: decisionPaddingVertical,
      // borderWidth  : 1,
      // borderColor  : 'red',
    }
  }

  render() {
    const item = this.props.item
    const decisionNumber = item.createdAt.toString().slice(-1)
    const style = `align${decisionNumber}`
    const width = IMAGE_WIDTH - (parseInt(decisionNumber) * 1.5) - 5

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={this.doPulse}
        onLongPress={this.startRepeatDoPulse}
        onPressOut={this.stopRepeatDoPulse}
      >
        <AnimationView
          animation='pulse'
          ref={(ref) => this.animationViewRef = ref}
          useNativeDriver={true}
        >
          <View style={[this.generateStyle(decisionNumber)]}>
            <ScaledImage source={{uri: item.uri}} width={width}/>
            {
              this._renderImageInfo(item)
            }
          </View>
        </AnimationView>
      </TouchableOpacity>
    )
  }
}

export const
  ExploreImageItem = connect<StateProps, DispatchProps, OwnProps>((state: RootState) => ({}), {
    navigate: NavigationActions.navigate,
  })(ExploreImageItemComponent)

const styles = StyleSheet.create({
  imageInfoContainer: {
    flexWrap     : 'wrap',
    flexDirection: 'row',
    marginTop    : 5,
    // backgroundColor: '#fafafa',
    // borderBottomWidth: HAIR_LINE_WIDTH,
    // borderColor      : '#f5f5f5',
  },
  imageInfoText     : {
    fontSize: 10,
    color   : '#b3b3b3',
  },
  imageClapContainer: {
    flexWrap     : 'wrap',
    flexDirection: 'row',
  },
  imageClap         : {
    marginLeft : 5,
    marginRight: 2,
    transform  : [
      {rotate: '-40deg'},
    ],
  },
  align0            : {
    flexDirection : 'column',
    justifyContent: 'center',
    alignItems    : 'flex-end',
  },
  align1            : {
    flexDirection : 'column',
    justifyContent: 'flex-start',
    alignItems    : 'flex-end',
  },
  align2            : {
    flexDirection : 'column',
    justifyContent: 'flex-start',
    alignItems    : 'center',
  },
  align3            : {
    flexDirection : 'column',
    justifyContent: 'flex-start',
    alignItems    : 'flex-start',
  },
  align4            : {
    flexDirection : 'column',
    justifyContent: 'center',
    alignItems    : 'flex-start',
  },
  align5            : {
    flexDirection : 'column',
    justifyContent: 'flex-end',
    alignItems    : 'flex-start',
  },
  align6            : {
    flexDirection : 'column',
    justifyContent: 'flex-end',
    alignItems    : 'center',
  },
  align7            : {
    flexDirection : 'column',
    justifyContent: 'flex-end',
    alignItems    : 'flex-end',
  },
  align8            : {
    flexDirection : 'column',
    justifyContent: 'center',
    alignItems    : 'center',
  },
  align9            : {
    flexDirection : 'column',
    justifyContent: 'center',
    alignItems    : 'center',
  },
})