import { v2 as cloudinary } from 'cloudinary';
import { Injectable } from '@nestjs/common';
import * as streamifier from 'streamifier';

import { ICloudinaryResponse } from './cloudinary.interfaces';

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<ICloudinaryResponse> {
    return new Promise<ICloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteImage(publicId: string): Promise<ICloudinaryResponse> {
    return new Promise<ICloudinaryResponse>((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) reject(error);
        resolve(result);
      });
    });
  }
}
