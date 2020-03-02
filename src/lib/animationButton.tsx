import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {TouchableWithoutFeedback} from 'react-native'
import {View} from 'react-native-animatable'
import Icon from 'react-native-vector-icons/Feather'

interface State {
  style: any
  isPressed: boolean
}

interface Props {
  activeIcon: string,
  InactiveIcon: string,
  onPress: any,
  active: boolean,
  activeStyle: any,
  inactiveStyle: any,
  activeContainerStyle: any,
  inactiveContainerStyle: any,
}

export class AnimationButton extends PureComponent<Props, State> {
  static propTypes = {
    onPress               : PropTypes.func.isRequired,
    active                : PropTypes.bool,
    activeIcon            : PropTypes.string.isRequired,
    InactiveIcon          : PropTypes.string.isRequired,
    activeStyle           : PropTypes.any.isRequired,
    inactiveStyle         : PropTypes.any.isRequired,
    activeContainerStyle  : PropTypes.any.isRequired,
    inactiveContainerStyle: PropTypes.any.isRequired,
  }

  static defaultProps = {
    active: true,
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
      return this.props.activeIcon
    }
    else {
      return this.props.InactiveIcon
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
    const {active} = this.props
    const style = this.getStyle(active)
    const containerStyle = this.getContainerStyle(active)
    const icon = this.getIcon(active)

    this.doPulse(active)
    return (
      <TouchableWithoutFeedback onPress={this.handlePress.bind(this)}>
        <View
          ref={this.handleRef}
          useNativeDriver={true}
        >
          <View style={{
            display        : 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            ...containerStyle,

          }}>
            <Icon
              name={icon}
              size={style.fontSize}
              color={style.color}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

