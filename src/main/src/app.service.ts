import { Injectable } from '@nestjs/common'
import * as cv from '@u4/opencv4nodejs'

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!'
  }
  detectSpot(imageBase64: string): string {
    const base64data = imageBase64
      .replace('data:image/jpeg;base64', '')
      .replace('data:image/png;base64', '')
    const image = cv.imdecode(Buffer.from(base64data, 'base64'))

    const result = cv.imencode('.jpg', image).toString('base64')
    return result
  }
}
