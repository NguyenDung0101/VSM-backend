import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import {
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { memoryStorage } from 'multer';

@ApiTags('uploads')
@Controller('uploads')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('single')
  @ApiOperation({ summary: 'Upload a single file' })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, callback) => {
        // Allow only image files
        if (!file.mimetype.startsWith('image/')) {
          return callback(new BadRequestException('Only image files are allowed'), false);
        }
        callback(null, true);
      },
    })
  )
  async uploadSingle(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder: string = 'temp',
    @Request() req: any
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    return await this.uploadsService.uploadFile(file, folder, req.user.sub);
  }

  @Post('multiple')
  @ApiOperation({ summary: 'Upload multiple files' })
  @ApiResponse({ status: 201, description: 'Files uploaded successfully' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB per file
      },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          return callback(new BadRequestException('Only image files are allowed'), false);
        }
        callback(null, true);
      },
    })
  )
  async uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder: string = 'temp',
    @Request() req: any
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    return await this.uploadsService.uploadMultipleFiles(files, folder, req.user.sub);
  }

  @Post('event-image')
  @ApiOperation({ summary: 'Upload event image' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          return callback(new BadRequestException('Only image files are allowed'), false);
        }
        callback(null, true);
      },
    })
  )
  async uploadEventImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any
  ) {
    if (!file) {
      throw new BadRequestException('No image provided');
    }

    return await this.uploadsService.uploadFile(file, 'events', req.user.sub);
  }

  @Post('post-cover')
  @ApiOperation({ summary: 'Upload post cover image' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          return callback(new BadRequestException('Only image files are allowed'), false);
        }
        callback(null, true);
      },
    })
  )
  async uploadPostCover(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any
  ) {
    if (!file) {
      throw new BadRequestException('No cover image provided');
    }

    return await this.uploadsService.uploadFile(file, 'posts', req.user.sub);
  }

  @Post('user-avatar')
  @ApiOperation({ summary: 'Upload user avatar' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: memoryStorage(),
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB for avatars
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          return callback(new BadRequestException('Only image files are allowed'), false);
        }
        callback(null, true);
      },
    })
  )
  async uploadUserAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any
  ) {
    if (!file) {
      throw new BadRequestException('No avatar provided');
    }

    return await this.uploadsService.uploadFile(file, 'users', req.user.sub);
  }

  @Post('product-images')
  @ApiOperation({ summary: 'Upload product images' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          return callback(new BadRequestException('Only image files are allowed'), false);
        }
        callback(null, true);
      },
    })
  )
  async uploadProductImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req: any
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No images provided');
    }

    return await this.uploadsService.uploadMultipleFiles(files, 'products', req.user.sub);
  }

  @Post('gallery')
  @ApiOperation({ summary: 'Upload gallery images' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          return callback(new BadRequestException('Only image files are allowed'), false);
        }
        callback(null, true);
      },
    })
  )
  async uploadGalleryImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req: any
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No images provided');
    }

    return await this.uploadsService.uploadMultipleFiles(files, 'gallery', req.user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all uploads with pagination' })
  @ApiResponse({ status: 200, description: 'Uploads retrieved successfully' })
  async getUploads(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('folder') folder?: string,
    @Query('search') search?: string
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    return await this.uploadsService.getUploads(pageNum, limitNum, folder, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get upload by ID' })
  @ApiResponse({ status: 200, description: 'Upload retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Upload not found' })
  async getUpload(@Param('id') id: string) {
    return await this.uploadsService.getUploadById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update upload metadata' })
  @ApiResponse({ status: 200, description: 'Upload updated successfully' })
  @ApiResponse({ status: 404, description: 'Upload not found' })
  async updateUpload(
    @Param('id') id: string,
    @Query('folder') folder?: string,
    @Query('isPublic') isPublic?: string
  ) {
    const updateData: any = {};
    
    if (folder) updateData.folder = folder;
    if (isPublic !== undefined) updateData.isPublic = isPublic === 'true';

    return await this.uploadsService.updateUpload(id, updateData);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.EDITOR)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete upload (Admin/Editor only)' })
  @ApiResponse({ status: 200, description: 'Upload deleted successfully' })
  @ApiResponse({ status: 404, description: 'Upload not found' })
  async deleteUpload(@Param('id') id: string) {
    return await this.uploadsService.deleteUpload(id);
  }
}
