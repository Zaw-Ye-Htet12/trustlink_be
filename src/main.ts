import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(
    new ResponseInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove extra fields not in DTO
      forbidNonWhitelisted: true, // throw error for unknown fields
      transform: true, // transform payloads to DTO instances
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
