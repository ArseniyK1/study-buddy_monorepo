import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.AUTH_SERVICE_HOST,
        port: !!process.env.AUTH_SERVICE_PORT
          ? +process.env.AUTH_SERVICE_PORT
          : 3000,
      },
    },
  );
  await app.listen();
}
bootstrap();
