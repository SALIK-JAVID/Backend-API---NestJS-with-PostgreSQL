const { Injectable, ExecutionContext } = require('@nestjs/common');
const { AuthGuard } = require('@nestjs/passport');

@Injectable()
class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context) {
    // Add custom authentication logic here if needed ()
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new Error('Unauthorized');
    }
    return user;
  }
}

module.exports = { JwtAuthGuard };