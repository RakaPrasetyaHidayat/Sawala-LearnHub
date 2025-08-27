import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { CreateResourceDto } from './dto/resource.dto';

@Controller('resources')
@UseGuards(JwtAuthGuard)
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  createResource(
    @Body() createResourceDto: CreateResourceDto,
    @GetUser('id') userId: string,
  ) {
    return this.resourcesService.createResource(createResourceDto, userId);
  }

  @Get('year/:year')
  getResourcesByYear(@Param('year') year: string) {
    return this.resourcesService.getResourcesByYear(year);
  }

  @Get('users/:userId')
  getUserResources(@Param('userId') userId: string) {
    return this.resourcesService.getUserResources(userId);
  }
}
