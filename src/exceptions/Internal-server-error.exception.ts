import { HttpException } from '@nestjs/common';

export class InternalSeverErrorException extends HttpException {
  constructor() {
    super('Internal server error', 500);
  }
}
