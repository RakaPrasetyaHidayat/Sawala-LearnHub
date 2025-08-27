import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('🔥 BOOTSTRAP STARTED - This should appear!');
  
  const app = await NestFactory.create(AppModule);

  console.log('🔥 APP CREATED - NestJS app instance created!');

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  });

  console.log('🔥 CORS ENABLED');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  console.log('🔥 VALIDATION PIPE CONFIGURED');

  // Try different ports if the default is in use
  const preferredPort = process.env.PORT || 3000;
  let port = parseInt(preferredPort.toString());
  
  console.log('🔥 PREFERRED PORT:', port);

  // Try to start the server, if port is in use, try next port
  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    try {
      console.log(`🔥 ATTEMPTING TO LISTEN ON PORT: ${port}`);
      await app.listen(port);
      break; // Success, exit the loop
    } catch (error) {
      if (error.code === 'EADDRINUSE') {
        console.log(`⚠️  Port ${port} is in use, trying port ${port + 1}`);
        port++;
        attempts++;
      } else {
        throw error; // Re-throw if it's not a port conflict
      }
    }
  }

  if (attempts >= maxAttempts) {
    throw new Error(`Could not find an available port after ${maxAttempts} attempts`);
  }
  
  console.log('🚀 APPLICATION IS RUNNING ON: http://localhost:' + port);
  console.log('💚 HEALTH CHECK: http://localhost:' + port + '/health');
  console.log('🔍 ROOT ENDPOINT: http://localhost:' + port + '/');
  console.log('👥 USERS ENDPOINT: http://localhost:' + port + '/users');
  console.log('🔐 AUTH ENDPOINT: http://localhost:' + port + '/auth');
  console.log('🌟 ENVIRONMENT:', process.env.NODE_ENV || 'development');
  console.log('🔥 BOOTSTRAP COMPLETED SUCCESSFULLY!');
}

bootstrap().catch((error) => {
  console.error('❌ BOOTSTRAP ERROR:', error);
  process.exit(1);
});