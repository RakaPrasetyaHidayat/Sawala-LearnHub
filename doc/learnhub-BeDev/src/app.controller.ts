import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('App')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Get API information' })
  @ApiResponse({ status: 200, description: 'API information retrieved successfully' })
  getRoot() {
    return {
      message: 'LearnHub API is running successfully!',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      endpoints: {
        users: '/users',
        auth: '/auth',
        docs: '/api-docs',
        health: '/health'
      }
    };
  }

  @Get('favicon.ico')
  @ApiOperation({ summary: 'Handle favicon.ico requests' })
  @ApiResponse({ status: 204, description: 'No content' })
  getFavicon(@Res() res: Response) {
    res.status(204).send();
  }

  @Get('favicon.png')
  @ApiOperation({ summary: 'Handle favicon.png requests' })
  @ApiResponse({ status: 204, description: 'No content' })
  getFaviconPng(@Res() res: Response) {
    res.status(204).send();
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development'
    };
  }
}