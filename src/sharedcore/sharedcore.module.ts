import { Global, Module } from '@nestjs/common';
import { FileUploaderService } from './services/file-uploader/FileUploader.service';
import { ImageKitUploader } from './services/file-uploader/ImageKit.uploader';

@Global()
@Module({
  providers: [FileUploaderService, ImageKitUploader],
  exports: [FileUploaderService],
})
export class SharedCoreModule {}
