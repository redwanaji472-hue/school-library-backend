import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import express from 'express';

const expressApp = express();

// Bootstrap once, reuse across serverless invocations
let cachedApp: ExpressAdapter | null = null;

async function bootstrap() {
  if (cachedApp) return cachedApp;

  const adapter = new ExpressAdapter(expressApp);
  const app = await NestFactory.create(AppModule, adapter);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');

  // Swagger docs
  const config = new DocumentBuilder()
    .setTitle('School Library Management System API')
    .setDescription('Smart School Library Management System Backend API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.init();
  cachedApp = adapter;
  return adapter;
}

export default async function handler(req: any, res: any) {
  await bootstrap();
  expressApp(req, res);
}
