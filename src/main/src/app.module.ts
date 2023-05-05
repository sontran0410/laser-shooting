import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ElectronModule } from './electron/electron.module'

@Module({
  imports: [ElectronModule.forRootAsync()],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
