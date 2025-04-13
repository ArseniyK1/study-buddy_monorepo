import { Status } from '@grpc/grpc-js/build/src/constants';
import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch()
export class GrpcExceptionFilter {
  catch(exception: any, host: ArgumentsHost): Observable<any> {
    if (exception instanceof RpcException) {
      const e = JSON.parse(JSON.stringify(exception));
      console.log('RpcException', {
        error: e?.error,
        code: e?.error?.code,
        isRpcError: exception instanceof RpcException,
      });

      return throwError(
        () =>
          new RpcException({
            code: e?.error?.code || Status.INTERNAL,
            message: e?.error?.message || 'Internal server error',
          }),
      );
    }

    // Преобразование других ошибок
    const status = this.mapToGrpcStatus(exception);
    return throwError(
      () =>
        new RpcException({
          code: status,
          message: exception.message || 'Internal server error',
        }),
    );
  }
  private mapToGrpcStatus(exception: any): number {
    // Маппинг HTTP статусов в gRPC статусы
    switch (exception.status) {
      case 400:
        return Status.INVALID_ARGUMENT;
      case 401:
        return Status.UNAUTHENTICATED;
      case 403:
        return Status.PERMISSION_DENIED;
      case 404:
        return Status.NOT_FOUND;
      case 409:
        return Status.ALREADY_EXISTS;
      case 429:
        return Status.RESOURCE_EXHAUSTED;
      case 500:
        return Status.INTERNAL;
      case 501:
        return Status.UNIMPLEMENTED;
      case 503:
        return Status.UNAVAILABLE;
      default:
        return Status.INTERNAL;
    }
  }
}
