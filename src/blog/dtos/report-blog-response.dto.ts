import { Expose } from 'class-transformer';

import { IReportBlogResponse } from '../blog.interface';

export class ReportBlogResponseDto implements IReportBlogResponse {
  @Expose()
  status: 'success' | 'error';

  @Expose()
  message: string;
}
