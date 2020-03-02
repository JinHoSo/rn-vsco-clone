import React from 'react'
import {ScrollView, StyleSheet} from 'react-native'
import {EvilIcons, Feather, Ionicons, MaterialCommunityIcons} from '@expo/vector-icons'
import {filterValuesArray} from '../../lib/filterSets'
import {Filter, FilterImage, PIXI} from 'expo-pixi'
import {connect} from 'react-redux'
import {RootState} from '../../redux'
import {FILTER_SET_ICON_HEIGHT, FILTER_SET_ICON_TITLE_HEIGHT} from '../../constant/env'
import {FilterValue} from './filterValue'

const FILTER_LIST_HEIGHT = FILTER_SET_ICON_HEIGHT + FILTER_SET_ICON_TITLE_HEIGHT + 10

interface State {
}

interface OwnProps {
}

interface StateProps {
}

interface DispatchProps {
}

interface Props extends StateProps, DispatchProps, OwnProps {
}

export class FilterValueListComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
  }

  render() {
    return (
      <ScrollView horizontal={true} style={styles.filterControllerContainer}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.filterControllerContentContainer}>
        {
          filterValuesArray.map((f, index) => (
            <FilterValue key={index} options={f} />
          ))
        }
      </ScrollView>
    )
  }
}

export const
  FilterValueList = connect<StateProps, DispatchProps, OwnProps>((state: RootState) => ({}), {})(FilterValueListComponent)

const styles = StyleSheet.create({
  filterControllerContainer       : {
    height: FILTER_LIST_HEIGHT,
  },
  filterControllerContentContainer:{
    flexDirection : 'row',
    alignItems    : 'flex-end',
    justifyContent: 'flex-start',
    height        : FILTER_LIST_HEIGHT,
    paddingHorizontal:10
  }
})