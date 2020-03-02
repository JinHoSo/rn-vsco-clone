import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {TouchableWithoutFeedback, Text} from 'react-native'
import {View} from 'react-native-animatable'
import Icon from 'react-native-vector-icons/Feather'

interface State {
  style: any
  isPressed: boolean
}

interface Props {
  text: string
  onPress: any
  active: boolean
  activeStyle: any
  inactiveStyle: any
}

export class AnimationLogoTitle extends PureComponent<Props, State> {
  static propTypes = {
    text                  : PropTypes.string.isRequired,
    onPress               : PropTypes.func.isRequired,
    active                : PropTypes.bool.isRequired,
    activeStyle           : PropTypes.any.isRequired,
    inactiveStyle         : PropTypes.any.isRequired,
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
    this.doPulse(true)
  }

  doPulse(isActive: boolean) {
    if (this.ref && isActive) {
      this.ref.pulse(500)
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

  getIcon(isActive: boolean) {
    if (isActive) {
      return 'compass'
    }
    else {
      return 'compass'
    }
  }

  render() {
    const {active, text} = this.props
    const style = this.getStyle(active)
    const icon = this.getIcon(active)
    this.doPulse(active)
    return (
      <TouchableWithoutFeedback onPress={this.handlePress.bind(this)}>
        <View style={{
          flex         : 1,
          flexWrap     : 'wrap',
          flexDirection: 'row',
          alignItems:'center',
        }}
              ref={this.handleRef}
              useNativeDriver={true}
        >
          <Text
            style={{
              fontWeight  : '100',
              textAlign   : 'center',
              paddingLeft : 10,
              paddingRight: 10,
              ...style,
            }}
          >
            DUO
          </Text>

          <Icon
            name={icon}
            size={30}
            color={style.color}
          />

          <Text
            style={{
              fontWeight  : '100',
              textAlign   : 'center',
              paddingLeft : 10,
              paddingRight: 10,
              ...style,
            }}
          >
            CAMP
          </Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

