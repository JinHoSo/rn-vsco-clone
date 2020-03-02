import * as React from 'react'
import {getImageSize} from '../lib/imageSize'
import RNScaledImage from 'react-native-scaled-image'
import {View, StyleSheet} from 'react-native'

export type ScaledImageItem = {
  uri: string
  imageWidth: number
  imageHeight: number
  containerWidth: number
  containerHeight: number
}

interface Props {
  item: ScaledImageItem
}

export class ScaledImage extends React.PureComponent<Props, null> {
  constructor(props: Props) {
    super(props)

    const {
            uri,
            imageWidth,
            imageHeight,
            containerWidth,
            containerHeight,
          } = props.item

    const newImageSize = getImageSize(imageWidth, imageHeight, containerWidth, containerHeight)

    this.uri = uri
    this.imageWidth = newImageSize.width
    this.imageHeight = newImageSize.height
  }

  uri: string
  imageWidth: number
  imageHeight: number

  render() {
    return (
      <View style={styles.container}>
        <RNScaledImage source={{uri: this.uri}} width={this.imageWidth}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  }
})