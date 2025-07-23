import { PrismaService } from '../prisma/prisma.service';
export interface UploadResult {
    id: string;
    filename: string;
    originalName: string;
    url: string;
    size: number;
    mimeType: string;
    path: string;
}
export declare class UploadsService {
    private prisma;
    private readonly uploadDir;
    private readonly baseUrl;
    private readonly allowedImageTypes;
    private readonly maxFileSize;
    constructor(prisma: PrismaService);
    private ensureUploadDirectories;
    uploadFile(file: Express.Multer.File, folder?: string, userId?: string): Promise<UploadResult>;
    uploadMultipleFiles(files: Express.Multer.File[], folder?: string, userId?: string): Promise<UploadResult[]>;
    getUploadById(id: string): Promise<any>;
    getUploads(page?: number, limit?: number, folder?: string, search?: string): Promise<{
        uploads: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    deleteUpload(id: string): Promise<{
        message: string;
    }>;
    updateUpload(id: string, data: {
        folder?: string;
        isPublic?: boolean;
    }): Promise<any>;
    private validateFile;
    getFileExtension(mimetype: string): string;
    generateOptimizedFilename(originalName: string, prefix?: string): string;
}
