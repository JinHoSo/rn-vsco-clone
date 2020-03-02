import {Dimensions, Platform} from 'react-native'
import {ifIphoneX} from 'react-native-iphone-x-helper'

export const getRatio34Height = function(width: number) {
  return Math.floor(4 / 3 * width)
}

export const screenWidth = Dimensions.get('window').width
export const screenHeight = Dimensions.get('window').height
export const ratio34Height = getRatio34Height(screenWidth)

// console.log('screenWidth', screenWidth)
// console.log('screenHeight', screenHeight)
// console.log('ratio34Height', ratio34Height)

export const statusBarSize = function() {
  if (Platform.OS === 'ios') {
    // return ifIphoneX(44, 20)
    return ifIphoneX(44, 20)
  }

  return 0
}()

export const hiddenStatusBarSize = function() {
  if (Platform.OS === 'ios') {
    // return ifIphoneX(44, 20)
    return ifIphoneX(30, 0)
  }

  return 0
}()

export const safeBottomAreaSize = function() {
  return ifIphoneX(34, 0)
}()
