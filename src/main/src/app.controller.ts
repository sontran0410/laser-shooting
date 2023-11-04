import { Controller } from '@nestjs/common'
import { AppService } from './app.service'
import { HandleIPCMessageWithResult } from 'nestjs-electron-ipc-transport'
import { Payload } from '@nestjs/microservices'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @HandleIPCMessageWithResult('app.hello')
  getHello(): string {
    return 'hello'
  }
  @HandleIPCMessageWithResult('app.detect')
  detectSpot(@Payload() payload: { imageBase64: string; size: number; distance: number }) {
    return this.appService.detectSpot(payload)
  }
  @HandleIPCMessageWithResult('app.calib')
  calibImage(
    @Payload()
    payload: {
      imageBase64: string
      // range: {
      //   lower: [number, number, number]
      //   upper: [number, number, number]
      // }
    }
  ) {
    return this.appService.calibImage(payload.imageBase64)
  }
}
