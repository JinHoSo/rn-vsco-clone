import vertex from '../defaultVert'
import {PIXI} from 'expo-pixi'

interface FilterOptions {
  [key: string]: any
}

export class CommonFilter extends PIXI.Filter<{}> {
  constructor(fragment, value) {
    super(vertex, fragment)
    this.value = value
  }

  get value(this: PIXI.Filter) {
    return this.uniforms.value
  }

  set value(this: PIXI.Filter, value) {
    this.uniforms.value = value
  }
}