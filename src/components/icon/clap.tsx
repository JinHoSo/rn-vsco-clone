import React from 'react'
import {View, StyleSheet} from 'react-native'
import {Ionicons} from '@expo/vector-icons'

interface State {
}

interface Props {
  iconSize: number
}

export class ClapIcon extends React.PureComponent<Props, State> {
  static defaultProps = {
    iconSize: 50,
  }

  constructor(props: Props) {
    super(props)
  }

  render() {
    return (
      <View>
        <Ionicons
          name='md-hand'
          size={this.props.iconSize}
          style={styles.hand1}
          color='#b3b3b3'
        />
        {/*<Ionicons*/}
          {/*name='md-hand'*/}
          {/*size={this.props.iconSize}*/}
          {/*style={styles.hand2}*/}
          {/*color='blue'*/}
        {/*/>*/}
        <Ionicons
          name='md-hand'
          size={this.props.iconSize}
          style={styles.hand3}
          color='#ffffff'
        />
        <Ionicons
          name='md-hand'
          size={this.props.iconSize}
          style={styles.hand4}
          color='#b3b3b3'
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  hand1: {
    position : 'absolute',
    top      : 0,
    left     : 0,
    transform: [
      {rotate: '-54deg'},
      {translateX: 7},
      {translateY: 7}
      ],
  },
  hand2: {
    position : 'absolute',
    top      : 0,
    left     : 0,
    transform: [
      {rotate: '-60deg'},
      {translateX: 2},
      {translateY: 2},
    ],
  },
  hand3: {
    position : 'absolute',
    top      : 0,
    left     : 0,
    transform: [
      {rotate: '-60deg'},
      {translateX: 2},
      {translateY: 0},
      {scale:1.2}
    ],
  },
  hand4: {
    position : 'absolute',
    top      : 0,
    left     : 0,
    transform: [
      {rotate: '-60deg'}
      ],
  },
})