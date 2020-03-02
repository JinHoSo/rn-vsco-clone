import React from 'react'
import {StyleSheet} from 'react-native'
import {EvilIcons, Feather, Ionicons, MaterialCommunityIcons} from '@expo/vector-icons'
import {Filter, FilterImage, PIXI} from 'expo-pixi'
import {AdvancedFilterImage} from '../lib/advancedFilterImage'
import {EventRegister} from 'react-native-event-listeners'
import CameraRollExtended from 'react-native-store-photos-album'

export const COMPLETE_TO_SAVE_FILTERED_IMAGE = 'COMPLETE_TO_SAVE_FILTERED_IMAGE'
export const RESERVE_TO_SAVE_FILTERED_IMAGE = 'RESERVE_TO_SAVE_FILTERED_IMAGE'
const IMAGE_LIMIT_SIZE = 1200
type Reservation = {
  width: number
  height: number
  compress: number
  uri: string
  filters: Filter[]
  savedUri: string
}

interface Reservations {
  [uri: string]: Reservation
}

interface State {
  currentReservation: Reservation
}

interface Props {
}

export class SavingFilteredImage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.checkLimitImageSize = this.checkLimitImageSize.bind(this)
    this.updatedFilter = this.updatedFilter.bind(this)
    this.setNextFilter = this.setNextFilter.bind(this)
    this.reserve = this.reserve.bind(this)
    this.complete = this.complete.bind(this)

    this.state = {
      currentReservation: null,
    }

    this.listener = EventRegister.addEventListener(RESERVE_TO_SAVE_FILTERED_IMAGE, ({width, height, compress, uri, filters}) => {
      this.reserve(width, height, compress, uri, filters)
    })
  }

  reservations: Reservations = {}
  glRef: any
  isSaving = false
  listener: any

  componentWillUnmount() {
    EventRegister.removeEventListener(this.listener)
  }

  checkLimitImageSize(width: number, height: number): {width: number, height: number} {
    const imageRatio = width / height
    let imageWidth = width
    let imageHeight = height

    // width is bigger
    if (imageRatio >= 1) {
      if (imageWidth > IMAGE_LIMIT_SIZE) {
        imageWidth = IMAGE_LIMIT_SIZE
        imageHeight = imageWidth / imageRatio

        if (imageHeight > IMAGE_LIMIT_SIZE) {
          imageHeight = IMAGE_LIMIT_SIZE
          imageWidth = IMAGE_LIMIT_SIZE * imageRatio
        }
      }

      //height is bigger
    } else {
      if (imageHeight > IMAGE_LIMIT_SIZE) {
        imageHeight = IMAGE_LIMIT_SIZE
        imageWidth = imageHeight * imageRatio
        if (imageWidth > IMAGE_LIMIT_SIZE) {
          imageWidth = IMAGE_LIMIT_SIZE
          imageHeight = IMAGE_LIMIT_SIZE / imageRatio
        }
      }
    }

    // console.warn('actual width', width)
    // console.warn('actual height', height)
    // console.warn('changed width', imageWidth)
    // console.warn('changed height', imageHeight)

    return {
      width : imageWidth,
      height: imageHeight,
    }
  }

  reserve(width: number, height: number, compress: number, uri: string, filters: Filter[]) {
    this.reservations[uri] = {
      ...this.checkLimitImageSize(width, height),
      compress,
      uri,
      filters,
      savedUri: null,
    }

    if (!this.isSaving) {
      this.setNextFilter()
    }
  }

  complete(uri: string) {
    const reservation = this.reservations[uri]

    if (reservation) {
      EventRegister.emit(COMPLETE_TO_SAVE_FILTERED_IMAGE, uri)
    }

    delete this.reservations[uri]
  }

  setNextFilter() {
    const reservations = this.reservations
    const currentReservation = Object.keys(reservations).map(t => reservations[t]).find(t => !t.savedUri)
    if (currentReservation) {
      this.setState({
        currentReservation,
      })

      this.isSaving = true
    }
    else {
      this.setState({
        currentReservation: null,
      })

      this.isSaving = false
    }
  }

  async updatedFilter(data) {
    if (this.glRef) {

      setTimeout(async () => {
        try {
          const ts = await this.glRef.takeSnapshotAsync()
          const savedPicture = await CameraRollExtended.saveToCameraRoll({uri: ts.uri, album: 'Unless'}, 'photo')
          this.complete(data.uri)
          this.setNextFilter()
        }
        catch (e) {
          console.log('takeSnapshotAsync error', e)
        }
      }, 100)
    }
  }

  render() {
    const reservation = this.state.currentReservation

    if (reservation) {
      return (
        <AdvancedFilterImage
          style={{
            width   : reservation.width,
            height  : reservation.height,
            position: 'absolute',
            left    : reservation.width * 2,
          }}
          source={reservation.uri}
          resizeMode="cover"
          filters={reservation.filters}
          ref={(glRef) => this.glRef = glRef}
          updatedFilter={() => this.updatedFilter(reservation)}
        />
      )
    }

    return null
  }
}