import {PIXI, Filter} from 'expo-pixi'
import {TextStyle, ViewStyle} from 'react-native'
import {Feather} from '@expo/vector-icons'
import {UnsharpMaskFilter} from './filters/unsharpMask/unsharpMask'

const pixiFilters = PIXI.filters
pixiFilters['UnsharpMaskFilter'] = UnsharpMaskFilter

export interface FilterValueOption {
  title: string
  filter: (value) => Filter[]
  slider?: FilterSlider
  vectorIcon?: VectorIcon
}

export interface VectorIcon {
  iconType: string
  iconName?: string
  iconColor?: string
  iconSize?: number
  iconText?: string
}

export interface FilterSetOption {
  title: string
  titleStyle: TextStyle
  iconStyle: ViewStyle
  filter: (value) => Filter[]
  slider?: FilterSlider
  isLastItem?: boolean
}

export interface FilterSlider {
  defaultSliderValue: number
  sliderMinimumValue: number
  sliderMaximumValue: number
  sliderStepValue: number
}

export interface FilterSets {
  [filterName: string]: FilterSetOption
}

export interface FilterValues {
  [filterName: string]: FilterValueOption
}

const sharpenArray = function(amount: number) {
  const cal = -1 * amount
  return [
    0, cal, 0,
    cal, 1 + 4 * amount, cal,
    0, cal, 0,
  ]
}

const blurArray = function(amount: number) {
  const cal = 1 - (1 - amount)
  return [
    cal, cal, cal,
    cal, cal, cal,
    cal, cal, cal,
  ]
}

export const filters = {
  brightness : (value, multiply = false) => {
    const filter = new pixiFilters.ColorMatrixFilter()
    filter.brightness(value, multiply)
    return filter
  },
  contrast   : (value, multiply = false) => {
    const filter = new pixiFilters.ColorMatrixFilter()
    filter.contrast(value, multiply)
    return filter
  },
  saturation : (value, multiply = false) => {
    const filter = new pixiFilters.ColorMatrixFilter()
    filter.saturate(value, multiply)
    return filter
  },
  hue        : (value, multiply = false) => {
    const filter = new pixiFilters.ColorMatrixFilter()
    filter.hue(value, multiply)
    return filter
  },
  temperature: (value, multiply = false) => {
    const filter = new pixiFilters.ColorMatrixFilter()
    filter.saturate(value, multiply)
    return filter
  },
  technicolor: (multiply = false) => {
    const filter = new pixiFilters.ColorMatrixFilter()
    filter.technicolor(multiply)
    return filter
  },
  browni     : (multiply = false) => {
    const filter = new pixiFilters.ColorMatrixFilter()
    filter.browni(multiply)
    return filter
  },
  toBGR      : (multiply = false) => {
    const filter = new pixiFilters.ColorMatrixFilter()
    filter.toBGR(multiply)
    return filter
  },
  rgbSplit   : (red = [-10, 0], green = [0, 10], blue = [0, 0]) => {
    return new pixiFilters.RGBSplitFilter(red, green, blue)
  },
  red        : (value) => {
    return new pixiFilters.AdjustmentFilter({brightness: 1, contrast: 1, saturation: 1, red: value})
  },
  green      : (value) => {
    return new pixiFilters.AdjustmentFilter({brightness: 1, contrast: 1, saturation: 1, green: value})
  },
  blue       : (value) => {
    return new pixiFilters.AdjustmentFilter({brightness: 1, contrast: 1, saturation: 1, blue: value})
  },
  sharpen    : (value) => {
    // return value === 0 ? [] : new pixiFilters.UnsharpMaskFilter({radius: value / 100, strength: value})
    return new pixiFilters.ConvolutionFilter(sharpenArray(value), 320, 320)
  },
  blur       : (value) => {
    return value === 0 ? [] : new pixiFilters.BlurFilter(value, 10)
  },
  mosaic     : (value) => {
    return value === 0 ? [] : new pixiFilters.PixelateFilter(value)
  },
  vignette   : (value) => {
    return new pixiFilters.CRTFilter({
      curvature      : 0,
      lineWidth      : 0,
      lineContrast   : 0,
      noise          : 0,
      noiseSize      : 1,
      vignetting     : value,
      vignettingAlpha: 1,
      vignettingBlur : 0.3,
      seed           : 0,
      time           : 0,
    })
  },
  noise      : (value) => {
    return new pixiFilters.NoiseFilter(value)
  },
}

export const filterValues: FilterValues = {
  brightness : {
    title     : 'Brightness',
    filter    : (value) => {
      return [
        filters.brightness(value),
      ]
    },
    slider    : {
      sliderMinimumValue: 0.2,
      defaultSliderValue: 1,
      sliderMaximumValue: 5,
      sliderStepValue   : 0.01,
    },
    vectorIcon: {
      iconType : 'Feather',
      iconName : 'sun',
      iconSize : 30,
      iconColor: '#000000',
    },
  },
  contrast   : {
    title     : 'Contrast',
    filter    : (value) => {
      return [
        filters.contrast(value),
      ]
    },
    slider    : {
      sliderMinimumValue: -5,
      defaultSliderValue: 0,
      sliderMaximumValue: 5,
      sliderStepValue   : 0.01,
    },
    vectorIcon: {
      iconType : 'Ionicons',
      iconName : 'md-contrast',
      iconSize : 32,
      iconColor: '#000000',
    },
  },
  saturation : {
    title     : 'Saturation',
    filter    : (value) => {
      return [
        filters.saturation(value),
      ]
    },
    slider    : {
      sliderMinimumValue: -1,
      defaultSliderValue: 0,
      sliderMaximumValue: 1,
      sliderStepValue   : 0.01,
    },
    vectorIcon: {
      iconType : 'MaterialIcons',
      iconName : 'blur-circular',
      iconSize : 32,
      iconColor: '#000000',
    },
  },
  hue        : {
    title     : 'Hue',
    filter    : (value) => {
      return [
        filters.hue(value),
      ]
    },
    slider    : {
      sliderMinimumValue: 0,
      defaultSliderValue: 0,
      sliderMaximumValue: 300,
      sliderStepValue   : 0.1,
    },
    vectorIcon: {
      iconType : 'Feather',
      iconName : 'circle',
      iconSize : 30,
      iconColor: '#000000',
    },
  },
  temperature: {
    title     : 'Temperature',
    filter    : (value) => {
      return [
        filters.temperature(value),
      ]
    },
    slider    : {
      sliderMinimumValue: -5,
      defaultSliderValue: 0,
      sliderMaximumValue: 5,
      sliderStepValue   : 0.01,
    },
    vectorIcon: {
      iconType : 'Feather',
      iconName : 'thermometer',
      iconSize : 28,
      iconColor: '#000000',
    },
  },
  sharp      : {
    title     : 'Sharp',
    filter    : (value) => {
      return [
        filters.sharpen(value),
      ]
    },
    slider    : {
      sliderMinimumValue: -1,
      defaultSliderValue: 0,
      sliderMaximumValue: 1,
      sliderStepValue   : 0.01,
    },
    vectorIcon: {
      iconType : 'MaterialCommunityIcons',
      iconName : 'delta',
      iconSize : 34,
      iconColor: '#000000',
    },
  },
  blur       : {
    title     : 'Blur',
    filter    : (value) => {
      return [
        filters.blur(value),
      ]
    },
    slider    : {
      sliderMinimumValue: 0,
      defaultSliderValue: 0,
      sliderMaximumValue: 10,
      sliderStepValue   : 0.01,
    },
    vectorIcon: {
      iconType : 'MaterialIcons',
      iconName : 'blur-on',
      iconSize : 30,
      iconColor: '#000000',
    },
  },
  mosaic     : {
    title     : 'Mosaic',
    filter    : (value) => {
      return [
        filters.mosaic(value),
      ]
    },
    slider    : {
      sliderMinimumValue: 0,
      defaultSliderValue: 0,
      sliderMaximumValue: 20,
      sliderStepValue   : 2,
    },
    vectorIcon: {
      iconType : 'MaterialIcons',
      iconName : 'border-clear',
      iconSize : 30,
      iconColor: '#000000',
    },
  },
  red        : {
    title     : 'Red',
    filter    : (value) => {
      return [
        filters.red(value),
      ]
    },
    slider    : {
      sliderMinimumValue: 1,
      defaultSliderValue: 1,
      sliderMaximumValue: 2,
      sliderStepValue   : 0.01,
    },
    vectorIcon: {
      iconType : 'View',
      iconText : 'R',
      iconColor: '#000000',
    },
  },
  green      : {
    title     : 'Green',
    filter    : (value) => {
      return [
        filters.green(value),
      ]
    },
    slider    : {
      sliderMinimumValue: 1,
      defaultSliderValue: 1,
      sliderMaximumValue: 2,
      sliderStepValue   : 0.01,
    },
    vectorIcon: {
      iconType : 'View',
      iconText : 'G',
      iconColor: '#000000',
    },
  },
  blue       : {
    title     : 'Blue',
    filter    : (value) => {
      return [
        filters.blue(value),
      ]
    },
    slider    : {
      sliderMinimumValue: 1,
      defaultSliderValue: 1,
      sliderMaximumValue: 2,
      sliderStepValue   : 0.01,
    },
    vectorIcon: {
      iconType : 'View',
      iconText : 'B',
      iconColor: '#000000',
    },
  },
  noise:{
    title : 'Noise',
    filter    : (value) => {
      return [
        filters.noise(value),
      ]
    },
    slider    : {
      sliderMinimumValue: 0,
      defaultSliderValue: 0,
      sliderMaximumValue: 1,
      sliderStepValue   : 0.01,
    },
    vectorIcon: {
      iconType : 'MaterialCommunityIcons',
      iconName : 'gradient',
      iconSize : 34,
      iconColor: '#000000',
    },
  },
  vignette   : {
    title     : 'Vignette',
    filter    : (value) => {
      return [
        filters.vignette(value),
      ]
    },
    slider    : {
      sliderMinimumValue: 0,
      defaultSliderValue: 0,
      sliderMaximumValue: 1,
      sliderStepValue   : 0.01,
    },
    vectorIcon: {
      iconType : 'MaterialIcons',
      iconName : 'vignette',
      iconSize : 30,
      iconColor: '#000000',
    },
  },
}

export const filterSets: FilterSets = {
  original: {
    title     : 'Original',
    titleStyle: {
      color: '#ffffff',
    },
    iconStyle : {
      backgroundColor: '#000000',
    },
    filter    : (value = 0) => {
      return []
    },
    isLastItem: true,
  },
  cb      : {
    title     : 'CB',
    titleStyle: {
      color: '#2f2f2f',
    },
    iconStyle : {
      backgroundColor: '#eeeeee',
    },
    filter    : (value = 0) => {
      return [
        filters.contrast(value),
        filters.brightness(value + 0.6),
      ]
    },
    slider    : {
      sliderMinimumValue: 0.1,
      defaultSliderValue: 0.4,
      sliderMaximumValue: 0.7,
      sliderStepValue   : 0.01,
    },
  },
  cs      : {
    title     : 'CS',
    titleStyle: {
      color: '#2f2f2f',
    },
    iconStyle : {
      backgroundColor: '#eeeeee',
    },
    filter    : (value = 0) => {
      return [
        filters.contrast(value + (value * -1 / 4)),
        filters.saturation(value * -1),
      ]
    },
    slider    : {
      sliderMinimumValue: 0.1,
      defaultSliderValue: 0.4,
      sliderMaximumValue: 0.7,
      sliderStepValue   : 0.01,
    },
  },
  csb     : {
    title     : 'CSB',
    titleStyle: {
      color: '#2f2f2f',
    },
    iconStyle : {
      backgroundColor: '#eeeeee',
    },
    filter    : (value = 0) => {
      return [
        filters.contrast(value),
        filters.saturation(value - 0.1),
        filters.brightness(value + 0.7),
      ]
    },
    slider    : {
      sliderMinimumValue: 0.3,
      defaultSliderValue: 0.3,
      sliderMaximumValue: 0.5,
      sliderStepValue   : 0.01,
    },
    isLastItem: true,
  },
  chs     : {
    title     : 'CHS',
    titleStyle: {
      color: '#ffffff',
    },
    iconStyle : {
      backgroundColor: '#ff13ef',
    },
    filter    : (value = 0) => {
      return [
        filters.technicolor(true),
        filters.saturation(value - 1),
      ]
    },
    slider    : {
      sliderMinimumValue: 0.5,
      defaultSliderValue: 1,
      sliderMaximumValue: 1.5,
      sliderStepValue   : 0.01,
    },
  },
  chc     : {
    title     : 'CHC',
    titleStyle: {
      color: '#ffffff',
    },
    iconStyle : {
      backgroundColor: '#ff13ef',
    },
    filter    : (value = 0) => {
      return [
        filters.technicolor(true),
        filters.contrast(value - 0.5),
      ]
    },
    slider    : {
      sliderMinimumValue: 0.5,
      defaultSliderValue: 0.8,
      sliderMaximumValue: 1.1,
      sliderStepValue   : 0.01,
    },
  },
  chcb    : {
    title     : 'CHCB',
    titleStyle: {
      color: '#ffffff',
    },
    iconStyle : {
      backgroundColor: '#ff13ef',
    },
    filter    : (value = 0) => {
      return [
        filters.technicolor(true),
        filters.contrast(value - 0.5),
        filters.brightness(value + 0.4),
      ]
    },
    slider    : {
      sliderMinimumValue: 0.5,
      defaultSliderValue: 0.8,
      sliderMaximumValue: 1.1,
      sliderStepValue   : 0.01,
    },
    isLastItem: true,
  },
  sc      : {
    title     : 'SC',
    titleStyle: {
      color: '#ffffff',
    },
    iconStyle : {
      backgroundColor: '#2a2a2a',
    },
    filter    : (value = 0) => {
      return [
        filters.saturation(-1),
        filters.contrast(value),
      ]
    },
    slider    : {
      sliderMinimumValue: 0,
      defaultSliderValue: 0.5,
      sliderMaximumValue: 1,
      sliderStepValue   : 0.01,
    },
  },
  sb      : {
    title     : 'SB',
    titleStyle: {
      color: '#ffffff',
    },
    iconStyle : {
      backgroundColor: '#2a2a2a',
    },
    filter    : (value = 0) => {
      return [
        filters.saturation(-1),
        filters.brightness(value + 1),
      ]
    },
    slider    : {
      sliderMinimumValue: -0.3,
      defaultSliderValue: 0.2,
      sliderMaximumValue: 0.7,
      sliderStepValue   : 0.01,
    },
    isLastItem: true,
  },
  bws     : {
    title     : 'BWS',
    titleStyle: {
      color: '#ffffff',
    },
    iconStyle : {
      backgroundColor: '#e8840e',
    },
    filter    : (value = 0) => {
      return [
        filters.browni(true),
        filters.saturation(value - 1),
      ]
    },
    slider    : {
      sliderMinimumValue: 0.5,
      defaultSliderValue: 1,
      sliderMaximumValue: 1.5,
      sliderStepValue   : 0.01,
    },
  },
  bwc     : {
    title     : 'BWC',
    titleStyle: {
      color: '#ffffff',
    },
    iconStyle : {
      backgroundColor: '#e8840e',
    },
    filter    : (value = 0) => {
      return [
        filters.browni(true),
        filters.contrast(value),
      ]
    },
    slider    : {
      sliderMinimumValue: 0.5,
      defaultSliderValue: 0.5,
      sliderMaximumValue: 1.5,
      sliderStepValue   : 0.01,
    },
  },
  bwh     : {
    title     : 'BWH',
    titleStyle: {
      color: '#ffffff',
    },
    iconStyle : {
      backgroundColor: '#e8840e',
    },
    filter    : (value = 0) => {
      return [
        filters.browni(true),
        filters.brightness(value + 0.7),
      ]
    },
    slider    : {
      sliderMinimumValue: 0.5,
      defaultSliderValue: 0.5,
      sliderMaximumValue: 1.0,
      sliderStepValue   : 0.01,
    },
    isLastItem: true,
  },
  sp     : {
    title     : 'SP',
    titleStyle: {
      color: '#ffffff',
    },
    iconStyle : {
      backgroundColor: '#ff0000',
    },
    filter    : (value = 0) => {
      return [
        filters.rgbSplit([value * -1, value * -1], [value, value * -1], [0, value]),
      ]
    },
    slider    : {
      sliderMinimumValue: 1,
      defaultSliderValue: 3,
      sliderMaximumValue: 5,
      sliderStepValue   : 0.01,
    },
    isLastItem: true,
  },
  r1      : {
    title     : 'R1',
    titleStyle: {
      color: '#ffffff',
    },
    iconStyle : {
      backgroundColor: '#ff4964',
    },
    filter    : (value = 1) => {
      return [
        filters.red(value),
      ]
    },
    slider    : {
      sliderMinimumValue: 1.3,
      defaultSliderValue: 1.3,
      sliderMaximumValue: 1.6,
      sliderStepValue   : 0.01,
    },
  },
  r2      : {
    title     : 'R2',
    titleStyle: {
      color: '#ffffff',
    },
    iconStyle : {
      backgroundColor: '#ff4964',
    },
    filter    : (value = 1) => {
      return [
        filters.red(value),
      ]
    },
    slider    : {
      sliderMinimumValue: 1.3,
      defaultSliderValue: 1.8,
      sliderMaximumValue: 2.3,
      sliderStepValue   : 0.01,
    },
  },
}

const generateFilterSet = () => {
  const filterSetsArray = Object.keys(filterSets).map((f) => filterSets[f])

  for (let i = 0; i < 100; i++) {
    filterSetsArray.push({
      title     : `R1T-${i}`,
      titleStyle: {
        color: '#ffffff',
      },
      iconStyle : {
        backgroundColor: '#ff4964',
      },
      filter    : (value = 1) => {
        return [
          filters.red(value),
        ]
      },
      slider    : {
        defaultSliderValue: 2,
        sliderMinimumValue: 1,
        sliderMaximumValue: 3,
        sliderStepValue   : 0.01,
      },
    })
  }

  return filterSetsArray
}

// export const filterSetsArray = Object.keys(filterSets).map((f) => filterSets[f])
export const filterSetsArray = generateFilterSet()
export const filterValuesArray = Object.keys(filterValues).map((f) => filterValues[f])

