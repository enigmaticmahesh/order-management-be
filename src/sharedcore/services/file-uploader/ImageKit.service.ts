import { Injectable } from '@nestjs/common';
import FileUploader from './FileUploader';
import { ConfigService } from '@nestjs/config';
import ImageKit from '@imagekit/nodejs';

type ImageKitSignedURLObject = {
  token: string;
  expire: number;
  signature: string;
};

@Injectable()
export default class ImageKitService extends FileUploader {
  private publicKey: string;
  private client: ImageKit;

  constructor(private readonly configService: ConfigService) {
    super();
    /*
        1. Added "!" as we are validating the keys before starting the app
        2. If the key is not present in the environment, the app will not start
    */
    this.publicKey = this.configService.get('IMAGEKIT_PUBLIC_KEY')!;
    this.client = new ImageKit({
      privateKey: this.configService.get('IMAGEKIT_PRIVATE_KEY')!,
    });
  }

  generateSignedURLs(urlCount: number = 1): {
    urls: ImageKitSignedURLObject[];
    pubKey: string;
  } {
    const urls: ImageKitSignedURLObject[] = [];
    for (let i = 0; i < urlCount; i++) {
      const url = this.client.helper.getAuthenticationParameters();
      urls.push(url);
    }
    return { urls, pubKey: this.publicKey };
  }

  async filesCountOfFolder(folderPath: string): Promise<any[]> {
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
    }));
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
