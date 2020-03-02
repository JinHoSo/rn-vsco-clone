import React, {Component, PureComponent} from 'react'
import {Animated, StyleSheet} from 'react-native'
import randomColor from 'randomcolor';
import {screenHeight} from './screenSize'

interface State{
}

interface Props{
  width:number
  disabled:boolean
}

const DELAY = 100

export class AnimationBar extends PureComponent<Props, State> {
  constructor(props) {
    super(props);

    const colorOptions = {
      // hue:'monochrome'
    }

    this.height = new Animated.Value(0);
    this.color = randomColor(colorOptions)

    this.generateRandomValue = this.generateRandomValue.bind(this)
    this.animateTo = this.animateTo.bind(this)
    this.startAnimation= this.startAnimation.bind(this)
  }

  generateRandomValue (){
    return Math.floor(Math.random() * screenHeight / 2)
  }
  color:string
  height
  interval: any

  startAnimation(){
    this.animateTo(DELAY, this.generateRandomValue());
    this.interval = setInterval(() => {
      this.animateTo(DELAY, this.generateRandomValue());
    }, 1000)
  }

  stopAnimation(){
    clearInterval(this.interval)
    this.animateTo(DELAY, 0);
  }

  componentDidMount(){
    if(this.props.disabled === false){
      this.startAnimation()
    }
  }

  componentWillUnmount() {
    this.stopAnimation()
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.disabled !== this.props.disabled){
      if(nextProps.disabled === true){
        this.stopAnimation()
      }
      else{
        this.startAnimation()
      }
    }
  }

  animateTo = (delay, value) => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(this.height, {
        toValue: value,
      }),
    ]).start();
  }

  render() {
    const barStyles = {
      backgroundColor: this.color,
      height: this.height,
      width: this.props.width,
    };

    if(!this.props.disabled){
      return (
        <Animated.View style={barStyles} />
      );
    }

    return null
  }
}