import { PurchaseClothesDto } from '@inft-app/orders/controllers/dtos/purchase/clothes/purchase-clothes.dto';
import { PurchaseDto } from '@inft-app/orders/controllers/dtos/purchase/purchase.dto';
import {
    CalculatedPurchaseModel,
    CalculatedPurchaseModelData,
} from '@inft-app/orders/models/calculate/calculated-purchase/calculated-purchase.model';
import {
    CalculatedPurchaseClothesFactory
} from '@inft-app/orders/models/calculate/calculated-purchase/clothes/calculated-purchase-clothes.factory';
import {
    CalculatedPurchaseSweetsFactory
} from '@inft-app/orders/models/calculate/calculated-purchase/sweets/calculated-purchase-sweets.factory';
import { ProductModel } from '@inft-app/products/models/product/product.model';
import { EBusinessActivity } from '@inft-common/shared/enums/business-activity.enum';
import { UUID } from '@inft-common/shared/types/uuid.type';

export class CalculatePurchasesHandler {
    constructor(
        private products: ProductModel[],
        private purchases: PurchaseDto[],
    ) {
    }
    handle(): { [businessId: UUID]: CalculatedPurchaseModel[] } {
        return this.products.reduce<{ [businessId: UUID]: CalculatedPurchaseModel[] }>((acc, product) => {
            if (!acc[product.business.id]) {
                acc[product.business.id] = [];
            }

            const givenPurchase = this.purchases.find(p => p.id === product.id);
            const base: CalculatedPurchaseModelData = {
                id: product.id,
                name: product.name,
                price: product.price,
                discount: product.discount,
                discountPrice: product.price - product.price * (product.discount / 100),
                category: product.category.name,
                images: product.images.map(img => img.href),
                businessActivity: product.business.activity,
            };

            switch (givenPurchase.type) {
                case EBusinessActivity.CLOTHES:
                    acc[product.business.id].push(new CalculatedPurchaseClothesFactory().getModelFromData({
                        ...base,
                        size: (givenPurchase as PurchaseClothesDto).options.size.size +
                        (givenPurchase as PurchaseClothesDto).options.size.description ?
                            `(${(givenPurchase as PurchaseClothesDto).options.size.description})` : '',
                    }));
                    break;
                case EBusinessActivity.SWEETS:
                    acc[product.business.id].push(new CalculatedPurchaseSweetsFactory().getModelFromData({
                        ...base,
                    }));
                    break;
                default:
                    throw new Error();
            }
            return acc;
        }, {});
    }
}
