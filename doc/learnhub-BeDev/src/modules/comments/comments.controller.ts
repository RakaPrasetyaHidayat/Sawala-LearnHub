import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { CreateCommentDto } from './dto/comment.dto';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('posts/:postId')
  createPostComment(
    @Param('postId') postId: string,
    @GetUser('id') userId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.createComment(postId, userId, createCommentDto);
  }

  @Get('posts/:postId')
  getPostComments(@Param('postId') postId: string) {
    return this.commentsService.getPostComments(postId);
  }

  @Post('tasks/:taskId')
  createTaskComment(
    @Param('taskId') taskId: string,
    @GetUser('id') userId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.createTaskComment(taskId, userId, createCommentDto);
  }

  @Get('tasks/:taskId')
  getTaskComments(@Param('taskId') taskId: string) {
    return this.commentsService.getTaskComments(taskId);
  }
}
