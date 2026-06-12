import { Injectable, OnModuleInit } from '@nestjs/common';
import { IFileUploader, UploadProviderName } from './file-uploader.interface';
import { ImageKitUploader } from './ImageKit.uploader';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class FileUploaderService implements IFileUploader, OnModuleInit {
  private uploaderRegistry = new Map<UploadProviderName, any>();
  private activeUploader!: IFileUploader;

  constructor(private readonly moduleRef: ModuleRef) {
    this.uploaderRegistry.set('imagekit', ImageKitUploader);
  }

  onModuleInit() {
    // You can change the provider as per your choice here
    const uploaderName: UploadProviderName = 'imagekit';
    const uploader = this.uploaderRegistry.get(uploaderName);
    if (!uploader) {
      throw new Error(`Upload provider [${uploaderName}] is not registered.`);
    }
    this.activeUploader = this.moduleRef.get(uploader, { strict: false });
  }

  generateSignedURLs<T>(urlCount: number = 1): T {
    return this.activeUploader.generateSignedURLs(urlCount);
  }

  async filesCountOfFolder<T>(folderPath: string): Promise<T[]> {
    return this.activeUploader.filesCountOfFolder(folderPath);
  }

  async deleteFiles(fileIds: string[]): Promise<any> {
    return this.activeUploader.deleteFiles(fileIds);
  }

  async deleteFolder(folderPath: string): Promise<any> {
    return this.activeUploader.deleteFolder(folderPath);
  }
}
