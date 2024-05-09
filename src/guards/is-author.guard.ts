import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { BlogService } from '../blog/blog.service';
import { UserService } from '../user';

@Injectable()
export class IsAuthorGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly blogService: BlogService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const blogId: number = Number(request.params.id);
    const user = request.user;

    const blog = await this.blogService.findById(blogId);
    if (blog.author.id === user.id) {
      return true;
    }
  }
}
