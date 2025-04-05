import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  // app.connectMicroservice<MicroserviceOptions>(grpcClientOptions);

  // await app.startAllMicroservices();

  const config = new ConfigService();
  console.log(config.get('PORT'));
  const port = config.get('PORT') ?? 3000;

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');

  const configSwagger = new DocumentBuilder()
    // .addBearerAuth(
    //   {
    //     type: 'http',
    //     scheme: 'bearer',
    //     bearerFormat: 'JWT',
    //     name: 'JWT',
    //     description: 'Enter JWT token',
    //     in: 'header',
    //   },
    //   'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    // )
    // .addSecurityRequirements('JWT-auth')
    .setTitle('Диплом Дмитрий Соболев')
    .setDescription('Документаци по API GATEWAY')
    .setVersion('0.0.1')
    .addTag('Dmitriy Sobolev')
    .build();
  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('/api-docs', app, document);

  await app.listen(port);
  console.log(`Server started on port ${await app.getUrl()}`);
}
bootstrap();
