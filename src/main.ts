import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS for frontend apps. Configure via CORS_ORIGIN env (comma-separated)
  const defaultOrigins = ['http://localhost:3000'];
  const originsEnv = process.env.CORS_ORIGIN;
  const allowedOrigins =
    originsEnv && originsEnv.length > 0
      ? originsEnv
          .split(',')
          .map((o) => o.trim())
          .filter(Boolean)
      : defaultOrigins;

  // Use a whitelist of allowed origins. When using cookies/auth, set credentials: true.
  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With',
    credentials: true,
  });

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new ResponseInterceptor(),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove extra fields not in DTO
      forbidNonWhitelisted: true, // throw error for unknown fields
      transform: true, // transform payloads to DTO instances
    }),
  );
  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
