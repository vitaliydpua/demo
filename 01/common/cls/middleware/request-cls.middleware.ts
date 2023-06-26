import { Injectable, NestMiddleware } from '@nestjs/common';
import { getNamespace } from 'cls-hooked';

import { CLS_APP_NAMESPACE_NAME, CLS_APP_REQUEST } from '../cls.service';


/**
 * стартует выполнение запроса в отдельном контексте
 * нужно чтобы выполнялся самым первым в цепочке NestMiddlewarе (зарегистрировать корневом AppModule)
 *
 * (В виде express middleware работать не будет)
 */
@Injectable()
export class RequestCLSMiddleware implements NestMiddleware {
  // @ts-ignore
  use(req: Request, res: Response, next: () => void): any {
    const ns = getNamespace(CLS_APP_NAMESPACE_NAME);
    if (ns) {
      ns.run(() => {
        ns.set(CLS_APP_REQUEST, req);
        next();
      });
    } else {
      next();
    }
  }
}
