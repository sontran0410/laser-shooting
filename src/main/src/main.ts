import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
// import { createElectronApp } from './electron'
import { MicroserviceOptions } from '@nestjs/microservices'
import { ElectronIPCTransport } from 'nestjs-electron-ipc-transport'
async function bootstrap() {
  // await createElectronApp()
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    strategy: new ElectronIPCTransport()
  })
  await app.listen()
}
bootstrap()
