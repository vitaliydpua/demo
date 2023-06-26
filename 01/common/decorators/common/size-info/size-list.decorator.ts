import { IPropStrategy, Required } from '@inft-common/decorators';
import { SizeInfoDto } from '@inft-common/shared/dtos/size-info.dto';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateIf, ValidateNested } from 'class-validator';


export class SizeListDecoratorStrategy {
  static variables(requiredType: Required): IPropStrategy {
    const map = new Map<Required, IPropStrategy>()
      .set(Required.STRONG, new SizeListRequired())
      .set(Required.NULLABLE, new SizeListNullable())
      .set(Required.OPTIONAL, new SizeListOptional());

    return map.get(requiredType);
  }

  static default(required: boolean): PropertyDecorator[] {
    return [
      ApiProperty({
        required,
        type: SizeInfoDto,
        description: 'List of sizes',
        isArray: true,
      }),
      IsArray(),
        ValidateNested({ each: true }),
        Type(() => SizeInfoDto)
    ];
  }
}

export class SizeListRequired implements IPropStrategy {
  getDecorator(): Function {
    return applyDecorators(
      ...SizeListDecoratorStrategy.default(true),
    );
  }
}

export class SizeListNullable implements IPropStrategy {
  getDecorator(): Function {
    return applyDecorators(
      ...SizeListDecoratorStrategy.default(false),
      IsOptional(),
      ValidateIf((object, value) => value !== null),
    );
  }
}

export class SizeListOptional implements IPropStrategy {
  getDecorator(): Function {
    return applyDecorators(
      ...SizeListDecoratorStrategy.default(false),
      ValidateIf((object, value) => value !== undefined),
    );
  }
}

export function SizeList(requiredType: Required = Required.STRONG) {
  return SizeListDecoratorStrategy.variables(requiredType).getDecorator();
}
