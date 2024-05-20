import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File) {
    const kb = 1024;
    return value.size < kb;
  }
}
