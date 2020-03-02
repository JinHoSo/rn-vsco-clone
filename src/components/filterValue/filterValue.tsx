import React from 'react'
import {Feather} from '@expo/vector-icons'
import {PIXI} from 'expo-pixi'
import {RootState} from '../../redux'
import {connect} from 'react-redux'

import {deleteFilter, upsertFilter} from '../../redux/filter/actions'
import {SliderFilterValueComponent, SliderFilterValueProps, SliderFilterValueState} from './filterValueComponent'
import {addFilterHistory} from '../../redux/filterHistory/actions'
import {ActionType, FilterType} from '../../redux/filterHistory/reducer'

interface State extends SliderFilterValueState {
}

interface OwnProps extends SliderFilterValueProps {
}

interface StateProps {
}

interface DispatchProps {
  upsertFilter: typeof upsertFilter,
  deleteFilter: typeof deleteFilter,
  addFilterHistory: typeof addFilterHistory
}
interface Props extends StateProps, DispatchProps, OwnProps {
}

class FilterValueComponent extends SliderFilterValueComponent<Props, State> {
  constructor(props: Props) {
    super(props)
  }

  generateFilter(value) {
    this.props.upsertFilter({
      [this.title]: this.filter(value),
    })
  }

  removeFilter() {
    this.onValueChange(this.defaultSliderValue)
    this.props.deleteFilter(this.title)
    this.setFilterSetTitle(this.sliderValue)
  }

  onApplyFilter() {
    this.props.addFilterHistory(
      ActionType.ADD,
      FilterType.Filter,
      (iconColor?) => (this.renderIcon(iconColor)),
      this.title,
      this.sliderValue)
    this.setFilterSetTitle(this.sliderValue)
    this.closeModal()
  }

  onCancelFilter() {
    this.removeFilter()
    this.props.addFilterHistory(
      ActionType.REMOVE,
      FilterType.Filter,
      (iconColor?) => (this.renderIcon(iconColor)),
      this.title,
      this.sliderValue)
    this.closeModal()
  }
}

export const FilterValue = connect<StateProps, DispatchProps, OwnProps>((state: RootState) => ({}), {
  upsertFilter,
  deleteFilter,
  addFilterHistory,
})(FilterValueComponent)