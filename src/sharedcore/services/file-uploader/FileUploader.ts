// // 1. The Native Abstract Class
// abstract class FileUploader {
//   // You can define common properties that all uploaders share
//   protected allowedExtensions: string[] = ['.pdf', '.jpg', '.png'];

//   // The contract method that child classes MUST build
//   abstract upload(filePath: string, destination: string): Promise<boolean>;

//   // A regular concrete method that child classes inherit automatically
//   validateFile(filePath: string): boolean {
//     console.log(`Checking format for: ${filePath}`);
//     return this.allowedExtensions.some(ext => filePath.endsWith(ext));
//   }
// }

// // 2. Google Drive Custom Implementation
// class GDriveUploader extends FileUploader {
//   private apiKey: string;

//   constructor(apiKey: string) {
//     super(); // Required in TypeScript
//     this.apiKey = apiKey;
//   }

//   // TypeScript enforces the exact parameter types and return type
//   async upload(filePath: string, destination: string): Promise<boolean> {
//     if (!this.validateFile(filePath)) {
//       throw new Error("Invalid file format.");
//     }
//     console.log(`GDrive API: Uploading ${filePath} using key ${this.apiKey.slice(0, 4)}...`);
//     return true;
//   }
// }

// // 3. OneDrive Custom Implementation
// class OneDriveUploader extends FileUploader {
//   private tenantId: string;

//   constructor(tenantId: string) {
//     super();
//     this.tenantId = tenantId;
//   }

//   async upload(filePath: string, destination: string): Promise<boolean> {
//     console.log(`OneDrive API: Syncing ${filePath} to tenant ${this.tenantId}...`);
//     return true;
//   }
// }

// ============== Usage ===============

// // Your main application code uses the base class as the Type
// async function processDocument(uploader: FileUploader, file: string) {
//   const success = await uploader.upload(file, "/documents");
//   if (success) console.log("Done!\n");
// }

// // Instantiate and pass instances
// const gDrive = new GDriveUploader("AIzaSy123");
// processDocument(gDrive, "resume.pdf");

// const oneDrive = new OneDriveUploader("tenant-xyz");
// processDocument(oneDrive, "report.pdf");
export default abstract class FileUploader {
  abstract generateSignedURLs(urlCount: number): any;
  abstract filesCountOfFolder(
    folderPath: string,
  ): Promise<{ name: string | undefined }[]>;
}
