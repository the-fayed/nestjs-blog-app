import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { BlogService } from '../blog/blog.service';
import { IUser } from '../user';

@Injectable()
export class IsPermitted implements CanActivate {
  constructor(private readonly blogService: BlogService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user: IUser = request.user;

    const blogId: number = Number(request.params.id);

    const blog = await this.blogService.findById(blogId);

    if (blog.author.id === user.id || user.role === 'admin') {
      return true;
    }
  }
}
