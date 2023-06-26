import { createNamespace, Namespace, getNamespace } from 'cls-hooked';
import { Request } from 'express';

export const CLS_APP_NAMESPACE_NAME = 'app';
export const CLS_APP_REQUEST = 'incomingRequest';

export class ClsService {
  run(fn: () => void): void {
    createNamespace(CLS_APP_NAMESPACE_NAME).run(() => {
      fn();
    });
  }

  getAppRequest(): Request {
    return this.getNamespace().get(CLS_APP_REQUEST);
  }

  private getNamespace(): Namespace {
    return getNamespace(CLS_APP_NAMESPACE_NAME)!;
  }
}
