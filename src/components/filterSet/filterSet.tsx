import React from 'react'
import {Feather, Ionicons, MaterialIcons} from '@expo/vector-icons'
import {Filter, FilterImage, PIXI} from 'expo-pixi'
import {RootState} from '../../redux'
import {connect} from 'react-redux'

import {deleteFilter, upsertFilter} from '../../redux/filter/actions'
import {OldFilmFilter} from '@pixi/filter-old-film'
import {SliderFilterSetComponent, SliderFilterSetProps, SliderFilterSetState} from './filterSetComponent'
import {EventRegister} from 'react-native-event-listeners'
import {addFilterHistory, setDirtyFilterHistory} from '../../redux/filterHistory/actions'
import {ActionType, FilterType} from '../../redux/filterHistory/reducer'
import {View} from 'react-native'

interface State extends SliderFilterSetState {
}

interface OwnProps extends SliderFilterSetProps {
}

interface StateProps {
}

interface DispatchProps {
  upsertFilter: typeof upsertFilter
  deleteFilter: typeof deleteFilter
  setDirtyFilterHistory: typeof setDirtyFilterHistory
  addFilterHistory: typeof addFilterHistory
}

interface Props extends StateProps, DispatchProps, OwnProps {
}

class FilterSetComponent extends SliderFilterSetComponent<Props, State> {
  constructor(props: Props) {
    super(props)
  }



  onPressFilter() {
    if (!this.state.isAppliedFilter) {
      this.setState({
        isAppliedFilter: true,
      })
      this.onValueChange(this.defaultSliderValue)
      this.selectFilterSet()
      if (this.title !== 'Original') {
        this.props.setDirtyFilterHistory(true)
      }
    }
    else if (this.state.isAppliedFilter && this.needSlider) {
      this.openModal()
    }
    else {
      this.removeFilter()
    }
  }

  onApplyFilter() {
    this.props.addFilterHistory(
      ActionType.ADD,
      FilterType.FilterSet,
      ()=>(<View style={{width:24,height:30, borderRadius:3, backgroundColor:this.iconStyle.backgroundColor}}></View>),
      this.title,
      this.sliderValue)
    this.setFilterSetTitle(this.sliderValue)
    this.closeModal()
  }

  onCancelFilter() {
    this.onValueChange(this.defaultSliderValue)
    this.setFilterSetTitle(this.sliderValue)
    this.closeModal()
  }

  onInitialValue() {
    this.props.deleteFilter('filterSet')
  }

  generateFilter(value) {
    // this.props.upsertFilter({
    //   [this.title]: this.filter(value),
    // })
    this.props.upsertFilter({
      'filterSet': this.filter(value),
    })
  }

  removeFilter() {
    this.setState({
      isAppliedFilter: false,
    })
    this.sliderValue = this.defaultSliderValue
    this.setFilterSetTitle(this.sliderValue)
  }
}

export const FilterSet = connect<StateProps, DispatchProps, OwnProps>((state: RootState) => ({}), {
  upsertFilter,
  deleteFilter,
  setDirtyFilterHistory,
  addFilterHistory,
})(FilterSetComponent)

