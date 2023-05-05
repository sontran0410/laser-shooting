import { DynamicModule, Module } from '@nestjs/common'
import { ElectronService } from './electron.service'
import { app } from 'electron'

@Module({})
export class ElectronModule {
  static async forRootAsync(): Promise<DynamicModule> {
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })
    await app.whenReady()
    return {
      module: ElectronModule,
      providers: [ElectronService],
      exports: [ElectronService]
    }
  }
}
