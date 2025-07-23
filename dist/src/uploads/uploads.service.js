"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const fs = require("fs/promises");
const path = require("path");
const uuid_1 = require("uuid");
let UploadsService = class UploadsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.uploadDir = 'uploads';
        this.baseUrl = process.env.BASE_URL || 'http://localhost:3001';
        this.allowedImageTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp',
            'image/gif'
        ];
        this.maxFileSize = 5 * 1024 * 1024;
        this.ensureUploadDirectories();
    }
    async ensureUploadDirectories() {
        const directories = [
            'uploads',
            'uploads/events',
            'uploads/posts',
            'uploads/users',
            'uploads/products',
            'uploads/gallery',
            'uploads/temp'
        ];
        for (const dir of directories) {
            try {
                await fs.access(dir);
            }
            catch {
                await fs.mkdir(dir, { recursive: true });
            }
        }
    }
    async uploadFile(file, folder = 'temp', userId) {
        this.validateFile(file);
        const fileExtension = path.extname(file.originalname);
        const filename = `${(0, uuid_1.v4)()}${fileExtension}`;
        const filePath = path.join(this.uploadDir, folder, filename);
        const url = `${this.baseUrl}/${this.uploadDir}/${folder}/${filename}`;
        try {
            await fs.mkdir(path.dirname(filePath), { recursive: true });
            await fs.writeFile(filePath, file.buffer);
            const upload = await this.prisma.upload.create({
                data: {
                    filename,
                    originalName: file.originalname,
                    url,
                    size: file.size,
                    mimeType: file.mimetype,
                    path: filePath,
                    folder,
                    isPublic: true,
                    uploadedById: userId,
                },
            });
            return {
                id: upload.id,
                filename: upload.filename,
                originalName: upload.originalName,
                url: upload.url,
                size: upload.size,
                mimeType: upload.mimeType,
                path: upload.path,
            };
        }
        catch (error) {
            try {
                await fs.unlink(filePath);
            }
            catch (unlinkError) {
                console.error('Failed to clean up file:', unlinkError);
            }
            throw new common_1.BadRequestException('Failed to upload file');
        }
    }
    async uploadMultipleFiles(files, folder = 'temp', userId) {
        const results = [];
        for (const file of files) {
            const result = await this.uploadFile(file, folder, userId);
            results.push(result);
        }
        return results;
    }
    async getUploadById(id) {
        const upload = await this.prisma.upload.findUnique({
            where: { id },
            include: {
                uploadedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        if (!upload) {
            throw new common_1.NotFoundException('Upload not found');
        }
        return upload;
    }
    async getUploads(page = 1, limit = 20, folder, search) {
        const skip = (page - 1) * limit;
        const where = {};
        if (folder) {
            where.folder = folder;
        }
        if (search) {
            where.OR = [
                { originalName: { contains: search, mode: 'insensitive' } },
                { filename: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [uploads, total] = await Promise.all([
            this.prisma.upload.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    uploadedBy: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            }),
            this.prisma.upload.count({ where }),
        ]);
        return {
            uploads,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async deleteUpload(id) {
        const upload = await this.getUploadById(id);
        try {
            await fs.unlink(upload.path);
        }
        catch (error) {
            console.error('Failed to delete file from disk:', error);
        }
        await this.prisma.upload.delete({
            where: { id },
        });
        return { message: 'Upload deleted successfully' };
    }
    async updateUpload(id, data) {
        const upload = await this.getUploadById(id);
        if (data.folder && data.folder !== upload.folder) {
            const oldPath = upload.path;
            const newPath = path.join(this.uploadDir, data.folder, upload.filename);
            const newUrl = `${this.baseUrl}/${this.uploadDir}/${data.folder}/${upload.filename}`;
            try {
                await fs.mkdir(path.dirname(newPath), { recursive: true });
                await fs.rename(oldPath, newPath);
                return await this.prisma.upload.update({
                    where: { id },
                    data: {
                        ...data,
                        path: newPath,
                        url: newUrl,
                    },
                });
            }
            catch (error) {
                throw new common_1.BadRequestException('Failed to move file');
            }
        }
        return await this.prisma.upload.update({
            where: { id },
            data,
        });
    }
    validateFile(file) {
        if (file.size > this.maxFileSize) {
            throw new common_1.BadRequestException(`File size too large. Maximum size is ${this.maxFileSize / (1024 * 1024)}MB`);
        }
        if (!this.allowedImageTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException(`Invalid file type. Allowed types: ${this.allowedImageTypes.join(', ')}`);
        }
        if (!file.buffer || file.buffer.length === 0) {
            throw new common_1.BadRequestException('File is empty');
        }
    }
    getFileExtension(mimetype) {
        const mimeToExt = {
            'image/jpeg': '.jpg',
            'image/jpg': '.jpg',
            'image/png': '.png',
            'image/webp': '.webp',
            'image/gif': '.gif',
        };
        return mimeToExt[mimetype] || '.jpg';
    }
    generateOptimizedFilename(originalName, prefix) {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        const ext = path.extname(originalName);
        const baseName = prefix || 'file';
        return `${baseName}_${timestamp}_${random}${ext}`;
    }
};
exports.UploadsService = UploadsService;
exports.UploadsService = UploadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UploadsService);
//# sourceMappingURL=uploads.service.js.map