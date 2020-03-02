import {screenHeight, screenWidth} from './screenSize'

export const getImageSize = (
  imageWidth: number,
  imageHeight: number,
  containerWidth: number  = screenWidth,
  containerHeight: number = screenHeight): {width: number, height: number, ratio: number} => {

  const imageRatio = imageWidth / imageHeight
  let newImageWidth = imageWidth
  let newImageHeight = imageHeight

  // width is bigger
  if (imageRatio >= 1) {
    newImageWidth = containerWidth
    newImageHeight = newImageWidth / imageRatio
    if (newImageHeight > containerHeight) {
      newImageHeight = containerHeight
      newImageWidth = containerHeight * imageRatio
    }
    //height is bigger
  } else {
    newImageHeight = containerHeight
    newImageWidth = newImageHeight * imageRatio
    if (newImageWidth > containerWidth) {
      newImageWidth = containerWidth
      newImageHeight = containerWidth / imageRatio
    }
  }

  return {
    width : newImageWidth,
    height: newImageHeight,
    ratio: imageRatio
  }
}