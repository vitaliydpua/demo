/**
 * Ответ контроллера.
 * data - данные ответа (результат)
 * errors - ошибки произошедшие во время вычисления результата
 */
import { AppError } from '../error/app.error';

export class ControllerResponse<D> {
  constructor(public readonly data?: D, public readonly errors?: AppError[]) {}
}
