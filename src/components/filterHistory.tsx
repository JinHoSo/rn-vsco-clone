import React, {ReactNode} from 'react'
import {Button, View, StyleSheet, StatusBar, TouchableOpacity, Text, ScrollView} from 'react-native'
import {ActionType, filterHistory, FilterHistoryItem, FilterHistoryState} from '../redux/filterHistory/reducer'
import {connect} from 'react-redux'
import {RootState} from '../redux'
import {undoFilterHistory, redoFilterHistory, resetFilterHistoryIndex} from '../redux/filterHistory/actions'
import Modal from 'react-native-modal'
import {Feather, Ionicons, EvilIcons, MaterialCommunityIcons} from '@expo/vector-icons'
import {safeBottomAreaSize} from '../lib/screenSize'
import {HAIR_LINE_WIDTH, TAB_HEIGHT, TAB_WIDTH} from '../constant/env'

export const FILTER_HISTORY_HEIGHT = 200

interface State {
  isVisibleModal: boolean
}

interface OwnProps {
}

interface StateProps {
  filterHistory: FilterHistoryState,
}

interface DispatchProps {
  undoFilterHistory: typeof undoFilterHistory
  redoFilterHistory: typeof redoFilterHistory
  resetFilterHistoryIndex: typeof resetFilterHistoryIndex
}

interface Props extends StateProps, DispatchProps, OwnProps {
}

class FilterHistoryComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.resetFilter = this.resetFilter.bind(this)
  }

  componentWillMount() {
    this.setState({
      isVisibleModal: false,
    })
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

  resetFilter(filterIndex: number) {
    this.props.resetFilterHistoryIndex(filterIndex)
  }

  _renderType(actionType: ActionType, isSelectedItem: boolean) {
    // let iconName = 'plus'
    // if (actionType === ActionType.ADD) {
    //   iconName = 'plus'
    // }
    // else if (actionType === ActionType.REMOVE) {
    //   iconName = 'minus'
    // }
    //
    // return (
    //   <View style={styles.itemTypeIconContainer}>
    //     <Feather
    //       name={iconName}
    //       size={18}
    //       color={isSelectedItem ? '#ffffff': '#000000'}
    //     />
    //   </View>
    // )


    if (actionType === ActionType.REMOVE) {
      return (
        <View style={styles.itemTypeIconContainer}>
          <Feather
            name='minus'
            size={18}
            color={isSelectedItem ? '#ffffff' : '#000000'}
          />
        </View>
      )
    }

    return null
  }

  _renderFilterIcon(icon: (iconColor: string) => React.ReactElement<any>, isSelectedItem: boolean) {
    return <View style={styles.itemIconContainer}>{icon(isSelectedItem ? '#ffffff' : null)}</View>
  }

  _renderFilterName(filterName: string, isSelectedItem: boolean) {
    return (
      <Text style={[styles.itemText, isSelectedItem ? styles.selectedItemText : null]}>
        {
          filterName
        }
      </Text>
    )
  }

  _renderFilterValue(value: number, isSelectedItem: boolean) {
    return (
      <Text style={[styles.itemText, isSelectedItem ? styles.selectedItemText : null]}>
        {
          (value * 100).toFixed(0)
        }
      </Text>
    )
  }

  _renderFilterHistoryItem(item: FilterHistoryItem, index) {
    const currentIndex = this.props.filterHistory.currentIndex
    const isItemDisabled = currentIndex === -1 || currentIndex > index
    const isSelectedItem = currentIndex === index
    return (
      <TouchableOpacity activeOpacity={1} key={index}
                        style={[styles.item, isItemDisabled ? styles.itemDisabled : null, isSelectedItem ? styles.selectedItem : null]}
                        onPress={() => this.resetFilter(index)}>
        <View style={styles.itemTitleContainer}>
          {
            this._renderType(item.actionType, isSelectedItem)
          }
          {
            this._renderFilterIcon(item.filterIcon, isSelectedItem)
          }
          {
            this._renderFilterName(item.filterName, isSelectedItem)
          }
        </View>

        <View style={styles.itemValue}>
          {
            this._renderFilterValue(item.value, isSelectedItem)
          }
        </View>
      </TouchableOpacity>
    )
  }

  _renderFilterHistoryClearItem() {
    return (
      <TouchableOpacity style={styles.item} onPress={() => this.resetFilter(-1)}>
        <View style={styles.itemTitleContainer}>
          {
            this._renderFilterIcon(() => (
              <Feather
                name='minus'
                size={30}
                color='#000000'
              />
            ), false)
          }
          {
            this._renderFilterName('Clear', false)
          }
        </View>

        <View style={styles.itemValue}>
          {
            this._renderFilterValue(null, false)
          }
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const filterHistories = this.props.filterHistory.history
    return (
      <View>
        <TouchableOpacity style={styles.tabButton} onPress={this.openModal}>
          <Feather
            name="repeat"
            size={22}
            color={filterHistories.length > 0 ? '#888888' : '#cccccc'}
          />
        </TouchableOpacity>

        <Modal
          isVisible={this.state.isVisibleModal}
          style={styles.modalContainer}
          onBackButtonPress={this.closeModal}
          onBackdropPress={this.closeModal}
          backdropOpacity={0}
        >
          <View style={styles.modalContentContainer}>
            <ScrollView style={styles.scrollViewContainer} contentContainerStyle={styles.scrollViewContentContainer}>
              {
                filterHistories.map((filterHistoryItem, index) => {
                  return this._renderFilterHistoryItem(filterHistoryItem, index)
                })
              }
              {
                this._renderFilterHistoryClearItem()
              }
            </ScrollView>
          </View>
        </Modal>
      </View>
    )
  }
}

export const
  FilterHistory = connect<StateProps, DispatchProps, OwnProps>((state: RootState) => ({
    filterHistory: state.filterHistory,
  }), {
    undoFilterHistory      : undoFilterHistory,
    redoFilterHistory      : redoFilterHistory,
    resetFilterHistoryIndex: resetFilterHistoryIndex,
  })(FilterHistoryComponent)

const styles = StyleSheet.create({
  modalContainer            : {
    flex           : 1,
    flexDirection  : 'column',
    justifyContent : 'flex-end',
    backgroundColor: 'transparent',
    padding        : 0,
    margin         : 0,
  },
  modalContentContainer     : {
    flexDirection  : 'column',
    justifyContent : 'flex-start',
    backgroundColor: '#ffffff',
    height         : FILTER_HISTORY_HEIGHT + safeBottomAreaSize,
  },
  scrollViewContainer       : {
    height: FILTER_HISTORY_HEIGHT + safeBottomAreaSize,
  },
  scrollViewContentContainer: {
    paddingBottom: safeBottomAreaSize,
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
  item                      : {
    flexDirection    : 'row',
    justifyContent   : 'space-between',
    alignItems       : 'center',
    paddingHorizontal: 15,
    paddingVertical  : 10,
    borderBottomWidth: HAIR_LINE_WIDTH,
    borderColor      : '#d1d1d1',
  },
  itemDisabled              : {
    backgroundColor: '#e4e4e4',
  },
  selectedItem              : {
    backgroundColor: '#000000',
  },
  selectedItemText          : {
    color: '#ffffff',
  },
  itemTitleContainer        : {
    flexDirection : 'row',
    justifyContent: 'flex-start',
    alignItems    : 'center',
  },
  itemText                  : {
    color: '#000000',
    paddingHorizontal:10
  },
  disabledItemText          : {
    color: '#9c9c9c',
  },
  itemIconContainer         : {
    width         : 40,
    height        : 36,
    justifyContent: 'center',
    alignItems    : 'center',
  },
  itemTypeIconContainer     : {
    width         : 30,
    height        : 30,
    flexDirection : 'row',
    justifyContent: 'flex-start',
    alignItems    : 'center',
  },
  itemValue                 : {},
  filterIconTypeContainer   : {
    position: 'absolute',
    bottom  : 0,
    right   : 0,
  },
})