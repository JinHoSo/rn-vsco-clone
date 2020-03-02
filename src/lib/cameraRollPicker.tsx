import {
  CameraRoll,
  FlatList,
  Image, ImageBackground,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native'
import * as React from 'react'
import {AnimationText} from './animationText'
import {safeBottomAreaSize, screenWidth} from './screenSize'
import PTRControl from 'react-native-ptr-control'
import Lightbox from './lightbox/lightbox'
import {ifIphoneX} from 'react-native-iphone-x-helper'
import {Permissions} from 'expo'
import {EventRegister} from 'react-native-event-listeners'

export const REFRESH_CAMERA_ROLL = 'REFRESH_CAMERA_ROLL'

interface ImageItemState {
}

interface ImageItemProps {
  index: string
  item: any
  selected: boolean
  onPressItem: (item: any, index: string | number) => void
  imageSize: number
  imageMargin: number
}

class ImageItem extends React.PureComponent<ImageItemProps, ImageItemState> {
  constructor(props: ImageItemProps) {
    super(props)
  }

  _onPress = (item: any, index: string) => {
    this.props.onPressItem(item, index)
  }

  render() {
    const image = this.props.item.node.image
    const uri = image.uri
    const index = this.props.index
    const imageMargin = this.props.imageMargin
    const imageWidth = this.props.imageSize
    const imageHeight = imageWidth * image.height / image.width
    // return (
    //   <TouchableOpacity
    //     activeOpacity={1}
    //     style={{padding: imageMargin / 2, width: imageWidth + imageMargin, height: imageHeight + imageMargin}}
    //     onPress={() => this._onPress(uri, index)}
    //   >
    //     <Image
    //       source={{uri}}
    //       style={{
    //         width          : imageWidth,
    //         height         : imageHeight,
    //         borderWidth    : 5,
    //         borderColor    : this.props.selected ? '#ffdd03' : 'transparent',
    //         backgroundColor: '#e8e8e8',
    //       }}
    //       resizeMode='cover'
    //     />
    //   </TouchableOpacity>
    // )

    return (
      <Lightbox underlayColor="white"
                style={{
                  margin         : 3,
                  width          : imageWidth + 10,
                  height         : imageHeight + 10,
                  borderWidth    : 5,
                  borderColor    : this.props.selected ? '#fd52ff' : 'transparent',
                  backgroundColor: this.props.selected ? '#fd52ff' : 'transparent',
                }}
                onPress={() => this._onPress(image, index)}
                source={{uri}}
      >
        <ImageBackground
          source={{uri}}
          style={{
            width : '100%',
            height: '100%',
          }}
          resizeMode='contain'
        />
      </Lightbox>
    )
  }
}

interface CameraRollPickerState {
  selected: number
  initialLoading: boolean
  loadingMore: boolean
  readyToPullRefresh: boolean
}

interface CameraRollPickerProps {
  scrollRenderAheadDistance?: number,
  initialListSize?: number,
  pageSize?: number,
  batchSize?: number,
  removeClippedSubviews?: boolean,
  groupTypes?: 'Album' | 'All' | 'Event' | 'Faces' | 'Library' | 'PhotoStream' | 'SavedPhotos',
  maximum?: number,
  assetType?: 'Photos' | 'Videos' | 'All',
  imagesPerRow?: number,
  imageMargin?: number,
  containerWidth?: number,
  onSubmit?: (selected) => void,
  selected?: Map<string, any>,
  selectedMarker?: React.ReactElement<any>,
  backgroundColor?: string,
  emptyText?: string,
  emptyTextStyle?: TextStyle,
  loader?: React.ReactElement<any>,
}

export class CameraRollPicker extends React.PureComponent<CameraRollPickerProps, CameraRollPickerState> {
  static defaultProps = {
    scrollRenderAheadDistance: 500,
    initialListSize          : 1,
    pageSize                 : 10,
    removeClippedSubviews    : true,
    groupTypes               : 'SavedPhotos',
    maximum                  : 15,
    imagesPerRow             : 3,
    imageMargin              : 16,
    assetType                : 'Photos',
    backgroundColor          : 'white',
    selected                 : null,
    onSubmit                 : function(selectedImages) {
    },
    emptyText                : 'No photos.',
  }

  public images = []
  public imageWidth: number
  public imageHeight: number

  public lastCursor = null
  public noMore = false
  public selectedItem: any

  public rollList: any

  public beginDragY = 0
  public beginDragTime = 0

  public refreshListener: any

  constructor(props: CameraRollPickerProps) {
    super(props)

    this.state = {
      selected          : null,
      initialLoading    : true,
      loadingMore       : false,
      readyToPullRefresh: false,
    }

    this._onEndReached = this._onEndReached.bind(this)
    this._renderFooterSpinner = this._renderFooterSpinner.bind(this)
    this._checkPermission = this._checkPermission.bind(this)
    this._submit = this._submit.bind(this)
    this.onRefresh = this.onRefresh.bind(this)
    this._renderHeader = this._renderHeader.bind(this)

    this.refreshListener = EventRegister.addEventListener(REFRESH_CAMERA_ROLL, () => {
      this.onRefresh()
    })
  }

  async componentWillMount() {
    this.imageWidth = (screenWidth - (this.props.imagesPerRow + 1) * this.props.imageMargin) / this.props.imagesPerRow
    this.imageHeight = this.imageWidth - 30

    if (await this._checkPermission()) {
      this.fetch()
    }
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.refreshListener)
  }

  async fetch() {
    if (!this.state.loadingMore) {
      this.setState({loadingMore: true}, async () => {
        await this._fetch()
      })
    }
  }

  async _fetch() {
    const {groupTypes, assetType} = this.props

    let fetchParams = {
      first     : 30,
      groupTypes: groupTypes,
      assetType : assetType,
    }

    if (Platform.OS === 'android') {
      // not supported in android
      delete fetchParams.groupTypes
    }

    if (this.lastCursor) {
      fetchParams['after'] = this.lastCursor
    }

    try {
      const photos = await CameraRoll.getPhotos(fetchParams)
      this._appendImages(photos)
    }
    catch (e) {

    }
  }

  onRefresh() {
    this.images = []
    this.lastCursor = null
    this.noMore = false
    this.selectedItem = null

    setTimeout(() => {
      this.setState({
        selected      : null,
        initialLoading: true,
        loadingMore   : false,
      }, async () => {
        await this.fetch()
        PTRControl.headerRefreshDone()
      })
    }, 300)
  }

  async _checkPermission(): Promise<boolean> {
    try {
      let {status} = await Permissions.getAsync(Permissions.CAMERA_ROLL)

      if (status !== 'granted') {
        await Permissions.askAsync(Permissions.CAMERA_ROLL)
      }

      return true
    } catch (err) {
      console.warn(err)

      return false
    }
  }

  _appendImages(data) {
    const assets = data.edges

    if (!data.page_info.has_next_page) {
      this.noMore = true
    }

    if (assets.length > 0) {
      this.lastCursor = data.page_info.end_cursor
      this.images = this.images.concat(assets)
    }

    this.setState({
      loadingMore       : false,
      initialLoading    : false,
      readyToPullRefresh: false,
    })
  }

  _onEndReached() {
    if (!this.noMore) {
      this.fetch()
    }
  }

  _keyExtractor = (item, index) => index

  _onPressItem = (item, key: number) => {
    this.setState((state) => {
      let selected = null
      if (state.selected !== key) {
        selected = key
        this.selectedItem = item
      }
      else {
        selected = null
        this.selectedItem = null
      }
      return {selected}
    }, () => {
      this._submit()
    })
  }

  _renderHeader(gestureStatus, offset) {
    // console.log(offset)

    const offsetOpacity = Math.min(1, offset / 100)

    const loadingBarOffsetColor = `rgba(253,82,221,${offsetOpacity})`
    const loadingBarColor = gestureStatus === 3 || gestureStatus === 4 ? 'rgba(253,82,221,1)' : loadingBarOffsetColor

    return (
      <View style={styles.pullRefreshContainer}>
        <View
          style={[styles.pullRefreshItem, {
            width          : this.imageWidth,
            height         : this.imageHeight,
            backgroundColor: loadingBarColor,
          }]}>
        </View>
        <View
          style={[styles.pullRefreshItem, {
            width          : this.imageWidth,
            height         : this.imageHeight,
            backgroundColor: loadingBarColor,
          }]}>
        </View>
        <View
          style={[styles.pullRefreshItem, {
            width          : this.imageWidth,
            height         : this.imageHeight,
            backgroundColor: loadingBarColor,
          }]}>
        </View>
      </View>
    )
  }

  _renderFooterSpinner() {
    return (
      <View style={styles.listFooterContainer}>

      </View>
    )
  }

  _renderItem = ({item, index}) => (
    <View style={styles.imageItemContainer}>
      <ImageItem
        index={index}
        imageSize={this.imageWidth}
        imageMargin={this.props.imageMargin}
        item={item}
        onPressItem={this._onPressItem}
        selected={this.state.selected === index}
      />
    </View>
  )

  _submit() {
    if (this.props.onSubmit) {
      this.props.onSubmit(this.selectedItem)
    }
  }

  render() {
    const hasSelectedItem = this.state.selected !== null
    return (
      <View style={styles.container}>
        <PTRControl
          scrollComponent={'FlatList'}
          getRef={(ref) => this.rollList = ref}
          removeClippedSubviews={true}
          numColumns={this.props.imagesPerRow}
          onEndReached={this._onEndReached}
          data={this.images}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          enableHeaderRefresh={true}
          renderHeaderRefresh={this._renderHeader}
          onHeaderRefreshing={this.onRefresh}
          setHeaderHeight={this.imageHeight + 16}
          ListFooterComponent={this._renderFooterSpinner}
          style={styles.listContainer}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={true}
          enableFooterInfinite={false}
        />

        {/*<AnimationText*/}
        {/*text="Edit"*/}
        {/*active={hasSelectedItem}*/}
        {/*activeStyle={styles.activeStyle}*/}
        {/*activeContainerStyle={styles.activeContainerStyle}*/}
        {/*inactiveStyle={styles.inactiveStyle}*/}
        {/*inactiveContainerStyle={styles.inactiveContainerStyle}*/}
        {/*onPress={this._submit}*/}
        {/*/>*/}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container             : {
    flex: 1,
  },
  listContainer         : {
    flex: 1,
  },
  contentContainer      : {
    padding: 8,
  },
  activeStyle           : {
    color     : '#ffffff',
    fontSize  : 20,
    fontWeight: '500',
  },
  activeContainerStyle  : {
    position               : 'absolute',
    bottom                 : safeBottomAreaSize,
    left                   : 50,
    right                  : 50,
    height                 : 50,
    alignItems             : 'center',
    justifyContent         : 'center',
    borderTopLeftRadius    : 5,
    borderTopRightRadius   : 5,
    borderBottomLeftRadius : ifIphoneX(5, 0),
    borderBottomRightRadius: ifIphoneX(5, 0),
    backgroundColor        : '#fd52ff',
    // borderTopWidth:2,
    // borderColor:'#ffffff'
  },
  inactiveStyle         : {
    color     : '#797979',
    fontSize  : 20,
    fontWeight: '500',
  },
  inactiveContainerStyle: {
    position       : 'absolute',
    bottom         : -50 - safeBottomAreaSize,
    left           : 50,
    right          : 50,
    height         : 50 + safeBottomAreaSize,
    alignItems     : 'center',
    justifyContent : 'center',
    borderRadius   : 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  listFooterContainer   : {
    width          : screenWidth,
    height         : 90,
    backgroundColor: 'transparent',
  },
  reloadTextContainer   : {
    paddingHorizontal: 10,
    paddingVertical  : 5,
    borderRadius     : 0,
    backgroundColor  : '#ddd',
    height           : 31,
    margin           : 10,
  },
  reloadText            : {
    fontSize  : 13,
    fontWeight: '500',
    textAlign : 'center',
  },
  pullRefreshContainer  : {
    paddingHorizontal: Platform.OS === 'ios' ? 8 : 0,
    paddingTop       : Platform.OS === 'ios' ? 16 : 8,
    paddingBottom    : Platform.OS === 'ios' ? 0 : 8,
    flex             : 1,
    flexWrap         : 'wrap',
    flexDirection    : 'row',
    justifyContent   : 'center',
    alignItems       : 'center',
  },
  pullRefreshItem       : {
    backgroundColor : '#e8e8e8',
    marginHorizontal: 8,
  },
  imageItemContainer    : {
    flexDirection : 'column',
    justifyContent: 'flex-end',
  },
})