import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface UploadResult {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  size: number;
  mimeType: string;
  path: string;
}

@Injectable()
export class UploadsService {
  private readonly uploadDir = 'uploads';
  private readonly baseUrl = process.env.BASE_URL || 'http://localhost:3001';
  
  // Allowed image types
  private readonly allowedImageTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/gif'
  ];

  // Max file size: 5MB
  private readonly maxFileSize = 5 * 1024 * 1024;

  constructor(private prisma: PrismaService) {
    this.ensureUploadDirectories();
  }

  private async ensureUploadDirectories() {
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
      } catch {
        await fs.mkdir(dir, { recursive: true });
      }
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'temp',
    userId?: string
  ): Promise<UploadResult> {
    // Validate file
    this.validateFile(file);

    // Generate unique filename
    const fileExtension = path.extname(file.originalname);
    const filename = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(this.uploadDir, folder, filename);
    const url = `${this.baseUrl}/${this.uploadDir}/${folder}/${filename}`;

    try {
      // Ensure folder exists
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      
      // Save file to disk
      await fs.writeFile(filePath, file.buffer);

      // Save file info to database
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
    } catch (error) {
      // Clean up file if database save fails
      try {
        await fs.unlink(filePath);
      } catch (unlinkError) {
        console.error('Failed to clean up file:', unlinkError);
      }
      throw new BadRequestException('Failed to upload file');
    }
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    folder: string = 'temp',
    userId?: string
  ): Promise<UploadResult[]> {
    const results = [];
    
    for (const file of files) {
      const result = await this.uploadFile(file, folder, userId);
      results.push(result);
    }
    
    return results;
  }

  async getUploadById(id: string) {
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
      throw new NotFoundException('Upload not found');
    }

    return upload;
  }

  async getUploads(
    page: number = 1,
    limit: number = 20,
    folder?: string,
    search?: string
  ) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
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

  async deleteUpload(id: string) {
    const upload = await this.getUploadById(id);
    
    try {
      // Delete file from disk
      await fs.unlink(upload.path);
    } catch (error) {
      console.error('Failed to delete file from disk:', error);
      // Continue with database deletion even if file deletion fails
    }

    // Delete from database
    await this.prisma.upload.delete({
      where: { id },
    });

    return { message: 'Upload deleted successfully' };
  }

  async updateUpload(id: string, data: { folder?: string; isPublic?: boolean }) {
    const upload = await this.getUploadById(id);

    // If moving to different folder, move the physical file
    if (data.folder && data.folder !== upload.folder) {
      const oldPath = upload.path;
      const newPath = path.join(this.uploadDir, data.folder, upload.filename);
      const newUrl = `${this.baseUrl}/${this.uploadDir}/${data.folder}/${upload.filename}`;

      try {
        // Ensure new folder exists
        await fs.mkdir(path.dirname(newPath), { recursive: true });
        
        // Move file
        await fs.rename(oldPath, newPath);
        
        // Update database with new path and URL
        return await this.prisma.upload.update({
          where: { id },
          data: {
            ...data,
            path: newPath,
            url: newUrl,
          },
        });
      } catch (error) {
        throw new BadRequestException('Failed to move file');
      }
    }

    // Just update database fields
    return await this.prisma.upload.update({
      where: { id },
      data,
    });
  }

  private validateFile(file: Express.Multer.File) {
    // Check file size
    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File size too large. Maximum size is ${this.maxFileSize / (1024 * 1024)}MB`
      );
    }

    // Check file type for images
    if (!this.allowedImageTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${this.allowedImageTypes.join(', ')}`
      );
    }

    // Check if file has content
    if (!file.buffer || file.buffer.length === 0) {
      throw new BadRequestException('File is empty');
    }
  }

  // Helper method to get file extension from mimetype
  getFileExtension(mimetype: string): string {
    const mimeToExt: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'image/gif': '.gif',
    };
    
    return mimeToExt[mimetype] || '.jpg';
  }

  // Helper method to generate optimized filename
  generateOptimizedFilename(originalName: string, prefix?: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const ext = path.extname(originalName);
    const baseName = prefix || 'file';
    
    return `${baseName}_${timestamp}_${random}${ext}`;
  }
}
