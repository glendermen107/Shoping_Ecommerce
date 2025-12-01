import {
    Controller,
    Post,
    Get,
    Delete,
    Query,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    InternalServerErrorException,
    UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/models/roles.model';

@Controller('media')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class MediaController {
    constructor(private readonly mediaService: MediaService) { }

    /**
     * Upload an image file to MinIO
     * POST /media/upload
     */
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async upload(
        @UploadedFile() file: Express.Multer.File,
    ): Promise<{ url: string }> {
        try {
            if (!file) {
                throw new BadRequestException('No file provided');
            }

            // Validate file size (5MB max)
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (file.size > maxSize) {
                throw new BadRequestException('File size exceeds 5MB limit');
            }

            return await this.mediaService.upload(file);
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to upload file');
        }
    }

    /**
     * Get list of all uploaded images
     * GET /media/list
     */
    @Get('list')
    async list(): Promise<string[]> {
        try {
            return await this.mediaService.list();
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch image list');
        }
    }

    /**
     * Delete an image from storage
     * DELETE /media?file=<url>
     */
    @Delete()
    async delete(@Query('file') fileUrl: string): Promise<{ success: boolean }> {
        try {
            if (!fileUrl) {
                throw new BadRequestException('File URL is required');
            }

            await this.mediaService.delete(fileUrl);
            return { success: true };
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to delete file');
        }
    }
}
