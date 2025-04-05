import { Status } from '@grpc/grpc-js/build/src/constants';
import { Catch, ArgumentsHost } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch()
export class GrpcExceptionFilter {
  catch(exception: any, host: ArgumentsHost): Observable<any> {
    if (exception instanceof RpcException) {
      return throwError(() => exception);
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
    if (exception.status === 404) return Status.NOT_FOUND;
    if (exception.status === 401) return Status.UNAUTHENTICATED;
    if (exception.status === 403) return Status.PERMISSION_DENIED;
    return Status.INTERNAL;
  }
}
