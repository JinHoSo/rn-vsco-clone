import React, {PureComponent} from 'react'
import {TouchableWithoutFeedback, Text, TextStyle, ViewStyle, StyleSheet} from 'react-native'
import {View} from 'react-native-animatable'
import {
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  Foundation,
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  Octicons,
  Zocial,
  SimpleLineIcons,
} from '@expo/vector-icons'
import {VectorIcon} from './filterSets'

interface State {
}

interface Props extends VectorIcon {
}

export class MakeIcon extends PureComponent<Props, State> {
  static defaultProps = {
    iconType : '',
    iconName : '',
    iconColor: '',
    iconSize : 10,
  }

  constructor(props: Props) {
    super(props)
  }

  iconComponent(iconType, iconName, iconColor, iconSize, text) {
    switch (iconType) {
      case 'View':
        return (
          <View style={styles.textIconContainer}>
            <Text style={styles.textIcon}>
              {
                text
              }
            </Text>
          </View>
        )
      case 'Entypo':
        return <Entypo
          style={styles.icon}
          name={iconName}
          size={iconSize}
          color={iconColor}
        />
      case 'EvilIcons':
        return <EvilIcons
          style={styles.icon}
          name={iconName}
          size={iconSize}
          color={iconColor}
        />
      case 'Feather':
        return <Feather
          style={styles.icon}
          name={iconName}
          size={iconSize}
          color={iconColor}
        />
      case 'FontAwesome':
        return <FontAwesome
          style={styles.icon}
          name={iconName}
          size={iconSize}
          color={iconColor}
        />
      case 'Foundation':
        return <Foundation
          style={styles.icon}
          name={iconName}
          size={iconSize}
          color={iconColor}
        />
      case 'Ionicons':
        return <Ionicons
          style={styles.icon}
          name={iconName}
          size={iconSize}
          color={iconColor}
        />
      case 'MaterialIcons':
        return <MaterialIcons
          style={styles.icon}
          name={iconName}
          size={iconSize}
          color={iconColor}
        />
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons
          style={styles.icon}
          name={iconName}
          size={iconSize}
          color={iconColor}
        />
      case 'Octicons':
        return <Octicons
          style={styles.icon}
          name={iconName}
          size={iconSize}
          color={iconColor}
        />
      case 'Zocial':
        return <Zocial
          style={styles.icon}
          name={iconName}
          size={iconSize}
          color={iconColor}
        />
      case 'SimpleLineIcons':
        return <SimpleLineIcons
          style={styles.icon}
          name={iconName}
          size={iconSize}
          color={iconColor}
        />
      default:
        return <MaterialIcons
          style={styles.icon}
          name={iconName}
          size={iconSize}
          color={iconColor}
        />
    }
  }

  render() {
    const {iconType, iconName, iconColor, iconSize, iconText} = this.props
    return this.iconComponent(iconType, iconName, iconColor, iconSize, iconText)
  }
}

const styles = StyleSheet.create({
  icon:{
    height        : 32,
  },
  textIconContainer: {
    width         : 30,
    height        : 30,
    flexWrap      : 'wrap',
    alignItems    : 'center',
    justifyContent: 'center',
    borderWidth   : 2,
    borderColor   : '#000000',
    borderRadius  : 15,
  },
  textIcon         : {
    fontSize : 18,
    color    : '#000000',
    textAlign: 'center',
  },
})