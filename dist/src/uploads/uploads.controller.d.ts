import { UploadsService } from './uploads.service';
export declare class UploadsController {
    private readonly uploadsService;
    constructor(uploadsService: UploadsService);
    uploadSingle(file: Express.Multer.File, folder: string, req: any): Promise<import("./uploads.service").UploadResult>;
    uploadMultiple(files: Express.Multer.File[], folder: string, req: any): Promise<import("./uploads.service").UploadResult[]>;
    uploadEventImage(file: Express.Multer.File, req: any): Promise<import("./uploads.service").UploadResult>;
    uploadPostCover(file: Express.Multer.File, req: any): Promise<import("./uploads.service").UploadResult>;
    uploadUserAvatar(file: Express.Multer.File, req: any): Promise<import("./uploads.service").UploadResult>;
    uploadProductImages(files: Express.Multer.File[], req: any): Promise<import("./uploads.service").UploadResult[]>;
    uploadGalleryImages(files: Express.Multer.File[], req: any): Promise<import("./uploads.service").UploadResult[]>;
    getUploads(page?: string, limit?: string, folder?: string, search?: string): Promise<{
        uploads: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    getUpload(id: string): Promise<any>;
    updateUpload(id: string, folder?: string, isPublic?: string): Promise<any>;
    deleteUpload(id: string): Promise<{
        message: string;
    }>;
}
