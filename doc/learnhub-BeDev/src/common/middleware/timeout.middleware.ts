import { Injectable, NestMiddleware } from '@nestjs/common';
import * as timeout from 'connect-timeout';

@Injectable()
export class TimeoutMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    timeout('10s')(req, res, next); // Batasi waktu eksekusi menjadi 10 detik
  }
}
