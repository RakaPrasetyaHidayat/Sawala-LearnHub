import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from '@/app.controller';
import { SupabaseModule } from '@/infra/supabase/supabase.module';
import { UsersModule } from '@/modules/users/users.module';
import { TasksModule } from '@/modules/tasks/tasks.module';
import { ResourcesModule } from '@/modules/resources/resources.module';
import { CommentsModule } from '@/modules/comments/comments.module';
import { PostsModule } from '@/modules/posts/posts.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { InternsModule } from '@/modules/interns/interns.module';

import configuration from '@/config/configuration';
import { EnvSchema } from '@/config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigService available globally
      load: [configuration],
      validate: (env) => EnvSchema.parse(env),
    }),
    SupabaseModule,
    AuthModule,
    UsersModule,
    TasksModule,
    ResourcesModule,
    CommentsModule,
    PostsModule,
    InternsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
