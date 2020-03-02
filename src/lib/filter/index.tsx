import React from 'react'
import {Surface} from './gl-react-implementation'
import {Props as SaturateProps, Saturate} from './saturate'
import {CameraRoll, Text, TouchableOpacity, View} from 'react-native'
import {hiddenStatusBarSize, safeBottomAreaSize, screenHeight, screenWidth} from '../screenSize'
import {Image, Props as ImageProps} from './image'
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource'


const containerWidth = screenWidth
const containerHeight = screenHeight - (100 + safeBottomAreaSize + hiddenStatusBarSize)

import {
  Shaders,
  Node,
  GLSL,
  connectSize,
  LinearCopy,
  Uniform
} from "gl-react";
type SnapshotOptions = {
  width?: number,
  height?: number,
  format?: 'png' | 'jpg' | 'jpeg' | 'webm',
  quality?: number,
  result?: 'file' | 'base64' | 'data-uri',
};

type ImageSize = {
  width: number
  height: number
}

interface State {
  result: any
}

export interface OwnProps extends SaturateProps, ImageProps {
  picture: any
}

interface StateProps {
}

interface DispatchProps {
}

interface Props extends StateProps, DispatchProps, OwnProps {
}

export class Filter extends React.Component<Props, State> {
  static defaultProps = {
    contrast  : 1,
    saturation: 1,
    brightness: 1,
    zoom      : 1,
  }

  constructor(props: Props) {
    super(props)

    const picture = this.props.picture

    this.setSurfaceSize(picture.width, picture.height)
    this.save = this.save.bind(this)

    this.state = {
      result: null,
    }
  }

  surface: any

  surfaceWidth = 0
  surfaceHeight = 0

  getZoomSize(width: number, height: number): number {
    const imageRatio = width / height
    let imageWidth = width
    let imageHeight = height

    if (imageRatio >= 1) {
      imageWidth = containerWidth
      imageHeight = imageWidth / imageRatio
      if (imageHeight > containerHeight) {
        imageHeight = containerHeight
        imageWidth = containerHeight * imageRatio

        return containerWidth / imageWidth
      }

      return containerHeight / imageHeight
    } else { // portrait
      imageHeight = containerHeight
      imageWidth = imageHeight * imageRatio
      if (imageWidth > containerWidth) {
        imageWidth = containerWidth
        imageHeight = containerWidth / imageRatio

        return containerHeight / imageHeight
      }

      return containerWidth / imageWidth
    }
  }

  setSurfaceSize(width: number, height: number): void {
    const imageRatio = width / height
    let imageWidth = width
    let imageHeight = height

    if (imageRatio >= 1) {
      imageWidth = containerWidth
      imageHeight = imageWidth / imageRatio
      if (imageHeight > containerHeight) {
        imageHeight = containerHeight
        imageWidth = containerHeight * imageRatio
      }
    } else { // portrait
      imageHeight = containerHeight
      imageWidth = imageHeight * imageRatio
      if (imageWidth > containerWidth) {
        imageWidth = containerWidth
        imageHeight = containerWidth / imageRatio
      }
    }

    this.surfaceWidth = imageWidth
    this.surfaceHeight = imageHeight
  }

  async save() {
    try {
      const option : SnapshotOptions = {
        format:'png',
        result:'file',
        quality:0.6
      }
      const result = await this.surface.glView.capture()
    }
    catch (e) {
      console.error(e)
    }
  }

  render() {
    const {picture} = this.props

    console.log('picture',picture)

    return (
      <View>
        <Surface ref={(ref) => this.surface = ref} style={{width: this.surfaceWidth, height: this.surfaceHeight}}>
          <DiamondCrop>
              {{uri: 'https://i.imgur.com/5EOyTDQ.jpg'}}
          </DiamondCrop>
        </Surface>
        <TouchableOpacity onPress={this.save} style={{backgroundColor: '#ffffff'}}>
          <Text>Save {this.state.result ? 'success' : 'failed'}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const shaders = Shaders.create({
  DiamondCrop: {
    frag: GLSL`
precision highp float;
varying vec2 uv;
uniform sampler2D t;
void main() {
gl_FragColor = mix(
  texture2D(t, uv),
  vec4(0.0),
  step(0.5, abs(uv.x - 0.5) + abs(uv.y - 0.5))
);
}`
  }
});

export const DiamondCrop = ({ children: t }) => (
  <Node shader={shaders.DiamondCrop} uniforms={{ t }} />
);

function getRandomNumber(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(1))
}