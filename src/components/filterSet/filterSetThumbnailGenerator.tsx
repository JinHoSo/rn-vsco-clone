import React from 'react'
import {StyleSheet} from 'react-native'
import {EvilIcons, Feather, Ionicons, MaterialCommunityIcons} from '@expo/vector-icons'
import {Filter, FilterImage, PIXI} from 'expo-pixi'
import {AdvancedFilterImage} from '../../lib/advancedFilterImage'
import {EventRegister} from 'react-native-event-listeners'

export const COMPLETE_FILTER_SET_ = 'COMPLETE_FILTER_SET_'
export const RESERVE_TO_GET_FILTER_SET_THUMBNAIL = 'RESERVE_TO_GET_FILTER_SET_THUMBNAIL'

type Thumbnail = {
  filterTitle: string
  uri: string
  filters: Filter[]
  eventListenerName: string
}

interface Thumbnails {
  [filterTitle: string]: Thumbnail
}

interface State {
  currentFilters: any
}

interface Props {
  selectedImageThumbnail: string
}

export class FilterSetThumbnailGenerator extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.updatedFilter = this.updatedFilter.bind(this)
    this.setNextFilter = this.setNextFilter.bind(this)
    this.reserve = this.reserve.bind(this)
    this.complete = this.complete.bind(this)

    this.state = {
      currentFilters: null,
    }

    this.thumbnails = {}
  }

  thumbnails: Thumbnails
  filters: Filter[]
  glRef: any
  isFiltering = false
  listener: any

  componentWillMount() {
    this.listener = EventRegister.addEventListener(RESERVE_TO_GET_FILTER_SET_THUMBNAIL, ({filterTitle, filters, eventListenerName}) => {
      this.reserve(filterTitle, filters, eventListenerName)
    })
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.listener)
  }

  reserve(filterTitle: Thumbnail['filterTitle'], filters: Thumbnail['filters'], eventListenerName: Thumbnail['eventListenerName']) {
    const reservation = {
      filterTitle,
      filters,
      eventListenerName,
      uri: null,
    }

    this.thumbnails[filterTitle] = reservation

    if (!this.isFiltering) {
      this.setNextFilter()
    }
  }

  complete(filterTitle: Thumbnail['filterTitle'], uri: Thumbnail['uri']) {
    const thumbnail = this.thumbnails[filterTitle]

    if (thumbnail) {
      thumbnail.eventListenerName

      EventRegister.emit(thumbnail.eventListenerName, uri)
    }

    delete this.thumbnails[filterTitle]
  }

  setNextFilter() {
    const thumbnails = this.thumbnails
    const currentFilters = Object.keys(thumbnails).map(t => thumbnails[t]).find(t => !t.uri)
    if (currentFilters) {
      this.setState({
        currentFilters,
      })

      this.isFiltering = true
    }
    else {
      this.isFiltering = false
    }
  }

  async updatedFilter(data) {
    if (this.glRef) {
      try {
        const ts = await this.glRef.takeSnapshotAsync()
        this.complete(data.filterTitle, ts.uri)
        this.setNextFilter()
      }
      catch (e) {
        console.log('takeSnapshotAsync error', e)
      }
    }
  }

  render() {
    if (this.state.currentFilters) {
      return (
        <AdvancedFilterImage
          style={styles.filterImage}
          source={this.props.selectedImageThumbnail}
          resizeMode="cover"
          filters={this.state.currentFilters.filters}
          ref={(glRef) => this.glRef = glRef}
          updatedFilter={() => this.updatedFilter(this.state.currentFilters)}
        />
      )
    }

    return null
  }
}

const styles = StyleSheet.create({
  filterImage:{
    width: 54,
    height: 54,
    position: 'absolute',
    bottom:-300
  }
})