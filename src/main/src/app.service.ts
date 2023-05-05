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
    const grayImage = image.bgrToGray()

    const result = cv.imencode('.jpg', grayImage).toString('base64')
    this.electronService.send('signal', 'start')
    return result
  }
}
