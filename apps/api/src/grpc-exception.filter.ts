import { Status } from '@grpc/grpc-js/build/src/constants';
import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

interface GrpcError {
  code: number;
  message: string;
}

@Catch(RpcException)
export class GrpcExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    console.log('GrpcExceptionFilter - Raw exception:', exception);

    const error = exception.getError() as GrpcError;
    console.log('GrpcExceptionFilter - Parsed error:', error);

    const status = this.mapToHttpStatus(error);
    console.log('GrpcExceptionFilter - Mapped status:', status);

    const response = host.switchToHttp().getResponse();
    response.status(status).json({
      statusCode: status,
      message: error.message || 'Internal server error',
      error: HttpStatus[status],
    });
  }

  private mapToHttpStatus(error: GrpcError): number {
    if (error.code) {
      switch (error.code) {
        case Status.NOT_FOUND:
          return HttpStatus.NOT_FOUND;
        case Status.UNAUTHENTICATED:
          return HttpStatus.UNAUTHORIZED;
        case Status.PERMISSION_DENIED:
          return HttpStatus.FORBIDDEN;
        case Status.INVALID_ARGUMENT:
          return HttpStatus.BAD_REQUEST;
        case Status.ALREADY_EXISTS:
          return HttpStatus.CONFLICT;
        case Status.RESOURCE_EXHAUSTED:
          return HttpStatus.TOO_MANY_REQUESTS;
        case Status.UNIMPLEMENTED:
          return HttpStatus.NOT_IMPLEMENTED;
        case Status.UNAVAILABLE:
          return HttpStatus.SERVICE_UNAVAILABLE;
        default:
          return HttpStatus.INTERNAL_SERVER_ERROR;
      }
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
