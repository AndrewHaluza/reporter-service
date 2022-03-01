import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
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

  const port = process.env.APP_PORT;

  await app.listen(port, () =>
    logger.verbose(`The server is running on ${port} port`),
  );
}
bootstrap();
