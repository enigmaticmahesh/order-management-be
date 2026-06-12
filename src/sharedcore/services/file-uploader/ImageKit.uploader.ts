import { ConfigService } from '@nestjs/config';
import ImageKit from '@imagekit/nodejs';
// import { IFileUploader } from './FileUploader';
import {
  IFileUploader,
  ImageKitSignedURLObject,
} from './file-uploader.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ImageKitUploader implements IFileUploader {
  private publicKey: string;
  private client: ImageKit;

  constructor(private readonly configService: ConfigService) {
    /*
        1. Added "!" as we are validating the keys before starting the app
        2. If the key is not present in the environment, the app will not start
    */
    this.publicKey = this.configService.get('IMAGEKIT_PUBLIC_KEY')!;
    this.client = new ImageKit({
      privateKey: this.configService.get('IMAGEKIT_PRIVATE_KEY')!,
    });
  }

  generateSignedURLs<ImageKitSignedUrlsResult>(urlCount: number = 1) {
    const urls: ImageKitSignedURLObject[] = [];
    for (let i = 0; i < urlCount; i++) {
      const url = this.client.helper.getAuthenticationParameters();
      urls.push(url);
    }
    return { urls, pubKey: this.publicKey } as ImageKitSignedUrlsResult;
  }

  async filesCountOfFolder<ImageKitFiles>(
    folderPath: string,
  ): Promise<ImageKitFiles[]> {
    const res = await this.client.assets.list({
      fileType: 'image',
      limit: 6,
      path: folderPath,
      type: 'file',
    });
    return res.map((file: any) => ({
      name: file.name,
      url: file.url,
      thumbnail: file.thumbnail,
      fileId: file.fileId,
    })) as ImageKitFiles[];
  }

  async deleteFiles(fileIds: string[]): Promise<any> {
    return await this.client.files.bulk.delete({
      fileIds,
    });
  }

  async deleteFolder(folderPath: string): Promise<any> {
    return await this.client.folders.delete({
      folderPath,
    });
  }
}
