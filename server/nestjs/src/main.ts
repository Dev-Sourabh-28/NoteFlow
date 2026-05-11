import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.NESTJS_PORT || 5001;

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: [
    'http://localhost:5173',
    'https://note-flow-tan.vercel.app',
  ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });

  await app.listen(port);
}
bootstrap();
