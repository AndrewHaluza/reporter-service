import { Logger, ValidationPipe } from '@nestjs/common';
import * as basicAuth from 'express-basic-auth';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import AllExceptionsFilter from './filters/allExceptions.filter';

async function bootstrap() {
  const logger: Logger = new Logger('Main file');

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      // forbidUnknownValues: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  app.setGlobalPrefix('api/v1');

  app.use(
    ['/docs', '/docs-json'],
    basicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
      },
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('reporter-service')
    .setDescription(`The backend API documentation`)
    .setVersion(process.env.npm_package_version)
    .addBearerAuth({ in: 'header', type: 'http' })
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.APP_PORT;

  await app.listen(port, () =>
    logger.verbose(`The server is running on ${port} port`),
  );
}
bootstrap();
