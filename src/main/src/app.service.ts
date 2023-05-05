import { Injectable } from '@nestjs/common'
import * as cv from '@u4/opencv4nodejs'
import { ElectronService } from './electron/electron.service'
@Injectable()
export class AppService {
  constructor(private electronService: ElectronService) {}
  getHello(): string {
    return 'Hello World!'
  }
  detectSpot(imageBase64: string): string {
    const base64data = imageBase64
      .replace('data:image/jpeg;base64', '')
      .replace('data:image/png;base64', '')
    const image = cv.imdecode(Buffer.from(base64data, 'base64'))
    const hsvImage = image.cvtColor(cv.COLOR_BGR2HSV)
    const mask0 = hsvImage.inRange(new cv.Vec3(179, 50, 50), new cv.Vec3(180, 255, 255))

    const { maxLoc } = mask0.minMaxLoc()
    image.drawCircle(new cv.Point2(maxLoc.x, maxLoc.y), 20, new cv.Vec3(0, 255, 0), 2, cv.LINE_AA)
    const result = cv.imencode('.jpg', image).toString('base64')
    this.electronService.send('signal', 'start')
    return result
  }
}
