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
    distance,
    range,
    zAngle
  }: {
    imageBase64: string
    size: number
    distance: number
    range?: {
      lower: [number, number, number]
      upper: [number, number, number]
    }
    zAngle: number
  }) {
    const base64data = imageBase64
      .replace('data:image/jpeg;base64', '')
      .replace('data:image/png;base64', '')
    const image = cv.imdecode(Buffer.from(base64data, 'base64'))
    const hsvImage = image.cvtColor(cv.COLOR_BGR2HSV)
    const mask0 = hsvImage.inRange(
      new cv.Vec3(...(range?.lower ?? [120, 100, 50])),
      new cv.Vec3(...(range?.upper ?? [174, 255, 255]))
    )
    image.drawEllipse(
      new cv.Point2(image.sizes[1] / 2, image.sizes[0] / 2),
      new cv.Size(180, Math.cos((zAngle * Math.PI) / 180) * 180),
      0,
      0,
      360,
      new cv.Vec3(0, 255, 255),
      2,
      cv.LINE_AA
    )
    const { maxLoc } = mask0.minMaxLoc()
    let detected = false
    const deltaX = image.sizes[1] / 2
    const deltaY = image.sizes[0] / 2
    if (
      maxLoc.x !== 0 &&
      maxLoc.y !== 0 &&
      Math.sqrt(Math.pow(maxLoc.x - deltaX, 2) + Math.pow(maxLoc.y - deltaY, 2)) < 180
    ) {
      detected = true
      image.drawCircle(new cv.Point2(maxLoc.x, maxLoc.y), 10, new cv.Vec3(0, 255, 0), 2, cv.LINE_AA)

      image.drawCircle(
        new cv.Point2(
          maxLoc.x,
          maxLoc.y -
            ((180 / Number(size)) * (distance === 25 ? 23.5 : distance === 20 ? 20 : 10)) /
              Math.cos((zAngle * Math.PI) / 180)
        ),
        10,
        new cv.Vec3(255, 0, 0),
        2,
        cv.LINE_AA
      )
    }

    const result = cv.imencode('.jpg', image.flip(1)).toString('base64')
    return {
      result,
      detected
    }
  }
  calibImage(
    { imageBase64, zAngle }: { imageBase64: string; zAngle: number } // range: { //   lower: [number, number, number] //   upper: [number, number, number] // }
  ) {
    const base64data = imageBase64
      .replace('data:image/jpeg;base64', '')
      .replace('data:image/png;base64', '')
    const image = cv.imdecode(Buffer.from(base64data, 'base64'))

    image.drawEllipse(
      new cv.Point2(image.sizes[1] / 2, image.sizes[0] / 2),
      new cv.Size(180, Math.cos((zAngle * Math.PI) / 180) * 180),
      0,
      0,
      360,
      new cv.Vec3(0, 255, 255),
      2,
      cv.LINE_AA
    )

    // const result = cv.imencode('.jpg', image).toString('base64')
    // const hsvImage = image.cvtColor(cv.COLOR_BGR2HSV)
    // const mask0 = hsvImage.inRange(new cv.Vec3(...range.lower), new cv.Vec3(...range.upper))
    const result = cv.imencode('.jpg', image.flip(1)).toString('base64')
    return result
  }
}
