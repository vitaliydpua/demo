import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as randomize from 'randomatic';

enum ECodePattern {
  NUMERIC = '0',
  ALPHA_NUMERIC = 'a0',
}

@Injectable()
export class GenerateDataService {
  public genNumericCode(length: number): string {
    return randomize(ECodePattern.NUMERIC, length);
  }

  public genAlphaNumericCode(length: number): string {
    return randomize(ECodePattern.ALPHA_NUMERIC, length);
  }

  public async genHashAsync(target: string): Promise<string> {
    try {
      return bcrypt.hash(target, 10);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
