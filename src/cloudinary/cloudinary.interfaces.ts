import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

export type ICloudinaryResponse = UploadApiErrorResponse | UploadApiResponse;
