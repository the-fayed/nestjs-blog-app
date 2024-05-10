import { HttpException } from '@nestjs/common';

export class NoContentException extends HttpException {
  constructor() {
    super('No content', 204);
  }
}
