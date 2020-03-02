import React from 'react'
import {Filter, FilterImage, PIXI} from 'expo-pixi'
import spriteAsync from 'expo-pixi/lib/spriteAsync'
import {GLView} from 'expo-gl'
import {takeSnapshotAsync} from 'expo-pixi/lib/utils'

global.__ExpoFilterImageId = global.__ExpoFilterImageId || 0

interface
Props
{
  updatedFilter:any
}

export class AdvancedFilterImage extends FilterImage {
  renderer: any
  image: any
  props: Props

  componentWillMount() {
    global.__ExpoFilterImageId++
  }

  componentWillUnmount() {
    if(this.renderer){
      this.renderer.destroy(true)
    }
    this.renderer = null
    this.stage    = null
    this.image    = null
    this.context  = null
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {props} = this

    if (nextProps.resizeMode !== props.resizeMode) {
      this.updateResizeMode(nextProps.resizeMode)
    }
    if (nextProps.source !== props.source) {
      this.updateTextureAsync(nextProps.source)
    }
    if (nextProps.filters !== props.filters) {
      this.updateFilters(nextProps.filters)
    }
    if (nextProps.crop !== props.crop) {
      this.crop(nextProps.crop)
    }
    return false
  }

  onContextCreate = async (context: WebGLRenderingContext) => {
    const {filters, resizeMode, source} = this.props

    this.context = context
    this.stage   = new PIXI.Container()

    const getAttributes          = context.getContextAttributes || (() => ({}))
    context.getContextAttributes = () => {
      const contextAttributes = getAttributes()
      return {
        ...contextAttributes, stencil: true,
      }
    }

    this.renderer = await PIXI.autoDetectRenderer(context.drawingBufferWidth, context.drawingBufferHeight, {
      context, antialias: true, backgroundColor: 'black', transparent: true, autoStart: false,
    })

    this.image = await spriteAsync(source)
    this.stage.addChild(this.image)

    this.renderer._update = () => {
      this.renderer.render(this.stage)
      context.endFrameEXP()
    }

    this.updateResizeMode(resizeMode)
    this.updateFilters(filters)
    this.props.onReady && this.props.onReady(context)
  }

  updateFilters = filters => {
    if (!this.renderer || !this.image || !filters) {
      return
    }
    if (!Array.isArray(filters)) {
      this.image.filters = [filters]
    } else {
      this.image.filters = filters
    }

    this.renderer._update()

    setTimeout(() => {
      this.props.updatedFilter && this.props.updatedFilter(true)
    }, 10)
  }

  takeSnapshotAsync = (...args) => {
    if (!this.renderer || !this.glView) {
      return
    }

    return takeSnapshotAsync(this.glView, ...args)
  }

  crop = ({x, y, width, height}) => {
    if (!this.renderer || !this.image) {
      return
    }

    var texture        = new PIXI.Texture(this.image.texture, new PIXI.Rectangle(x, y, width, height))
    this.image.texture = texture
    this.image.width   = width
    this.image.height  = height
    this.updateResizeMode('cover')
  }

  render() {
    return (<GLView
        onLayout={this.onLayout}
        key={'Expo.FilterImage-' + global.__ExpoFilterImageId}
        ref={this.setRef}
        {...this.props}
        onContextCreate={this.onContextCreate}
      />)
  }
}