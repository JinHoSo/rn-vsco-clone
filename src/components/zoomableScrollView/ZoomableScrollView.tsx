import React from 'react'
import PropTypes from 'prop-types'
import {StyleSheet, View, ScrollView, Animated} from 'react-native'
import Photo from './Photo'
import SelectedPhoto from './SelectedPhoto'
import {Measurement} from './Measurement-type'
import {Picture} from '../../screen/picture'

type SelectedPhotoType = {
  picture: Picture
  measurement: Measurement
}

type State = {
  selectedPhoto?: SelectedPhotoType
  isDragging: boolean
}

interface Props {
  pictures: Picture[]
}

export default class ZoomableScrollView extends React.Component<Props, State> {
  state: State
  _scrollValue: Animated.Value
  _scaleValue: Animated.Value
  _gesturePosition: Animated.ValueXY

  constructor(props) {
    super(props)

    this._scrollValue = new Animated.Value(0)
    this._scaleValue = new Animated.Value(1)
    this._gesturePosition = new Animated.ValueXY()
    this.state = {
      isDragging: false,
    }
  }

  static childContextTypes = {
    gesturePosition  : PropTypes.object,
    getScrollPosition: PropTypes.func,
    scaleValue       : PropTypes.object,
  }

  getChildContext() {
    return {
      gesturePosition  : this._gesturePosition,
      scaleValue       : this._scaleValue,
      getScrollPosition: () => {
        return (this._scrollValue as any).__getValue()
      },
    }
  }

  render() {
    const {isDragging, selectedPhoto} = this.state
    const onScroll = Animated.event([
      {nativeEvent: {contentOffset: {y: this._scrollValue}}},
    ])

    const {pictures, children} = this.props

    return (
      <View style={styles.container}>
        <ScrollView
          scrollEventThrottle={16}
          onScroll={onScroll}
          scrollEnabled={!isDragging}
        >
          {pictures.map((picture, key) => {
            return (
              <Photo
                picture={picture}
                key={key}
                isDragging={isDragging}
                onGestureStart={(selectedPhoto: SelectedPhotoType) => {
                  this.setState({
                    selectedPhoto,
                    isDragging: true,
                  })
                }}
                onGestureRelease={() => this.setState({isDragging: false})}
              />
            )
          })}

          {
            children
          }
        </ScrollView>
        {isDragging ? (
          <SelectedPhoto
            selectedPhoto={selectedPhoto}
          />
        ) : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
