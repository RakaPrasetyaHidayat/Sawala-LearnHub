import 'module-alias/register';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configure CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'https://learnhub-be-dev.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    exposedHeaders: ['Authorization'],
  });
  console.log('🔥 CORS ENABLED');

  // Tidak menggunakan global prefix (biar root / bisa diakses langsung di Vercel)
  // Jika ingin prefix /api, gunakan: app.setGlobalPrefix('api');
  console.log('🔥 Global prefix removed for Vercel compatibility');

  // Configure Swagger (tetap diakses di /api/docs)
  const swaggerConfig = new DocumentBuilder()
    .setTitle('LearnHub API')
    .setDescription('The LearnHub API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDoc);
  console.log('🔥 SWAGGER DOCUMENTATION SETUP AT: /api/docs');

  // Configure Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  console.log('🔥 VALIDATION PIPE CONFIGURED');

  return app;
}

// Jika dijalankan secara lokal (node dist/main.js)
if (require.main === module) {
  bootstrap()
    .then(async (app) => {
      const port = process.env.PORT || 3000;
      await app.listen(port);
      console.log(`🚀 Application is running on port ${port}`);
      console.log('📋 Available endpoints:');
      console.log('  GET  /              (AppController root JSON)');
      console.log('  GET  /api/health    (Health check)');
      console.log('  GET  /api/stats     (Stats endpoint)');
      console.log('  GET  /api/docs      (Swagger Documentation)');
    })
    .catch((error) => {
      console.error('❌ BOOTSTRAP ERROR:', error);
      process.exit(1);
    });
}

// Export untuk Vercel serverless
export default bootstrap;
