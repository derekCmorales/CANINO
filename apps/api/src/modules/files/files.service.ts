import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilesService {
  private readonly uploadDir: string;

  constructor(private readonly configService: ConfigService) {
    this.uploadDir = this.configService.get<string>('UPLOAD_DIR', './uploads');
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  saveUploadedFile(file: Express.Multer.File, subfolder = 'general') {
    if (!file) {
      throw new BadRequestException('No se recibió ningún archivo');
    }

    const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf'];
    const ext = extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      throw new BadRequestException('Tipo de archivo no permitido');
    }

    const folder = join(this.uploadDir, subfolder);
    if (!existsSync(folder)) {
      mkdirSync(folder, { recursive: true });
    }

    const filename = `${uuidv4()}${ext}`;
    const destination = join(folder, filename);

    writeFileSync(destination, file.buffer);

    return {
      filename,
      path: `/uploads/${subfolder}/${filename}`,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
    };
  }

  getFilePath(filename: string) {
    const candidates = ['general', 'photos', 'memories', 'docs', 'avatars'];
    for (const folder of candidates) {
      const fullPath = join(this.uploadDir, folder, filename);
      if (existsSync(fullPath)) {
        return fullPath;
      }
    }

    const directPath = join(this.uploadDir, filename);
    if (existsSync(directPath)) {
      return directPath;
    }

    throw new NotFoundException('Archivo no encontrado');
  }
}
