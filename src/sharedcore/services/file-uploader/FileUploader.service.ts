import { Injectable } from '@nestjs/common';
import { UploadProviderName } from './file-uploader.interface';
import { ImageKitUploader } from './ImageKit.uploader';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class FileUploaderService {
  private uploaderRegistry = new Map<UploadProviderName, any>();

  constructor(private readonly moduleRef: ModuleRef) {
    this.uploaderRegistry.set('imagekit', ImageKitUploader);
  }

  getUploader(uploaderName: UploadProviderName) {
    const uploader = this.uploaderRegistry.get(uploaderName);
    if (!uploader) {
      throw new Error(`Upload provider [${uploaderName}] is not registered.`);
    }
    return this.moduleRef.get(uploader, { strict: false });
  }
}
