import { NestExpressApplication } from '@nestjs/platform-express';
import { VercelRequest, VercelResponse } from '@vercel/node';
import bootstrap from './main';

let app: NestExpressApplication;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!app) {
      app = await bootstrap();
      console.log('🚀 Serverless function initialized');
    }

    // Forward the request to NestJS
    const expressInstance = app.getHttpAdapter().getInstance();
    expressInstance(req, res);
  } catch (error) {
    console.error('❌ Serverless Error:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
      timestamp: new Date().toISOString(),
    });
  }
}
