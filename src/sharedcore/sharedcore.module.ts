import { Global, Module } from '@nestjs/common';
import ImageKitService from './services/file-uploader/ImageKit.service';

@Global()
@Module({
  providers: [ImageKitService],
  exports: [ImageKitService],
})
export class SharedCoreModule {}
