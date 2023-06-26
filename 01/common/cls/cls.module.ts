import { DynamicModule, Global, Module } from '@nestjs/common';

import { ClsService } from './cls.service';

@Global()
@Module({})
export class ClsModule {
  private static $clsServiceInstance;
  static forRoot(): DynamicModule {
    return {
      module: ClsModule,
      providers: [
        {
          provide: ClsService,
          useFactory: () => ClsModule.getClsService(),
        },
      ],
      exports: [ClsService],
    };
  }
  static run(fn: () => void): void {
    new ClsService().run(fn);
  }
  static getClsService(): ClsService {
    if (!ClsModule.$clsServiceInstance) {
      ClsModule.$clsServiceInstance = new ClsService();
    }
    return ClsModule.$clsServiceInstance;
  }
}
