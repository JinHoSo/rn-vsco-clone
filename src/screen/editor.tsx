import React from 'react'
import {StatusBar, StyleSheet, TouchableOpacity, View} from 'react-native'
import {OwnProps as filterProps} from '../lib/filter/'
import {RootState} from '../redux'
import {connect} from 'react-redux'
import {NavigationActions, NavigationScreenProp} from 'react-navigation'
import {hiddenStatusBarSize, safeBottomAreaSize, screenHeight, screenWidth} from '../lib/screenSize'
import {application, Filter, FilterImage, PIXI, spriteAsync} from 'expo-pixi'
import {ImageManipulator} from 'expo'
import {EvilIcons, Feather, Entypo, Ionicons, MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons'
import {AdjustmentFilter} from '@pixi/filter-adjustment'
import {MotionBlurFilter} from '@pixi/filter-motion-blur'
import {DotFilter} from '@pixi/filter-dot'
import {OldFilmFilter} from '@pixi/filter-old-film'
import {CRTFilter} from '@pixi/filter-crt'
import Toast, {DURATION} from 'react-native-easy-toast'
import {FilteredImage} from '../components/filteredImage'
import {clearFilter} from '../redux/filter/actions'
import {ConfirmDialog} from 'react-native-simple-dialogs'
import {FilterHistoryState} from '../redux/filterHistory/reducer'
import {clearFilterHistory, setDirtyFilterHistory} from '../redux/filterHistory/actions'
import {FilterHistory} from '../components/filterHistory'
import {clearFilterValue} from '../redux/filterValue/actions'
import {FILTER_SET_ICON_HEIGHT, FILTER_SET_ICON_TITLE_HEIGHT, TAB_HEIGHT, TAB_WIDTH} from '../constant/env'
import {FilterSetList} from '../components/filterSet/filterSetList'
import Expo from 'expo'
import PinchZoomView from 'react-native-pinch-zoom-view'
import {REFRESH_CAMERA_ROLL} from '../lib/cameraRollPicker'
import {EventRegister} from 'react-native-event-listeners'
import {isIphoneX} from 'react-native-iphone-x-helper'
import {FilterValueList} from '../components/filterValue/filterValueList'
import {SavingFilteredImage} from '../components/savingFilteredImage'
import {COMPLETE_TO_SAVE_FILTERED_IMAGE} from '../components/savingFilteredImage'
import {LoadingBar} from '../components/loadingBar'
import {offLoadingBar, onLoadingBar} from '../redux/loadingBar/actions'
import {getImageSize} from '../lib/imageSize'

const FILTER_LIST_HEIGHT = FILTER_SET_ICON_HEIGHT + FILTER_SET_ICON_TITLE_HEIGHT + 10
const surfacePadding = 20
const containerWidth = screenWidth - surfacePadding
const containerHeight = screenHeight - (FILTER_LIST_HEIGHT + TAB_HEIGHT + safeBottomAreaSize + hiddenStatusBarSize + surfacePadding)
enum Tab {
  FilterSet,
  Filter
}

interface State {
  selectedImage: any
  selectedTab: Tab
  selectedImageThumbnail: any
  dialogVisible: boolean
}

interface OwnProps extends filterProps {
  navigation?: NavigationScreenProp<State>
}

interface StateProps {
  filterHistory: FilterHistoryState
}

interface DispatchProps {
  navigate: typeof NavigationActions.navigate
  back: typeof NavigationActions.back
  clearFilter: typeof clearFilter
  clearFilterValue: typeof clearFilterValue
  clearFilterHistory: typeof clearFilterHistory
  setDirtyFilterHistory: typeof setDirtyFilterHistory
  onLoadingBar: typeof onLoadingBar
  offLoadingBar: typeof offLoadingBar
}

interface Props extends StateProps, DispatchProps, OwnProps {
}

export class EditorScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      selectedTab           : Tab.FilterSet,
      selectedImage         : null,
      selectedImageThumbnail: null,
      dialogVisible         : false,
    }

    const picture = this.props.navigation.getParam('picture')

    this.setSurfaceSize(picture.width, picture.height)

    this.onSave = this.onSave.bind(this)
    this.onClose = this.onClose.bind(this)
    this.showToast = this.showToast.bind(this)
    this.setFilteredImageRef = this.setFilteredImageRef.bind(this)
  }

  filteredImageRef: any
  toastRef: any
  surfaceWidth: number
  surfaceHeight: number
  completeToSaveImageEventListener: any

  async componentWillMount() {
    this.completeToSaveImageEventListener = EventRegister.addEventListener(COMPLETE_TO_SAVE_FILTERED_IMAGE, (isSucceeded) => {
      if (isSucceeded) {
        this.showToast('Saved')
        this.props.setDirtyFilterHistory(false)
        EventRegister.emit(REFRESH_CAMERA_ROLL)

        this.props.offLoadingBar('savedImage')
      }
      else {
        this.showToast('Failed')
      }
    })

    await this.getFile()
  }

  async componentWillUnmount() {
    this.props.clearFilterHistory()
    this.props.clearFilterValue()
    this.props.clearFilter()

    const cacheDirectory = Expo.FileSystem.cacheDirectory + 'GLView/'
    const files = await Expo.FileSystem.readDirectoryAsync(cacheDirectory)
    // console.warn('files count : ', files.length)
    try {
      await Expo.FileSystem.deleteAsync(cacheDirectory)
      // console.warn('successfully deleted')
    }
    catch (e) {
      console.error(e)
    }
  }

  setSurfaceSize(width: number, height: number): void {
    const newImageSize = getImageSize(width, height, containerWidth, containerHeight)
    this.surfaceWidth = newImageSize.width
    this.surfaceHeight = newImageSize.height
  }

  async getFile() {
    let uri: string
    const picture = this.props.navigation.getParam('picture')
    const pictureThumbnailSize = this.surfaceWidth / this.surfaceHeight >= 1 ? this.surfaceWidth * 2 : this.surfaceHeight * 2

    if (picture.width > pictureThumbnailSize || picture.height > pictureThumbnailSize) {
      const resizePicture = {}
      if (picture.width > picture.height) {
        resizePicture['resize'] = {width: pictureThumbnailSize}
      }
      else {
        resizePicture['resize'] = {height: pictureThumbnailSize}
      }

      const manipResult = await ImageManipulator.manipulate(picture.uri, [resizePicture], {
        format: 'jpeg',
      })

      uri = manipResult.uri
    }
    else {
      uri = picture.uri
    }

    const resizePicture = {}
    //54, 108, 162
    if (picture.width > picture.height) {
      resizePicture['resize'] = {width: 162}
    }
    else {
      resizePicture['resize'] = {height: 162}
    }

    const thumbnailResult = await ImageManipulator.manipulate(picture.uri, [resizePicture], {
      format: 'jpeg',
    })

    this.setState({
      selectedImage         : {uri, width: picture.width, height: picture.height},
      selectedImageThumbnail: {uri: thumbnailResult.uri},
    })
  }

  onSelectTab(selectedTab: Tab) {
    this.setState({
      selectedTab,
    })
  }

  onClose() {
    if (this.props.filterHistory.isDirty) {
      this.setState({
        dialogVisible: true,
      })
    }
    else {
      this.props.back()
    }
  }

  onSave() {
    if (this.props.filterHistory.isDirty) {
      this.props.onLoadingBar('savedImage')
      this.filteredImageRef.save()
    }
  }

  showToast(msg: string) {
    if (this.toastRef) {
      this.toastRef.show(msg)
    }
  }

  _renderFilterController() {
    const {selectedTab, selectedImageThumbnail} = this.state

    return (
      <View style={styles.tabMenuContainer}>
        <View
          style={[styles.tabMenuContentContainer, selectedTab === Tab.Filter ? styles.selectedTabMenuContentContainer : null]}>
          {
            <FilterValueList/>
          }
        </View>
        <View
          style={[styles.tabMenuContentContainer, selectedTab === Tab.FilterSet ? styles.selectedTabMenuContentContainer : null]}>
          {
            selectedImageThumbnail ? <FilterSetList selectedImageThumbnail={selectedImageThumbnail}/> : null
          }
        </View>
      </View>
    )
  }

  _renderFilterTab() {
    const {selectedTab} = this.state
    const {filterHistory} = this.props
    return (
      <View style={styles.filterTabContainer}>
        {/*close*/}
        <TouchableOpacity activeOpacity={1} style={styles.tabButton} onPress={this.onClose}>
          <Feather
            name="x"
            size={23}
            color="#888888"
          />
        </TouchableOpacity>

        {/*filter*/}
        <TouchableOpacity activeOpacity={1}
                          style={[styles.tabButton, {backgroundColor: selectedTab === Tab.FilterSet ? '#eeeeee' : '#ffffff'}]}
                          onPress={() => this.onSelectTab(Tab.FilterSet)}>
          <MaterialIcons
            name="content-copy"
            size={23}
            color={selectedTab === Tab.FilterSet ? '#000000' : '#888888'}
          />
        </TouchableOpacity>

        {/*modify*/}
        <TouchableOpacity activeOpacity={1}
                          style={[styles.tabButton, {backgroundColor: selectedTab === Tab.Filter ? '#eeeeee' : '#ffffff'}]}
                          onPress={() => this.onSelectTab(Tab.Filter)}>
          <Ionicons
            name="ios-options"
            size={23}
            color={selectedTab === Tab.Filter ? '#000000' : '#888888'}
          />
        </TouchableOpacity>

        <FilterHistory/>

        {/*upload*/}
        {/*<TouchableOpacity activeOpacity={1} style={styles.tabButton} onPress={this.onClose}>*/}
          {/*<Feather*/}
            {/*name="upload"*/}
            {/*size={23}*/}
            {/*color="#888888"*/}
          {/*/>*/}
        {/*</TouchableOpacity>*/}

        {/*save*/}
        <TouchableOpacity activeOpacity={1} style={[styles.tabButton, {backgroundColor:filterHistory.isDirty ? '#bef1d6' : '#ffffff'}]} onPress={this.onSave}>
          <Feather
            name="check"
            size={23}
            color={filterHistory.isDirty ? '#00c856' : '#cccccc'}
          />
        </TouchableOpacity>

      </View>
    )
  }

  _renderController() {
    return (
      <View style={styles.controllerContainer}>
        {
          this._renderFilterController()
        }
        {
          this._renderFilterTab()
        }
      </View>
    )
  }

  setFilteredImageRef(connectedComponent) {
    if (connectedComponent) {
      this.filteredImageRef = connectedComponent.getWrappedInstance()
    }
  }

  _renderPixi() {
    if (this.state.selectedImage) {
      return (
        <View style={styles.filterContainer}>
          <PinchZoomView
            minScale={1}
            maxScale={3}
          >
            <FilteredImage
              ref={this.setFilteredImageRef}
              surfaceWidth={this.surfaceWidth}
              surfaceHeight={this.surfaceHeight}
              uri={this.state.selectedImage.uri}
              imageWidth={this.state.selectedImage.width}
              imageHeight={this.state.selectedImage.height}
            />
          </PinchZoomView>
        </View>
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {
          isIphoneX() ?
            <StatusBar
              backgroundColor="#000000"
              barStyle="light-content"
            />
            :
            <StatusBar hidden={true}/>
        }

        {
          this._renderPixi()
        }

        {
          this._renderController()
        }

        <Toast
          style={{backgroundColor: '#000000'}}
          textStyle={{color: '#ffffff'}}
          position='center'
          ref={(toastRef) => this.toastRef = toastRef}
        />
        <ConfirmDialog
          visible={this.state.dialogVisible}
          title="Unsaved changes"
          message="Are you sure you wish to leave image editing?"
          onTouchOutside={() => this.setState({dialogVisible: false})}
          negativeButton={{
            title     : 'Discard changes',
            titleStyle: {
              color: '#747474',
            },
            onPress   : () => {
              this.setState({dialogVisible: false})
              this.props.clearFilterHistory()
              this.props.clearFilterValue()
              this.props.clearFilter()
              this.props.back()
            },
          }}
          positiveButton={{
            title     : 'Cancel',
            titleStyle: {
              color: '#000000',
            },
            onPress   : () => this.setState({dialogVisible: false}),
          }}
        >
        </ConfirmDialog>
        <SavingFilteredImage/>
        <LoadingBar/>
      </View>
    )
  }
}

export const
  Editor = connect<StateProps, DispatchProps, OwnProps>((state: RootState) => ({
    filterHistory: state.filterHistory,
  }), {
    navigate: NavigationActions.navigate,
    back    : NavigationActions.back,
    clearFilter,
    clearFilterValue,
    clearFilterHistory,
    setDirtyFilterHistory,
    onLoadingBar,
    offLoadingBar,
  })(EditorScreen)

const styles = StyleSheet.create({
  container                      : {
    paddingTop     : hiddenStatusBarSize,
    flex           : 1,
    padding        : 0,
    margin         : 0,
    justifyContent : 'flex-end',
    alignItems     : 'stretch',
    backgroundColor: '#000000',
  },
  filterContainer                : {
    flex           : 1,
    flexWrap       : 'wrap',
    alignItems     : 'center',
    justifyContent : 'center',
    backgroundColor: '#000000',
  },
  controllerContainer            : {
    height         : FILTER_LIST_HEIGHT + TAB_HEIGHT + safeBottomAreaSize,
    flexWrap       : 'wrap',
    flexDirection  : 'column',
    alignItems     : 'stretch',
    justifyContent : 'flex-end',
    paddingBottom  : safeBottomAreaSize,
    backgroundColor: '#ffffff',
  },
  filterTabContainer             : {
    height        : TAB_HEIGHT,
    flexWrap      : 'wrap',
    flexDirection : 'row',
    alignItems    : 'center',
    justifyContent: 'space-between',
  },
  tabButton                      : {
    width         : TAB_WIDTH - 14,
    height        : TAB_HEIGHT - 14,
    flexWrap      : 'wrap',
    alignItems    : 'center',
    justifyContent: 'center',
    // borderRadius  : TAB_WIDTH / 2,
    margin        : 7,
  },
  tabMenuContainer               : {
    flex: 1,
  },
  tabMenuContentContainer        : {
    position: 'absolute',
    bottom  : -200,
    left    : 0,
  },
  selectedTabMenuContentContainer: {
    bottom: 0,
  },
})