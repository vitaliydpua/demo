import { Required } from '@inft-common/decorators';
import { Limit } from '@inft-common/decorators/pagination/limit.decorator';
import { Page } from '@inft-common/decorators/pagination/page.decorator';
import { PaginationOffsetParams } from '@inft-common/shared/interfaces/pagination-offset-params.interface';

export class PaginationOffsetDto implements PaginationOffsetParams {
  @Limit(Required.OPTIONAL)
  limit: number;

  @Page(Required.OPTIONAL)
  page: number;
}
