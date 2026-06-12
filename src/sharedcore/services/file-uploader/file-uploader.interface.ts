export type ImageKitSignedURLObject = {
  token: string;
  expire: number;
  signature: string;
};

export type ImageKitSignedUrlsResult = {
  urls: ImageKitSignedURLObject[];
  pubKey: string;
};

export type ImageKitFiles = {
  name: string;
  url: string;
  thumbnail: string;
  fileId: string;
};

export type UploadProviderName = 'imagekit' | 'awsS3';

export interface IFileUploader {
  generateSignedURLs<T>(urlCount: number): T;
  filesCountOfFolder<T>(folderPath: string): Promise<T[]>;
  deleteFiles(fileIds: string[]): Promise<any>;
  deleteFolder(folderPath: string): Promise<any>;
}
