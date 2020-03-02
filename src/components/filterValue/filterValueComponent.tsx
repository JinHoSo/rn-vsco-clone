import React from 'react'
import {Slider, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import Modal from 'react-native-modal'
import {safeBottomAreaSize} from '../../lib/screenSize'
import {Feather, Ionicons} from '@expo/vector-icons'
import {
  APPLY_CANCEL_BUTTON_HEIGHT,
  APPLY_CANCEL_BUTTON_WIDTH,
  FILTER_CONTROLLER_MODAL_HEIGHT,
  SLIDER_HEIGHT,
} from '../../constant/env'
import {EventRegister} from 'react-native-event-listeners'
import {FilterValueOption} from '../../lib/filterSets'
import {Filter} from 'expo-pixi'
import {MakeIcon} from '../../lib/makeIcon'

export const SELECT_FILTER = 'SELECT_FILTER'

export interface SliderFilterValueState {
  isVisibleModal: boolean
  filterSetTitle: string
}

export interface SliderFilterValueProps {
  options: FilterValueOption
}

export class SliderFilterValueComponent<P extends SliderFilterValueProps, S extends SliderFilterValueState> extends React.PureComponent<P, S> {

  title = 'Filter'
  filter: (value) => Filter[]
  sliderValue = 0
  defaultSliderValue = 0
  latestSliderValue = 0
  sliderMinimumValue = -2
  sliderMaximumValue = 2
  sliderStepValue = 0.1
  selectFilterListener: string

  iconType: string
  iconName: string
  iconColor: string
  iconSize: number
  iconText?: string

  constructor(props: P) {
    super(props)

    const {options} = props

    this.title = options.title
    this.filter = options.filter

    if (options.slider) {
      this.defaultSliderValue = options.slider.defaultSliderValue
      this.latestSliderValue = options.slider.defaultSliderValue
      this.sliderMinimumValue = options.slider.sliderMinimumValue
      this.sliderMaximumValue = options.slider.sliderMaximumValue
      this.sliderStepValue = options.slider.sliderStepValue
      this.sliderValue = this.defaultSliderValue
    }

    if (options.vectorIcon) {
      this.iconType = options.vectorIcon.iconType
      this.iconName = options.vectorIcon.iconName
      this.iconColor = options.vectorIcon.iconColor
      this.iconSize = options.vectorIcon.iconSize
      this.iconText = options.vectorIcon.iconText
    }

    this.state = {
      isVisibleModal: false,
      filterSetTitle: this.title,
    } as S

    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.removeFilter = this.removeFilter.bind(this)
    this.setFilterSetTitle = this.setFilterSetTitle.bind(this)
    this.onValueChange = this.onValueChange.bind(this)
    this.onInitialSliderValue = this.onInitialSliderValue.bind(this)
    this.onRevertValue = this.onRevertValue.bind(this)
    this.onCancelFilter = this.onCancelFilter.bind(this)
    this.onApplyFilter = this.onApplyFilter.bind(this)

    this.selectFilterListener = EventRegister.addEventListener(SELECT_FILTER, ({filterName, value, deselect}) => {
      if (filterName === this.title && value !== undefined) {
        this.onValueChange(value)
        this.setFilterSetTitle(value)
      }
      else if ((filterName === this.title || filterName === undefined) && deselect) {
        this.removeFilter()
      }
    })
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.selectFilterListener)
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

  setFilterSetTitle(sliderValue) {
    const filterSetTitle = sliderValue === this.defaultSliderValue ? this.title : (this.sliderValue * 100).toFixed(0)

    this.setState({
      filterSetTitle,
    })
  }

  generateFilter(value) {
  }

  removeFilter() {
    this.onValueChange(this.defaultSliderValue)
    this.setFilterSetTitle(this.sliderValue)
  }

  onValueChange(sliderValue) {
    this.sliderValue = sliderValue
    this.generateFilterThrottle()
  }

  generateFilterThrottle = throttle(() => {
    // console.warn('generateFilterThrottle')
    this.generateFilter(this.sliderValue)
  }, 10)

  onInitialSliderValue() {
    this.generateFilter(this.defaultSliderValue)
  }

  onRevertValue() {
    this.generateFilter(this.sliderValue)
  }

  onCancelFilter() {
    this.removeFilter()
    this.closeModal()
  }

  onApplyFilter() {
    this.setFilterSetTitle(this.sliderValue)
    this.closeModal()
  }

  renderIcon(iconColor?: string) {
    if (this.iconType) {
      return (
        <MakeIcon iconType={this.iconType} iconName={this.iconName} iconSize={this.iconSize}
                  iconColor={iconColor ? iconColor : this.iconColor}
                  iconText={this.iconText}/>
      )
    }

    return null
  }

  renderTitle() {
    return (
      <Text style={styles.filterText}>
        {
          this.state.filterSetTitle
        }
      </Text>
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

  render() {
    return (
      <View>
        <TouchableOpacity style={styles.filterButton} onPress={this.openModal}>
          {
            this.renderIcon()
          }

          {
            this.renderTitle()
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
              onPressIn={this.onInitialSliderValue}
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
  filterButton                    : {
    width         : 60,
    height        : SLIDER_HEIGHT,
    flexWrap      : 'wrap',
    alignItems    : 'center',
    justifyContent: 'center',
  },
  filterButtonImage               : {
    width : 20,
    height: 20,
  },
  filterText                      : {
    marginTop: 6,
    fontSize : 9,
    color    : '#000000',
  },
  initialButton                   : {
    flex: 1,
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
