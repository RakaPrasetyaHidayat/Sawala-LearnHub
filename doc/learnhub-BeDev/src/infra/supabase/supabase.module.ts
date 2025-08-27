import { Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service.js';
import { ConfigModule } from '../../config/config.module.js';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'ENV',
      useValue: {
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
    },
    SupabaseService,
  ],
  exports: [SupabaseService],
})
export class SupabaseModule {}