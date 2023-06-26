import { Required } from '@inft-common/decorators';
import { Id } from '@inft-common/decorators/common/id.decorator';
import { BusinessActivity } from '@inft-common/decorators/users/business/business-activity.decorator';
import { SearchDTO } from '@inft-common/shared/dtos/search.dto';
import { EBusinessActivity } from '@inft-common/shared/enums/business-activity.enum';
import { UUID } from '@inft-common/shared/types/uuid.type';

export class SearchProductsDTO extends SearchDTO {
    @Id(Required.STRONG)
    businessId: UUID;

    @BusinessActivity(Required.STRONG)
    activity: EBusinessActivity;
}
