import {StyleSheet} from 'react-native'
import {safeBottomAreaSize} from '../lib/screenSize'

export const stage = __DEV__ ? 'dev' : 'prod'
export const HAIR_LINE_WIDTH = StyleSheet.hairlineWidth
export const FILTER_SET_ICON_WIDTH = 54
export const FILTER_SET_ICON_HEIGHT = 54
export const FILTER_SET_ICON_TITLE_HEIGHT = 22
export const FILTER_SET_ITEM_WIDTH = FILTER_SET_ICON_WIDTH + (HAIR_LINE_WIDTH * 2)
export const FILTER_SET_ITEM_HEIGHT = FILTER_SET_ICON_HEIGHT + FILTER_SET_ICON_TITLE_HEIGHT + (HAIR_LINE_WIDTH * 2)

export const SLIDER_HEIGHT = FILTER_SET_ITEM_HEIGHT
export const APPLY_CANCEL_BUTTON_WIDTH = 50
export const APPLY_CANCEL_BUTTON_HEIGHT = 50

export const FILTER_CONTROLLER_MODAL_PADDING = 10
export const FILTER_CONTROLLER_MODAL_HEIGHT = SLIDER_HEIGHT + APPLY_CANCEL_BUTTON_HEIGHT + safeBottomAreaSize + FILTER_CONTROLLER_MODAL_PADDING

export const TAB_WIDTH = 50
export const TAB_HEIGHT = 50

export const LIMITED_CLAP_COUNT = 20

export const PRIMARY_COLOR = '#000000'