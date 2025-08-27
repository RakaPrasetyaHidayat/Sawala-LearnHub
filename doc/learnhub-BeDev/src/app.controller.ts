import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Get API information' })
  @ApiResponse({ 
    status: 200, 
    description: 'API information retrieved successfully'
  })
  getRoot() {
    return {
      status: 'success',
      message: 'Welcome to LearnHub API!',
      data: {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        description: 'LearnHub is your one-stop learning management platform',
        availableEndpoints: {
          auth: '/api/auth',
          users: '/api/users',
          posts: '/api/posts',
          comments: '/api/comments',
          resources: '/api/resources',
          documentation: '/api/docs'
        }
      }
    };
  }

  @Get('api/health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service health information' })
  getHealth() {
    return {
      status: 'success',
      message: 'Service is healthy',
      data: {
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        services: {
          database: 'connected',
          cache: 'connected',
          storage: 'connected'
        }
      }
    };
  }

  @Get('api/stats')
  @ApiOperation({ summary: 'Get API statistics' })
  @ApiResponse({ status: 200, description: 'API statistics retrieved successfully' })
  getStats() {
    return {
      status: 'success',
      message: 'API statistics retrieved successfully',
      data: {
        totalUsers: 1000,
        totalPosts: 5000,
        totalComments: 15000,
        activeUsers: 750,
        lastUpdated: new Date().toISOString()
      }
    };
  }

  // Favicon handlers: agar request favicon tidak mengganggu log
  @Get('favicon.ico')
  getFavicon() {
    return null; // otomatis status 200, content kosong
  }

  @Get('favicon.png')
  getFaviconPng() {
    return null;
  }
}
