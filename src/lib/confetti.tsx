'use strict'
import React, {PureComponent} from 'react'
import {View} from 'react-native'
import * as Animatable from 'react-native-animatable'

interface FettiProps {
  color: string
  circle: boolean
  width?: number
  height?: number
  duration?: number
}

class Fetti extends PureComponent<FettiProps, null> {
  static defaultProps = {
    width   : 4,
    height  : 8,
    duration: 500,
  }

  constructor(props: FettiProps) {
    super(props)
  }

  fetti: any
  fettiAnimations = {
    0: {
      translateX: 0,
      translateY: 0,
      rotate    : '0deg',
      opacity   : 1,
    },
  }

  randomPhysics(angle, spread, startVelocity) {
    const radAngle = angle * (Math.PI / 180)
    const radSpread = spread * (Math.PI / 180)

    return {
      x        : Math.random() * 100,
      y        : 0,
      z        : 0,
      wobble   : Math.random() * 10,
      velocity : (startVelocity * 0.5) + (Math.random() * startVelocity),
      angle2D  : -radAngle + ((0.5 * radSpread) - (Math.random() * radSpread)),
      angle3D  : -(Math.PI / 4) + (Math.random() * (Math.PI / 2)),
      tiltAngle: Math.random() * Math.PI * 100,
    }
  }

  updateFetti(fetti, progress, decay) {
    fetti.physics.x += Math.cos(fetti.physics.angle2D) * fetti.physics.velocity
    fetti.physics.y += Math.sin(fetti.physics.angle2D) * fetti.physics.velocity
    fetti.physics.wobble += 0.1
    fetti.physics.y += 3
    fetti.physics.velocity *= (decay * progress * 0.5)
    // fetti.physics.tiltAngle += 0.5

    fetti.translateX = fetti.physics.x + (10 * Math.cos(fetti.physics.wobble))
    fetti.translateY = fetti.physics.y + (10 * Math.sin(fetti.physics.wobble))

    fetti.rotate = fetti.physics.tiltAngle + 'deg'

    fetti.opacity = (1 - progress)
    return fetti
  }

  componentWillMount() {
    const angle = 110, decay = 0.9, spread = this.props.height * 4

    this.fetti = {
      translateX: 0,
      translateY: 0,
      rotate    : '0deg',
      opacity   : 1,
      physics   : this.randomPhysics(angle, decay, spread),
    }
    for (let i = 1; i < 5; i++) {
      const index = i / 5
      this.fetti = this.updateFetti(this.fetti, index, decay)

      this.fettiAnimations[index] = {
        translateX: this.fetti.translateX,
        translateY: this.fetti.translateY,
        rotate    : this.fetti.rotate,
        opacity   : this.fetti.opacity,
      }
    }
  }

  render() {
    const {width, height, circle, color, duration} = this.props
    return (
      <Animatable.View
        animation={
          this.fettiAnimations
        }
        duration={duration}
        easing="linear"
        useNativeDriver
        style={{
          backgroundColor: color,
          width          : width,
          height         : circle ? width : height,
          borderRadius   : circle ? width / 2 : 0,
          position       : 'absolute',
        }}
      />
    )
  }
}

interface ConfettiOptions {
  fettiCount: number
  colors?: string[]
  fettiWidth?: number
  fettiHeight?: number
  duration?: number
}

interface ConfettiState {
  fettis: any[]
  playing: boolean
}

export default class Confetti extends PureComponent<null, ConfettiState> {
  constructor(props) {
    super(props)

    this.state = {
      fettis : [],
      playing: false,
    }
  }

  options: ConfettiOptions = {
    fettiCount : 15,
    fettiWidth : 4,
    fettiHeight: 8,
    colors     : [
      '#E91E63',
      '#00c2b9',
      '#1600f8',
      '#0cc200',
      '#03A9F4',
      '#e74c3c',
      '#bc00ae',
    ],
    duration   : 500,
  }


  render() {
    return (
      <View style={{position: 'relative', top: 0, left: 0}}>
        {this.state.fettis.map((fetti, i) => {
          return <Fetti key={i} color={fetti.color} circle={fetti.circle} width={this.options.fettiWidth}
                        height={this.options.fettiHeight} duration={this.options.duration}/>
        })}
      </View>
    )
  }

  start(options: ConfettiOptions) {
    this.options = {
      ...this.options,
      ...options,
    }

    if (!this.state.playing) {
      const fettis = Array
        .from({length: this.options.fettiCount})
        .map((_, index) => {
          return {
            color : this.options.colors[index % this.options.colors.length],
            circle: index % 3 === 0,
          }
        })

      this.setState({
        fettis : fettis,
        playing: true,
      }, () => {
        setTimeout(() => {
          this.setState({
            fettis : [],
            playing: false,
          })
        }, 500)
      })
    }
  }
}