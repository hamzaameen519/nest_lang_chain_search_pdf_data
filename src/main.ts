import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

// Load environment variables before creating the app
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(`Running on port: 3000`);
  await app.listen(3000);
}

bootstrap();
