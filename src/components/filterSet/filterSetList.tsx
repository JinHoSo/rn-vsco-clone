import React from 'react'
import {FlatList, StyleSheet, View} from 'react-native'
import {EvilIcons, Feather, Ionicons, MaterialCommunityIcons} from '@expo/vector-icons'
import {filterSetsArray} from '../../lib/filterSets'
import {FilterSet} from './filterSet'
import {Filter, FilterImage, PIXI} from 'expo-pixi'
import {FilterSetThumbnailGenerator} from './filterSetThumbnailGenerator'
import {connect} from 'react-redux'
import {RootState} from '../../redux'
import {DataProvider, LayoutProvider, RecyclerListView} from 'recyclerlistview'
import {screenWidth} from '../../lib/screenSize'
import {FILTER_SET_ITEM_HEIGHT, FILTER_SET_ITEM_WIDTH} from '../../constant/env'

interface State {
  isReadyThumbnailGenerator: boolean
  dataProvider: any
}

interface OwnProps {
  selectedImageThumbnail: string
}

interface StateProps {
}

interface DispatchProps {
}

interface Props extends StateProps, DispatchProps, OwnProps {
}

export class FilterSetListComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const dataProvider = new DataProvider((r1, r2) => {
      return r1 !== r2
    })

    this.layoutProvider = new LayoutProvider(
      index => index,
      (type, dim) => {
        if (filterSetsArray[type] && filterSetsArray[type]['isLastItem']) {
          dim.width = FILTER_SET_ITEM_WIDTH + 10
          dim.height = FILTER_SET_ITEM_HEIGHT
        }
        else {
          dim.width = FILTER_SET_ITEM_WIDTH
          dim.height = FILTER_SET_ITEM_HEIGHT
        }
      },
    )


    this.state = {
      isVisibleModal           : false,
      isReadyThumbnailGenerator: false,
      dataProvider             : dataProvider.cloneWithRows(filterSetsArray),
    } as State

    this._renderFilterSetRecycleItem = this._renderFilterSetRecycleItem.bind(this)
    this.setThumbnailGenerator = this.setThumbnailGenerator.bind(this)
  }

  layoutProvider

  setThumbnailGenerator() {
    if (!this.state.isReadyThumbnailGenerator) {
      this.setState({
        isReadyThumbnailGenerator: true,
      })
    }
  }

  _renderFilterSetRecycleItem(type, item) {
    // console.log(item)
    return (
      <FilterSet key={item.title} source={this.props.selectedImageThumbnail} options={item}/>
    )
  }

  _renderFilterSetRecycleList() {
    if (this.state.isReadyThumbnailGenerator) {
      return (
        <View style={styles.recycleListContainer}>
          <RecyclerListView
            isHorizontal={true}
            disableRecycling={true}
            showsHorizontalScrollIndicator={false}
            layoutProvider={this.layoutProvider}
            dataProvider={this.state.dataProvider}
            rowRenderer={this._renderFilterSetRecycleItem}
            contentContainerStyle={styles.recycleListContentContainer}
          />
        </View>
      )
    }

    return null
  }

  _renderFilterSetThumbnailGenerator() {
    return (
      <FilterSetThumbnailGenerator ref={() => this.setThumbnailGenerator()}
                                   selectedImageThumbnail={this.props.selectedImageThumbnail}/>
    )
  }

  render() {
    if (this.props.selectedImageThumbnail) {
      return (
        <View style={styles.container}>
          {
            this._renderFilterSetThumbnailGenerator()
          }
          {
            this._renderFilterSetRecycleList()
          }
        </View>
      )
    }

    return null
  }
}

export const
  FilterSetList = connect<StateProps, DispatchProps, OwnProps>((state: RootState) => ({}), {})(FilterSetListComponent)

const styles = StyleSheet.create({
  container                       : {
  },
  filterControllerContentContainer: {
    flexDirection : 'row',
    alignItems    : 'flex-end',
    justifyContent: 'flex-start',
    height        : FILTER_SET_ITEM_HEIGHT,
  },
  recycleListContainer:{
    width: screenWidth,
    height: FILTER_SET_ITEM_HEIGHT,
  },
  recycleListContentContainer:{
    paddingHorizontal:10
  }
})