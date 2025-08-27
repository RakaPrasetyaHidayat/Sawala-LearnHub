import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto, CreatePostCommentDto, FilterPostsDto } from './dto/post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
    @GetUser('id') userId: string
  ) {
    return this.postsService.create(createPostDto, userId);
  }

  @Get()
  findAll(@Query() filterDto: FilterPostsDto) {
    return this.postsService.findAll(filterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @GetUser('id') userId: string
  ) {
    return this.postsService.update(id, updatePostDto, userId);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @GetUser('id') userId: string
  ) {
    return this.postsService.remove(id, userId);
  }

  @Post(':id/comments')
  addComment(
    @Param('id') postId: string,
    @Body() commentDto: CreatePostCommentDto,
    @GetUser('id') userId: string
  ) {
    return this.postsService.addComment(postId, userId, commentDto);
  }

  @Get(':id/comments')
  getComments(@Param('id') postId: string) {
    return this.postsService.getComments(postId);
  }

  @Post(':id/likes')
  toggleLike(
    @Param('id') postId: string,
    @GetUser('id') userId: string
  ) {
    return this.postsService.toggleLike(postId, userId);
  }

  @Get('user/:userId')
  getUserPosts(@Param('userId') userId: string) {
    return this.postsService.getUserPosts(userId);
  }
}
