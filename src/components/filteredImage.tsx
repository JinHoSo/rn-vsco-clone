import React from 'react'
import {RootState} from '../redux'
import {connect} from 'react-redux'
import {Feather} from '@expo/vector-icons'
import {Filter, FilterImage, PIXI} from 'expo-pixi'
import CameraRollExtended from 'react-native-store-photos-album'
import {AdjustmentFilter} from '@pixi/filter-adjustment'
import {MotionBlurFilter} from '@pixi/filter-motion-blur'
import {DotFilter} from '@pixi/filter-dot'
import {OldFilmFilter} from '@pixi/filter-old-film'
import {CRTFilter} from '@pixi/filter-crt'
import {StyleSheet, TouchableOpacity, View} from 'react-native'
import {FilterState} from '../redux/filter/reducer'
import {AdvancedFilterImage} from '../lib/advancedFilterImage'
import {RESERVE_TO_SAVE_FILTERED_IMAGE} from './savingFilteredImage'
import {EventRegister} from 'react-native-event-listeners'

interface State {
  isClearedFilter: boolean
}

interface OwnProps {
  ref?: any
  surfaceWidth: number
  surfaceHeight: number
  uri: string
  imageWidth: number
  imageHeight: number
}

interface StateProps {
  filter: FilterState
}

interface DispatchProps {
}

interface Props extends StateProps, DispatchProps, OwnProps {
}

export class FilteredImageComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      isClearedFilter: false,
    }

    this.onInitialValue = this.onInitialValue.bind(this)
    this.onRevertValue = this.onRevertValue.bind(this)
    this.save = this.save.bind(this)
  }

  glRef: any
  crop = {
    x     : 5,
    y     : 5,
    width : 100,
    height: 100,
  }
  filters: Filter[]

  save() {
    const {imageWidth, imageHeight, uri} = this.props
    EventRegister.emit(RESERVE_TO_SAVE_FILTERED_IMAGE, {
      width   : imageWidth,
      height  : imageHeight,
      uri     : uri,
      compress: 1,
      filters : this.filters,
    })
  }

  onInitialValue() {
    this.setState({
      isClearedFilter: true,
    })
  }

  onRevertValue() {
    this.setState({
      isClearedFilter: false,
    })
  }

  render() {
    const {surfaceWidth, surfaceHeight, uri, filter} = this.props
    let filters = []
    if (!this.state.isClearedFilter) {
      filters = Object.keys(filter).reduce((acc, val) => {
        const f = filter[val]
        if (f) {
          if (typeof f === 'object') {
            return acc.concat(f)
          }

          acc.push(f)
          return acc
        }

      }, [])
    }

    this.filters = filters

    return (
      <TouchableOpacity
        onPressIn={this.onInitialValue}
        onPressOut={this.onRevertValue}
        activeOpacity={1}
        style={styles.filterContainer}>
        <AdvancedFilterImage
          style={{width: surfaceWidth, height: surfaceHeight}}
          ref={(glRef) => this.glRef = glRef}
          source={{uri}}
          resizeMode="cover"
          filters={this.filters}
          // crop={this.crop}
        />
      </TouchableOpacity>
    )
  }
}

export const FilteredImage = connect<StateProps, DispatchProps, OwnProps>((state: RootState) => ({
  filter: state.filter,
}), {}, null, {withRef: true})(FilteredImageComponent)

const styles = StyleSheet.create({
  filterContainer: {
    flex           : 1,
    flexWrap       : 'wrap',
    alignItems     : 'center',
    justifyContent : 'center',
    backgroundColor: '#000000',
  },
})