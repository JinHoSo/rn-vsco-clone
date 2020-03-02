import React from 'react'
import {connect} from 'react-redux'
import {RootState} from '../redux'
import {View, StyleSheet} from 'react-native'
import {screenHeight, screenWidth} from '../lib/screenSize'
import {AnimationBar} from '../lib/animationBar'
import {LoadingBarState} from '../redux/loadingBar/reducer'

const DELAY = 100
const animationBarWidth = screenWidth / 10

interface State {
  data: any[]
}

interface OwnProps {
}

interface StateProps {
  loadingBar: LoadingBarState
}

interface DispatchProps {
}

interface Props extends StateProps, DispatchProps, OwnProps {
}

class LoadingBarComponent extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      data: [],
    }
  }


  render() {
    const disabled = this.props.loadingBar.length === 0
    return (
      <View style={[styles.container, disabled === true ? {left: screenWidth * 2}: null]}>
        <AnimationBar width={animationBarWidth} disabled={disabled} />
        <AnimationBar width={animationBarWidth} disabled={disabled}/>
        <AnimationBar width={animationBarWidth} disabled={disabled} />
        <AnimationBar width={animationBarWidth} disabled={disabled} />
        <AnimationBar width={animationBarWidth} disabled={disabled} />
        <AnimationBar width={animationBarWidth} disabled={disabled} />
        <AnimationBar width={animationBarWidth} disabled={disabled} />
        <AnimationBar width={animationBarWidth} disabled={disabled} />
        <AnimationBar width={animationBarWidth} disabled={disabled} />
        <AnimationBar width={animationBarWidth} disabled={disabled} />
      </View>
    )
  }
}

export const LoadingBar = connect<StateProps, DispatchProps, OwnProps>((state: RootState) => ({
  loadingBar: state.loadingBar,
}), {})(LoadingBarComponent)

const styles = StyleSheet.create({
  container: {
    position:'absolute',
    top:0,
    left:0,
    right:0,
    bottom:0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flex           : 1,
    flexDirection:'row',
    justifyContent : 'center',
    alignItems:'flex-start'
  },
})