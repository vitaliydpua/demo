import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppError } from '../error/app.error';

/**
 * Формирует ответ контроллера
 *
 * @param data
 * @param errors
 */
export function controllerResponseFormatMap<C>(data: C, errors?: AppError[]): { data: C; errors: AppError[] } {
  return {
    data,
    ...(errors ? { errors } : { errors: [] }),
  };
}

/**
 * Формирует ответ контроллера через оператор RXJS
 *
 * @param errors
 */
export function controllerResponseFormat<C>(errors?: AppError[]): OperatorFunction<C, { data: C; errors: AppError[] }> {
  return input$ =>
    input$.pipe(
      map<C, { data: C; errors: AppError[] }>(data => controllerResponseFormatMap(data, errors)),
    );
}
