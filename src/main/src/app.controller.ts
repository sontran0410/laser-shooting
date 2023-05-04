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
  detectSpot(@Payload() imageBase64: string) {
    return this.appService.detectSpot(imageBase64)
  }
}
