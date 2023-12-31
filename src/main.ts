import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import * as yaml from 'js-yaml';
import { HttpExceptionFilter, convertError } from './features/config';
import { ResponseInterceptor } from './features/common/interceptor/response/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'https://leave-management-frontend.web.app',
      'https://leave-pi.vercel.app',
      'http://localhost:5009',
    ],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      transform: true,
      enableDebugMessages: true,
      validationError: {
        target: false,
        value: false,
      },
      validateCustomDecorators: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors) => {
        const errorObject = convertError(errors); //convert validation error message
        throw new UnprocessableEntityException(errorObject);
      },
    }),
  );
  app.setGlobalPrefix('/api/v1');

  const yamlContent = fs.readFileSync(
    path.join(process.cwd(), 'docs.yaml'),
    'utf-8',
  );
  const document: OpenAPIObject = yaml.load(yamlContent) as OpenAPIObject;

  SwaggerModule.setup('/api-docs', app, document);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(9090);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
