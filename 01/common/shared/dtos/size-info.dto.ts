import { Required } from '@inft-common/decorators';
import { SizeInfoDescription } from '@inft-common/decorators/common/size-info/size-info-description.decorator';
import { SizeInfo } from '@inft-common/shared/interfaces/size-info.interface';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SizeInfoDto implements SizeInfo {
    @SizeInfoDescription(Required.NULLABLE)
    description: string | null;

    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    size: string;
}
