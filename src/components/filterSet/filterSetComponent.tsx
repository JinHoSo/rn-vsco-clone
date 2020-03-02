import React from 'react'
import {Image, Slider, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle} from 'react-native'
import Modal from 'react-native-modal'
import {safeBottomAreaSize} from '../../lib/screenSize'
import {Feather, Ionicons} from '@expo/vector-icons'
import {FilterSetOption} from '../../lib/filterSets'
import {Filter, FilterImage, PIXI} from 'expo-pixi'
import {
  APPLY_CANCEL_BUTTON_HEIGHT,
  APPLY_CANCEL_BUTTON_WIDTH,
  FILTER_CONTROLLER_MODAL_HEIGHT,
  FILTER_SET_ICON_HEIGHT,
  FILTER_SET_ICON_TITLE_HEIGHT,
  FILTER_SET_ICON_WIDTH,
  FILTER_SET_ITEM_HEIGHT,
  FILTER_SET_ITEM_WIDTH,
  HAIR_LINE_WIDTH,
  SLIDER_HEIGHT,
} from '../../constant/env'
import {COMPLETE_FILTER_SET_, RESERVE_TO_GET_FILTER_SET_THUMBNAIL} from './filterSetThumbnailGenerator'
import {EventRegister} from 'react-native-event-listeners'

export const SELECT_FILTER_SET = 'SELECT_FILTER_SET'

export interface SliderFilterSetState {
  isVisibleModal: boolean
  isAppliedFilter: boolean
  thumbnailUri: string
  filterSetTitle: string
}

export interface SliderFilterSetProps {
  source: string
  options: FilterSetOption
}

export class SliderFilterSetComponent<P extends SliderFilterSetProps, S extends SliderFilterSetState> extends React.PureComponent<P, S> {

  title = 'FilterSet'
  titleStyle: TextStyle
  iconStyle: ViewStyle
  filter: (value) => Filter[]
  needSlider = false
  sliderValue = 0
  defaultSliderValue = 0
  latestSliderValue = 0
  sliderMinimumValue = -2
  sliderMaximumValue = 2
  sliderStepValue = 0.1

  isUnmounted = false
  thumbnailListener: string
  selectFilterSetListener: string

  constructor(props: P) {
    super(props)

    const {options} = props

    this.title = options.title
    this.filter = options.filter
    this.titleStyle = options.titleStyle
    this.iconStyle = options.iconStyle

    if (options.slider) {
      this.needSlider = true
      this.defaultSliderValue = options.slider.defaultSliderValue
      this.latestSliderValue = options.slider.defaultSliderValue
      this.sliderMinimumValue = options.slider.sliderMinimumValue
      this.sliderMaximumValue = options.slider.sliderMaximumValue
      this.sliderStepValue = options.slider.sliderStepValue
    }

    this.state = {
      isVisibleModal : false,
      isAppliedFilter: false,
      thumbnailUri   : null,
      filterSetTitle : this.title,
    } as S

    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.selectFilterSet = this.selectFilterSet.bind(this)
    this.onValueChange = this.onValueChange.bind(this)
    this.onInitialValue = this.onInitialValue.bind(this)
    this.onRevertValue = this.onRevertValue.bind(this)
    this.onCancelFilter = this.onCancelFilter.bind(this)
    this.onApplyFilter = this.onApplyFilter.bind(this)
    this.onPressFilter = this.onPressFilter.bind(this)

    //for thumbnail event
    const eventListenerName = COMPLETE_FILTER_SET_ + this.title

    this.thumbnailListener = EventRegister.addEventListener(eventListenerName, (thumbnailUri) => {
      this.setState({
        thumbnailUri,
      })

      EventRegister.removeEventListener(this.thumbnailListener)
    })

    EventRegister.emit(RESERVE_TO_GET_FILTER_SET_THUMBNAIL, {
      filterTitle: this.title,
      filters    : this.filter(this.defaultSliderValue),
      eventListenerName,
    })
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.thumbnailListener)
    EventRegister.removeEventListener(this.selectFilterSetListener)
    this.isUnmounted = true
  }

  selectFilterSet() {
    EventRegister.emit(SELECT_FILTER_SET, {filterName: this.title})

    if (!this.selectFilterSetListener) {
      this.selectFilterSetListener = EventRegister.addEventListener(SELECT_FILTER_SET, ({filterName, value, deselect}) => {
        if (filterName === this.title && value !== undefined) {
          this.onValueChange(value)
          this.setFilterSetTitle(value)
        }
        else if (filterName !== this.title || deselect) {
          this.removeFilter()
        }
      })
    }
  }

  renderIcon() {
    const filterSetThumbnailUri = this.state.thumbnailUri

    if (filterSetThumbnailUri && !this.isUnmounted) {
      return (
        <Image source={{uri: filterSetThumbnailUri}} style={styles.filterImage}
        />
      )
    }

    return null
  }

  openModal() {
    this.setState({
      isVisibleModal: true,
    })
  }

  closeModal() {
    this.setState({
      isVisibleModal: false,
    })
  }

  generateFilter(value) {
  }

  removeFilter() {
    this.setState({
      isAppliedFilter: false,
    })
    this.sliderValue = this.defaultSliderValue
    this.setFilterSetTitle(this.sliderValue)
  }

  setFilterSetTitle(sliderValue) {
    const filterSetTitle = sliderValue === this.defaultSliderValue ? this.title : (this.sliderValue * 100).toFixed(0)

    this.setState({
      filterSetTitle,
    })
  }

  onValueChange(sliderValue) {
    this.sliderValue = sliderValue
    this.generateFilterThrottle()
  }

  generateFilterThrottle = throttle(() => {
    this.generateFilter(this.sliderValue)
  }, 10)

  onInitialValue() {
    this.removeFilter()
  }

  onRevertValue() {
    this.generateFilter(this.sliderValue)
  }

  onPressFilter() {
    if (!this.state.isAppliedFilter) {
      this.setState({
        isAppliedFilter: true,
      })
      this.onValueChange(this.defaultSliderValue)
      this.selectFilterSet()
    }
    else if (this.state.isAppliedFilter && this.needSlider) {
      this.openModal()
    }
    else {
      this.removeFilter()
    }
  }

  onApplyFilter() {
    this.setFilterSetTitle(this.sliderValue)
    this.closeModal()
  }

  onCancelFilter() {
    this.onValueChange(this.defaultSliderValue)
    this.setFilterSetTitle(this.sliderValue)
    this.closeModal()
  }

  renderTitle() {
    return (
      <View style={styles.filterTextContainer}>
        <Text style={[styles.filterText, this.titleStyle]}>
          {
            this.state.filterSetTitle
          }
        </Text>
      </View>
    )
  }

  renderSlider() {
    return (
      <Slider
        style={styles.slider}
        minimumValue={this.sliderMinimumValue}
        maximumValue={this.sliderMaximumValue}
        step={this.sliderStepValue}
        value={this.sliderValue}
        onValueChange={this.onValueChange}
        thumbTintColor="#ffffff"
        minimumTrackTintColor='#444444'
        maximumTrackTintColor='#ffffff'
      />
    )
  }

  renderSliderIcon() {
    const isDisplayingSliderIcon = this.state.isAppliedFilter && this.needSlider
    return (
      <View style={[styles.filterSliderIconContainer, isDisplayingSliderIcon ? {opacity: 1, ...this.iconStyle} : null]}>
        <Ionicons
          name='ios-git-commit'
          color={this.titleStyle.color ? this.titleStyle.color : '#000000'}
          size={30}
        />
      </View>
    )
  }

  render() {
    return (
      <View>
        <TouchableOpacity activeOpacity={1} style={[styles.filterButton, this.iconStyle]} onPress={this.onPressFilter}>
          {
            this.renderIcon()
          }

          {
            this.renderTitle()
          }

          {
            this.renderSliderIcon()
          }
        </TouchableOpacity>

        <Modal
          isVisible={this.state.isVisibleModal}
          style={styles.modalContainer}
          onBackButtonPress={this.closeModal}
          backdropOpacity={0}
        >
          <View style={styles.modalContentContainer}>
            <TouchableOpacity
              activeOpacity={1}
              onPressIn={this.onInitialValue}
              onPressOut={this.onRevertValue}
              style={styles.initialButton}
            />
            <View style={styles.modalContent}>
              {
                this.renderSlider()
              }
              <View style={styles.filterCancelApplyButtonContainer}>
                <TouchableOpacity
                  onPress={this.onCancelFilter}
                  style={styles.filterCancelApplyButton}>
                  <Feather
                    name="x"
                    size={23}
                    color="#ffffff"
                  />
                </TouchableOpacity>

                <Text style={styles.title}>
                  {
                    this.title
                  }
                </Text>

                <TouchableOpacity
                  onPress={this.onApplyFilter}
                  style={styles.filterCancelApplyButton}>
                  <Feather
                    name="check"
                    size={23}
                    color="#ffffff"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  modalContainer                  : {
    flex           : 1,
    backgroundColor: 'transparent',
    flexDirection  : 'column',
    justifyContent : 'flex-end',
    padding        : 0,
    margin         : 0,
  },
  modalContentContainer           : {
    flex           : 1,
    flexDirection  : 'column',
    justifyContent : 'flex-end',
    backgroundColor: 'transparent',
  },
  modalContent                    : {
    flex           : 0,
    height         : FILTER_CONTROLLER_MODAL_HEIGHT,
    paddingBottom  : safeBottomAreaSize,
    backgroundColor: '#000000',
    flexWrap       : 'wrap',
    flexDirection  : 'column',
    alignItems     : 'stretch',
    justifyContent : 'flex-end',
  },
  filterCancelApplyButtonContainer: {
    flex            : 1,
    flexWrap        : 'wrap',
    flexDirection   : 'row',
    alignItems      : 'center',
    justifyContent  : 'space-between',
    height          : APPLY_CANCEL_BUTTON_HEIGHT,
    marginHorizontal: 5,
  },
  filterCancelApplyButton         : {
    width         : APPLY_CANCEL_BUTTON_WIDTH,
    height        : APPLY_CANCEL_BUTTON_HEIGHT,
    flexWrap      : 'wrap',
    alignItems    : 'center',
    justifyContent: 'center',
  },
  title                           : {
    fontSize: 14,
    color   : '#ffffff',
  },
  filterImage                     : {
    width               : FILTER_SET_ICON_WIDTH,
    height              : FILTER_SET_ICON_HEIGHT,
    borderTopLeftRadius : 3,
    borderTopRightRadius: 3,
  },
  filterButton                    : {
    width         : FILTER_SET_ITEM_WIDTH,
    height        : FILTER_SET_ITEM_HEIGHT,
    flexWrap      : 'wrap',
    flexDirection : 'column',
    alignItems    : 'center',
    justifyContent: 'flex-end',
    borderWidth   : HAIR_LINE_WIDTH,
    borderColor   : '#ffffff',
    borderRadius  : 3,
    overflow      : 'hidden',
  },
  filterTextContainer             : {
    height                 : FILTER_SET_ICON_TITLE_HEIGHT,
    flexWrap               : 'wrap',
    alignItems             : 'center',
    justifyContent         : 'center',
    borderBottomRightRadius: 3,
    borderBottomLeftRadius : 3,
  },
  filterText                      : {
    fontSize: 10,
    color   : '#ffffff',
  },
  initialButton                   : {
    flex: 1,
  },
  filterSliderIconContainer       : {
    position       : 'absolute',
    top            : 0,
    left           : 0,
    width          : FILTER_SET_ICON_WIDTH,
    height         : FILTER_SET_ICON_HEIGHT,
    backgroundColor: '#ffffff',
    opacity        : 0,
    flexWrap       : 'wrap',
    alignItems     : 'center',
    justifyContent : 'center',
  },
  slider                          : {
    marginHorizontal: 20,
    height          : SLIDER_HEIGHT,
  },
  sliderTrack                     : {
    backgroundColor: '#ffffff',
    height         : 1,
  },
  sliderThumb                     : {
    backgroundColor: '#FF19DD',
    borderRadius   : 15,
    width          : 30,
    height         : 30,
  },
})

const throttle = (func, limit) => {
  let lastFunc
  let lastRan
  return function() {
    const context = this
    const args = arguments
    if (!lastRan) {
      func.apply(context, args)
      lastRan = Date.now()
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(function() {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args)
          lastRan = Date.now()
        }
      }, limit - (Date.now() - lastRan))
    }
  }
}
