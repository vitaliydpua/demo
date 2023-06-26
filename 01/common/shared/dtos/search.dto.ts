import { Required } from '@inft-common/decorators';
import { SearchText } from '@inft-common/decorators/common/search-text.decorator';

export class SearchDTO {
    @SearchText(Required.STRONG)
    text: string;
}
