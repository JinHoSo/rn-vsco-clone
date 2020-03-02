import {createStackNavigator} from 'react-navigation'
import {Home} from './screen/home'
import {Editor} from './screen/editor'
import {Picture} from './screen/picture'
import {HAIR_LINE_WIDTH, PRIMARY_COLOR} from './constant/env'
import {hiddenStatusBarSize} from './lib/screenSize'
import {StyleSheet} from 'react-native'

export const AppNavigator = createStackNavigator({
  Home  : {screen: Home, navigationOptions: {header: null}},
  Editor: {
    screen           : Editor,
    navigationOptions: {
      header         : null,
      gesturesEnabled: false,
    },
  },
  Picture: {
    screen           : Picture,
    navigationOptions: {
      header         : null,
    },
    // navigationOptions: {
    //   headerStyle     : {
    //     height           : 50,
    //     paddingHorizontal:8,
    //     backgroundColor  : '#ffffff',
    //     borderBottomWidth: HAIR_LINE_WIDTH,
    //     borderBottomColor:'#dcdcdc',
    //     shadowColor      : 'transparent',
    //     shadowOpacity    : 0,
    //     shadowOffset     : {
    //       height: 0,
    //       width : 0,
    //     },
    //     elevation        : 0,
    //   },    },
  },
}, {
  initialRouteName : 'Home',
  headerMode       : 'screen',
  navigationOptions: {
    headerTitleStyle: {color: PRIMARY_COLOR},
    headerStyle     : {
      height           : 50,
      backgroundColor  : '#ffffff',
      borderBottomWidth: HAIR_LINE_WIDTH,
      borderBottomColor:'#dcdcdc',
      shadowColor      : 'transparent',
      shadowOpacity    : 0,
      shadowOffset     : {
        height: 0,
        width : 0,
      },
      elevation        : 0,
    },
    headerTintColor : PRIMARY_COLOR,
  },
  cardStyle        : {backgroundColor: '#ffffff'},
})

export const headerStyles = StyleSheet.create({
  header             : {
    height           : 50,
    backgroundColor  : '#ffffff',
    borderBottomWidth: HAIR_LINE_WIDTH,
    borderBottomColor: '#dcdcdc',
    flexWrap         : 'wrap',
    flexDirection    : 'row',
    alignItems       : 'center',
    justifyContent   : 'space-between',
  },
  headerBackIcon:{
    height        : 50,
    marginLeft    : 5,
    marginRight   : 5,
    paddingLeft: 6,
    flexWrap      : 'wrap',
    flexDirection : 'row',
    alignItems    : 'center',
    justifyContent: 'flex-start',
  },
  headerBackTitle:{
    fontSize:18,
    paddingHorizontal:5
  },
  headerIcon         : {
    width         : 50,
    height        : 50,
    marginLeft    : 5,
    marginRight   : 5,
    flexWrap      : 'wrap',
    flexDirection : 'row',
    alignItems    : 'center',
    justifyContent: 'center',
  },
})