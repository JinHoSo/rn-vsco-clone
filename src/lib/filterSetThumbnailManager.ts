type Thumbnail = {
  filterTitle: string
  uri: string
  cb: (uri: string) => void
}

interface Thumbnails {
  [filterTitle: string]: Thumbnail
}

export class ThumbnailManager {
  constructor() {
    this.thumbnails = {}
  }

  thumbnails: Thumbnails

  reserve(filterTitle: Thumbnail['filterTitle'], cb: Thumbnail['cb']) {
    const reservation = {
      filterTitle,
      cb,
      uri: null,
    }

    this.thumbnails[filterTitle] = reservation
  }

  complate(filterTitle: Thumbnail['filterTitle'], uri: Thumbnail['uri']) {
    const thumbnail = this.thumbnails[filterTitle]

    this.thumbnails[filterTitle] = {
      ...thumbnail,
      uri,
    }

    if (thumbnail.cb) {
      thumbnail.cb(uri)
    }
  }

  clear(){
    this.thumbnails = {}
  }
}