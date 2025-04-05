import { NestFactory } from '@nestjs/core';
import { GrpcModule } from './grpc.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { GrpcExceptionFilter } from './grpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    GrpcModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'auth',
        protoPath: join(__dirname, '../../../shared/proto/auth.proto'),
      },
    },
  );
  app.useGlobalFilters(new GrpcExceptionFilter());

  await app.listen();
}
bootstrap();
