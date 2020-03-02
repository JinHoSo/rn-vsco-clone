import {SafeAreaView as RNSafeAreaView, SafeAreaViewProps} from 'react-navigation'
import {StyleSheet, StatusBar} from 'react-native'
import * as React from 'react'
import {isIphoneX} from 'react-native-iphone-x-helper'

interface Props extends SafeAreaViewProps {
}

export class SafeAreaView extends React.PureComponent<Props, null> {
  render() {
    let {forceInset, children} = this.props

    forceInset = {
      bottom: 'never',
      ...forceInset,
    }

    if (!isIphoneX()) {
      forceInset = {
        top   : 'never',
        ...forceInset,
      }

      RNSafeAreaView.setStatusBarHeight(0);
    }

    return (
      <RNSafeAreaView style={styles.container} forceInset={forceInset}>
        {
          isIphoneX() ?
            <StatusBar
              backgroundColor="#ffffff"
              barStyle="dark-content"
            />
            :
            <StatusBar hidden={true}/>
        }

        {children}
      </RNSafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex           : 1,
    backgroundColor: '#ffffff',
  },
})