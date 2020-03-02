import vertex from '../defaultVert'
import fragment from './unsharpMaskFrag'
import {PIXI} from 'expo-pixi'
import {filters} from '../../filterSets'

/**
 * The ability to adjust gamma, contrast, saturation, brightness, alpha or color-channel shift. This is a faster
 * and much simpler to use than {@link http://pixijs.download/release/docs/PIXI.filters.ColorMatrixFilter.html ColorMatrixFilter}
 * because it does not use a matrix.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/adjustment.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 *
 * @param {object|number} [options] - The optional parameters of the filter.
 * @param {number} [options.gamma=1] - The amount of luminance
 * @param {number} [options.saturation=1] - The amount of color saturation
 * @param {number} [options.contrast=1] - The amount of contrast
 * @param {number} [options.brightness=1] - The overall brightness
 * @param {number} [options.red=1] - The multipled red channel
 * @param {number} [options.green=1] - The multipled green channel
 * @param {number} [options.blue=1] - The multipled blue channel
 * @param {number} [options.alpha=1] - The overall alpha amount
 */

interface AdjustmentOptions {
  radius: number
  strength: number
}

export class UnsharpMaskFilter extends PIXI.Filter<{}> {
  constructor(options?: AdjustmentOptions) {
    super(vertex, fragment)

    Object.assign(this, {
      /**
       * The amount of luminance
       * @member {number}
       * @memberof PIXI.filters.AdjustmentFilter#
       * @default 1
       */
      strength: 0,
      radius  : 0,
    }, options)


    this.blurFilter = filters.blur(this.radius)
  }

  radius: number
  strength: number
  blurredTexture: PIXI.Texture
  blurFilter: PIXI.Filter

  /**
   * Override existing apply method in PIXI.Filter
   * @private
   */
  apply(this: PIXI.Filter, filterManager, input, output, clear, currentState) {

    const blurTarget = filterManager.getRenderTarget(true)

    this.blurFilter.apply(filterManager, input, blurTarget, true, currentState)

    this.uniforms.strength = this.strength
    this.uniforms.blurredTexture = blurTarget

    filterManager.applyFilter(this, input, output, clear)
    filterManager.returnRenderTarget(blurTarget)
  }
}