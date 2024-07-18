import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port: number = Number(process.env.PORT) || 3000;

  // some configurations for api
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // setting API path
  const apiPath: string = process.env.API_PATH || 'api/v1';
  app.setGlobalPrefix(apiPath);

  // swagger configurations
  const opts = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Blog API')
    .setDescription('Self training project to practice Nest.js concepts')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, opts);
  SwaggerModule.setup(`${apiPath}/docs`, app, document);

  app.enableCors();
  await app.listen(port);
}
bootstrap();
