import { Injectable } from '@nestjs/common'
import { default as cvFactory } from '@uysontran/opencv4nodejs'

import * as path from 'path'
import opencvBinDir from '../../../resources/opencv/opencv_barcode460.dll?asset&asarUnpack'
process.env.path = `${process.env.path};${path.join(opencvBinDir, '../')};`
export default path

const cv = cvFactory()

@Injectable()
export class AppService {
  detectSpot({
    imageBase64,
    size,
    distance
  }: {
    imageBase64: string
    size: number
    distance: number
  }) {
    const base64data = imageBase64
      .replace('data:image/jpeg;base64', '')
      .replace('data:image/png;base64', '')
    const image = cv.imdecode(Buffer.from(base64data, 'base64'))
    const hsvImage = image.cvtColor(cv.COLOR_BGR2HSV)
    const mask0 = hsvImage.inRange(new cv.Vec3(120, 50, 50), new cv.Vec3(174, 255, 255))
    image.drawCircle(
      new cv.Point2(image.sizes[1] / 2, image.sizes[0] / 2),
      180,
      new cv.Vec3(0, 255, 255),
      2,
      cv.LINE_AA
    )
    const { maxLoc } = mask0.minMaxLoc()
    let detected = false
    if (maxLoc.x !== 0 && maxLoc.y !== 0) {
      detected = true
      image.drawCircle(new cv.Point2(maxLoc.x, maxLoc.y), 10, new cv.Vec3(0, 255, 0), 2, cv.LINE_AA)

      image.drawCircle(
        new cv.Point2(
          maxLoc.x,
          maxLoc.y - (180 / Number(size)) * (distance === 25 ? 23.5 : distance === 20 ? 20 : 10)
        ),
        10,
        new cv.Vec3(255, 0, 0),
        2,
        cv.LINE_AA
      )
    }
    const result = cv.imencode('.jpg', image).toString('base64')
    return {
      result,
      detected
    }
  }
  calibImage(imageBase64) {
    const base64data = imageBase64
      .replace('data:image/jpeg;base64', '')
      .replace('data:image/png;base64', '')
    const image = cv.imdecode(Buffer.from(base64data, 'base64'))
    image.drawCircle(
      new cv.Point2(image.sizes[1] / 2, image.sizes[0] / 2),
      180,
      new cv.Vec3(0, 255, 255),
      2,
      cv.LINE_AA
    )

    const result = cv.imencode('.jpg', image).toString('base64')
    return result
  }
}
