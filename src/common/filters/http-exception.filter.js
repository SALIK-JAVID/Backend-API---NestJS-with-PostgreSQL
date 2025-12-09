const { Catch, ArgumentsHost, HttpException, HttpStatus } = require('@nestjs/common');

@Catch()
class HttpExceptionFilter {
  catch(exception, host) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    let errors = null;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object') {
        message = exceptionResponse.message || message;
        errors = exceptionResponse.errors || null;
      } else {
        message = exceptionResponse;
      }
    } else if (exception.message) {
      message = exception.message;
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: Array.isArray(message) ? message : [message],
    };

    if (errors) {
      errorResponse.errors = errors;
    }

    console.error('Error occurred:', {
      ...errorResponse,
      stack: exception.stack,
    });

    response.status(status).json(errorResponse);
  }
}

module.exports = { HttpExceptionFilter };