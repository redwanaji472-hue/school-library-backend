import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import express from 'express';

// Shared Express instance — reused across serverless invocations
const expressApp = express();
let isBootstrapped = false;

async function bootstrap() {
  if (isBootstrapped) return;
  isBootstrapped = true;

  const adapter = new ExpressAdapter(expressApp);
  const app = await NestFactory.create(AppModule, adapter, {
    logger: process.env.VERCEL ? ['error', 'warn'] : ['log', 'error', 'warn', 'debug'],
  });

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');

  // Swagger docs at /docs
  const config = new DocumentBuilder()
    .setTitle('School Library Management System API')
    .setDescription('Smart School Library Management System Backend API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // On Vercel the swagger-ui-dist static files are not bundled into the
  // serverless function, so /docs/*.css, *.js, and favicons 404. Load
  // them from a CDN instead of serving them locally.
  const CDN = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.17.14';
  SwaggerModule.setup('docs', app, document, {
    customCssUrl: `${CDN}/swagger-ui.css`,
    customJs: [
      `${CDN}/swagger-ui-bundle.js`,
      `${CDN}/swagger-ui-standalone-preset.js`,
    ],
    customfavIcon: `${CDN}/favicon-32x32.png`,
  });

  // init() sets up routes/middleware without binding a port
  await app.init();
}

// ── Vercel serverless handler (cached between invocations) ──────────
export default async function handler(req: express.Request, res: express.Response) {
  await bootstrap();
  return expressApp(req, res);
}

// ── Local development: start the HTTP server ────────────────────────
if (!process.env.VERCEL) {
  bootstrap().then(() => {
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
    expressApp.listen(port, () => {
      console.log(`🚀 Server is running on: http://localhost:${port}/api`);
      console.log(`📚 Swagger docs: http://localhost:${port}/docs`);
    });
  });
}
