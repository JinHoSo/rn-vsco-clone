import React, {PureComponent} from 'react'
import {TouchableWithoutFeedback, Text, TextStyle, ViewStyle} from 'react-native'
import {View} from 'react-native-animatable'

interface State {
  style: any
  isPressed: boolean
}

interface Props {
  text: string
  onPress: any
  active?: boolean
  activeStyle?: TextStyle
  inactiveStyle?: TextStyle
  activeContainerStyle?: ViewStyle
  inactiveContainerStyle?: ViewStyle
}

export class AnimationText extends PureComponent<Props, State> {
  static defaultProps = {
    text                  : '',
    onPress               : () => null,
    active                : true,
    activeStyle           : {},
    inactiveStyle         : {},
    activeContainerStyle  : {},
    inactiveContainerStyle: {},
  }

  constructor(props: Props) {
    super(props)
  }

  ref = null
  handleRef = ref => {
    this.ref = ref
  }

  handlePress = () => {
    if (this.props.onPress) {
      this.props.onPress()
    }
    this.doPulse(this.props.active)
  }

  doPulse(isActive: boolean) {
    if (this.ref && isActive) {
      this.ref.pulse(500)
    }
    else if(this.ref && !isActive){
      this.ref.shake(500)
    }
  }

  getStyle(isActive: boolean) {
    if (isActive) {
      return this.props.activeStyle
    }
    else {
      return this.props.inactiveStyle
    }
  }

  getContainerStyle(isActive: boolean) {
    if (isActive) {
      return this.props.activeContainerStyle
    }
    else {
      return this.props.inactiveContainerStyle
    }
  }

  render() {
    const {active, text} = this.props

    const style = this.getStyle(active)
    const containerStyle = this.getContainerStyle(active)
    // this.doPulse(active)
    return (
      <TouchableWithoutFeedback onPress={this.handlePress.bind(this)}>
        <View animation='pulse' ref={this.handleRef} useNativeDriver={true} style={containerStyle}>
          <Text
            style={[{
              textAlign   : 'center',
              paddingLeft : 10,
              paddingRight: 10,
            }, style]}
          >
            {text}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

