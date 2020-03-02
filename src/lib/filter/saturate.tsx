import React, {Component} from 'react'
import { Shaders, Node, GLSL } from "gl-react";

interface State {
}

export interface Props {
  contrast?: number
  saturation?: number
  brightness?: number
}

const shaders = Shaders.create({
  Saturate: {
    frag: GLSL`
precision highp float;
varying vec2 uv;
uniform sampler2D t;
uniform float contrast, saturation, brightness;
const vec3 L = vec3(0.2125, 0.7154, 0.0721);

void main() {
  vec4 c = texture2D(t, uv);
	vec3 brt = c.rgb * brightness;
	gl_FragColor = vec4(mix(
    vec3(0.5),
    mix(vec3(dot(brt, L)), brt, saturation),
    contrast), c.a);
}`,
  },
})

export const SaturateNode = ({contrast, saturation, brightness, children}) => (
  <Node
    shader={shaders.Saturate}
    uniforms={{contrast, saturation, brightness, t: children}}
  />
)

export class Saturate extends React.Component<Props, State> {
  static defaultProps = {
    contrast  : 1,
    saturation: 1,
    brightness: 1,
  }

  render() {
    const {contrast, saturation, brightness, children} = this.props
    return (
      <SaturateNode contrast={contrast}
                    saturation={saturation}
                    brightness={brightness}
      >
        {children}
      </SaturateNode>
    )
  }

}