import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PetitionModule } from './petitions/petition.module';
import { CommentModule } from './comments/comment.module';
import { NotificationModule } from './notifications/notification.module';
import { AiModule } from './ai/ai.module';
import { UploadModule } from './upload/upload.module';
import { SearchModule } from './search/search.module';
import { StatisticsModule } from './statistics/statistics.module';
import { UserModule } from './users/user.module';
import { CacheModule } from './cache/cache.module';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    PetitionModule,
    CommentModule,
    NotificationModule,
    AiModule,
    UploadModule,
    SearchModule,
    StatisticsModule,
    UserModule,
    CacheModule,
  ],
})
export class AppModule {}
