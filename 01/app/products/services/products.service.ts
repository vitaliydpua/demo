import { ImagesService } from '@inft-app/images/services/images.service';
import {
    CreateProductClothesDto
} from '@inft-app/products/controllers/dtos/products/create/create-product-clothes.dto';
import {
    CreateProductInnerAdditionalDto
} from '@inft-app/products/controllers/dtos/products/create/create-product-inner-additional.dto';
import {
    CreateProductAnimatorsDTO,
    CreateProductDecorationsDTO,
    CreateProductFlowersDTO,
    CreateProductMakeUpDTO,
    CreateProductPhotographersDTO,
    CreateProductSweetsDTO
} from '@inft-app/products/controllers/dtos/products/create/create-product.dto';
import { SearchProductsDTO } from '@inft-app/products/controllers/dtos/products/get/search-products.dto';
import { ProductModel, ProductModelData } from '@inft-app/products/models/product/product.model';
import { ProductAnimatorsFactory } from '@inft-app/products/models/product-animators/product-animators.factory';
import { ProductAnimatorsMapper } from '@inft-app/products/models/product-animators/product-animators.mapper';
import { ProductClothesFactory } from '@inft-app/products/models/product-clothes/product-clothes.factory';
import { ProductClothesMapper } from '@inft-app/products/models/product-clothes/product-clothes.mapper';
import { ProductDecorationsFactory } from '@inft-app/products/models/product-decorations/product-decorations.factory';
import { ProductDecorationsMapper } from '@inft-app/products/models/product-decorations/product-decorations.mapper';
import { ProductFlowersFactory } from '@inft-app/products/models/product-flowers/product-flowers.factory';
import { ProductFlowersMapper } from '@inft-app/products/models/product-flowers/product-flowers.mapper';
import { ProductMakeUpFactory } from '@inft-app/products/models/product-make-up/product-make-up.factory';
import { ProductMakeUpMapper } from '@inft-app/products/models/product-make-up/product-make-up.mapper';
import {
    ProductPhotographersFactory
} from '@inft-app/products/models/product-photographers/product-photographers.factory';
import { ProductPhotographersMapper } from '@inft-app/products/models/product-photographers/product-photographers.mapper';
import { ProductSweetsFactory } from '@inft-app/products/models/product-sweets/product-sweets.factory';
import { ProductSweetsMapper } from '@inft-app/products/models/product-sweets/product-sweets.mapper';
import { CreateProductAnimatorsStrategy } from '@inft-app/products/strategies/create-product-animators.strategy';
import { CreateProductClothesStrategy } from '@inft-app/products/strategies/create-product-clothes.strategy';
import { CreateProductDecorationsStrategy } from '@inft-app/products/strategies/create-product-decorations.strategy';
import { CreateProductFlowersStrategy } from '@inft-app/products/strategies/create-product-flowers.strategy';
import { CreateProductMakeUpStrategy } from '@inft-app/products/strategies/create-product-make-up.strategy';
import { CreateProductPhotographersStrategy } from '@inft-app/products/strategies/create-product-photographers.strategy';
import { CreateProductSweetsStrategy } from '@inft-app/products/strategies/create-product-sweets.strategy';
import { CreateProductStrategy } from '@inft-app/products/strategies/create-product.strategy';
import { BusinessUserModel } from '@inft-app/users/models/business-user/business-user.model';
import { ModelFactory } from '@inft-common/abstract/model-factory.abstract';
import { ModelDataMapper } from '@inft-common/abstract/model.mapper.abstract';
import { AwsServiceApi } from '@inft-common/api/aws/aws-service.api';
import {
    ProductActivityNotSupportedError
} from '@inft-common/error/custom-errors/products/product-activity-not-supported.error';
import { ProductExistsError } from '@inft-common/error/custom-errors/products/product-exists.error';
import { EBusinessActivity } from '@inft-common/shared/enums/business-activity.enum';
import { UploadFileData } from '@inft-common/shared/interfaces/upload-file.interface';
import { UUID } from '@inft-common/shared/types/uuid.type';
import { ForbiddenException, Injectable } from '@nestjs/common';
import * as _ from 'lodash';

import { ProductAnimatorsEntity } from '../../../core/products/entities/product-animators.entity';
import { ProductClothesEntity } from '../../../core/products/entities/product-clothes.entity';
import { ProductDecorationsEntity } from '../../../core/products/entities/product-decorations.entity';
import { ProductFlowersEntity } from '../../../core/products/entities/product-flowers.entity';
import { ProductMakeUpEntity } from '../../../core/products/entities/product-make-up.entity';
import { ProductPhotographersEntity } from '../../../core/products/entities/product-photographers.entity';
import { ProductSweetsEntity } from '../../../core/products/entities/product-sweets.entity';
import { ProductEntity } from '../../../core/products/entities/product.entity';
import { ProductCategoriesCoreService } from '../../../core/products/services/product-categories-core.service';
import { ProductsCoreService } from '../../../core/products/services/products-core.service';

export type CreateBusinessProductType =
    | CreateProductClothesDto
    | CreateProductSweetsDTO
    | CreateProductAnimatorsDTO
    | CreateProductDecorationsDTO
    | CreateProductFlowersDTO
    | CreateProductPhotographersDTO
    | CreateProductMakeUpDTO;


@Injectable()
export class ProductsService {
    private readonly productModelCreators = new Map<EBusinessActivity, {
        factory: ModelFactory<ProductModelData, ProductModel>;
        mapper: ModelDataMapper<ProductEntity, ProductModelData>;
    }>([
        [EBusinessActivity.CLOTHES, {
            factory: new ProductClothesFactory(),
            mapper: new ProductClothesMapper(this.awsService)
        }],
        [EBusinessActivity.ANIMATORS, {
            factory: new ProductAnimatorsFactory(),
            mapper: new ProductAnimatorsMapper(this.awsService)
        }],
        [EBusinessActivity.DECORATIONS, {
            factory: new ProductDecorationsFactory(),
            mapper: new ProductDecorationsMapper(this.awsService)
        }],
        [EBusinessActivity.FLOWERS, {
            factory: new ProductFlowersFactory(),
            mapper: new ProductFlowersMapper(this.awsService)
        }],
        [EBusinessActivity.SWEETS, {
            factory: new ProductSweetsFactory(),
            mapper: new ProductSweetsMapper(this.awsService)
        }],
        [EBusinessActivity.PHOTOGRAPHERS, {
            factory: new ProductPhotographersFactory(),
            mapper: new ProductPhotographersMapper(this.awsService)
        }],
        [EBusinessActivity.MAKE_UP, {
            factory: new ProductMakeUpFactory(),
            mapper: new ProductMakeUpMapper(this.awsService)
        }],
    ]);

    constructor(
        private readonly productsService: ProductsCoreService,
        private readonly productCategoriesService: ProductCategoriesCoreService,
        private readonly imagesService: ImagesService,
        private readonly awsService: AwsServiceApi
    ) {}

    async addProductImage(productId: UUID, businessId: UUID, image: UploadFileData): Promise<void> {
        const isOwner = await this.productsService.isOwnerOfProduct(productId, businessId);

        if (!isOwner) {
            throw new ForbiddenException();
        }

        await this.imagesService.uploadProductImage(productId, image);
    }

    async addProductInnerAdditionalImage(
        productId: UUID,
        businessId: UUID,
        image: UploadFileData
    ): Promise<void> {
        const isOwner = await this.productsService.isOwnerOfProduct(productId, businessId);

        if (!isOwner) {
            throw new ForbiddenException();
        }

        const filename = await this.imagesService.saveToAWS(image.originalname, image.buffer);

        await this.productsService.updateInnerAdditional(productId, { image: filename });
    }

    async addProductInnerAdditional(params: CreateProductInnerAdditionalDto, userId: UUID): Promise<void> {
        const isOwner = await this.productsService.isOwnerOfProduct(params.productId, userId);

        if (!isOwner) {
            throw new ForbiddenException();
        }

        await this.productsService.saveInnerAdditional({
            name: params.name,
            price: params.price,
            productId: params.productId,
            categoryId: params.categoryId,
            businessId: userId,
            description: params.description,
            discount: params.discount ?? null,
        });
    }

    async getProductById(id: UUID, activity: EBusinessActivity): Promise<ProductModel | null> {
        const entity = await this.productsService.findById(id);
        const { factory, mapper } = this.productModelCreators.get(activity);

        return entity ? factory.getModelFromData(mapper.mapData(entity)) : null;
    }

    async getProductsByIds(ids: UUID[]): Promise<ProductModel[]> {
        const entities = await this.productsService.findByIds(ids);

        return entities.reduce<ProductModel[]>((acc, raw) => {
            const { mapper, factory } = this.getProductFactoryAndMapperViaEntity(raw);
            acc.push(factory.getModelFromData(mapper.mapData(raw)));

            return acc;
        }, []);
    }

    async searchProducts(params: SearchProductsDTO): Promise<{ [category: string]: ProductModel[] }> {
        const entities = await this.productsService.search(params.text, params.businessId);

        return this.mapProductsToMapByCategoryKey(entities, params.activity);
    }

    async getBusinessProducts(
        businessId: UUID,
        activity: EBusinessActivity,
    ): Promise<{ [category: string]: ProductModel[] }> {
        const entities = await this.productsService.getBusinessProducts(businessId);

        return this.mapProductsToMapByCategoryKey(entities, activity);
    }

    getProductFactoryAndMapperViaEntity(entity: ProductEntity): {
        mapper: ModelDataMapper<ProductEntity, ProductModelData>;
        factory: ModelFactory<ProductModelData, ProductModel>;
    } {
        if (entity instanceof ProductClothesEntity) {
            return this.productModelCreators.get(EBusinessActivity.CLOTHES);
        }

        if (entity instanceof ProductAnimatorsEntity) {
            return this.productModelCreators.get(EBusinessActivity.ANIMATORS);
        }

        if (entity instanceof ProductDecorationsEntity) {
            return this.productModelCreators.get(EBusinessActivity.DECORATIONS);
        }

        if (entity instanceof ProductFlowersEntity) {
            return this.productModelCreators.get(EBusinessActivity.FLOWERS);
        }

        if (entity instanceof ProductMakeUpEntity) {
            return this.productModelCreators.get(EBusinessActivity.MAKE_UP);
        }

        if (entity instanceof ProductPhotographersEntity) {
            return this.productModelCreators.get(EBusinessActivity.PHOTOGRAPHERS);
        }

        if (entity instanceof ProductSweetsEntity) {
            return this.productModelCreators.get(EBusinessActivity.SWEETS);
        }
    }

    private mapProductsToMapByCategoryKey(
        entities: ProductEntity[],
        activity: EBusinessActivity
    ): { [category: string]: ProductModel[] } {
        // No data
        if (!entities.length) {
            return {};
        }

        const { factory, mapper } = this.productModelCreators.get(activity);
        const sortedUniqCategories = _.uniqBy(entities.map(pa => pa.category), c => c.name)
            .sort((a, b) => a.position - b.position);

        return Object.values(sortedUniqCategories).reduce<{ [key: string]: ProductModel[] }>((acc, cat) => {
            if (!acc[cat.name]) {
                acc[cat.name] = [];
            }
            acc[cat.name] = entities.filter(d => d.category.name === cat.name).map(raw =>
                factory.getModelFromData(mapper.mapData(raw))
            );

            return acc;
        }, {});
    }

    async createBusinessProduct(
        businessUser: BusinessUserModel,
        params: CreateBusinessProductType
    ): Promise<ProductModel> {
        let strategy: CreateProductStrategy;

        if (await this.productsService.productExistsByName(params.name, businessUser.id)) {
            throw new ProductExistsError();
        }

        switch (businessUser.activity) {
            case EBusinessActivity.ANIMATORS:
                strategy = new CreateProductAnimatorsStrategy(businessUser.id, this.productsService, this.awsService);
                break;
            case EBusinessActivity.SWEETS:
                strategy = new CreateProductSweetsStrategy(businessUser.id, this.productsService, this.awsService);
                break;
            case EBusinessActivity.CLOTHES:
                strategy = new CreateProductClothesStrategy(businessUser.id, this.productsService, this.awsService);
                break;
            case EBusinessActivity.DECORATIONS:
                strategy = new CreateProductDecorationsStrategy(businessUser.id, this.productsService, this.awsService);
                break;
            case EBusinessActivity.FLOWERS:
                strategy = new CreateProductFlowersStrategy(businessUser.id, this.productsService, this.awsService);
                break;
            case EBusinessActivity.MAKE_UP:
                strategy = new CreateProductMakeUpStrategy(businessUser.id, this.productsService, this.awsService);
                break;
            case EBusinessActivity.PHOTOGRAPHERS:
                strategy = new CreateProductPhotographersStrategy(
                    businessUser.id,
                    this.productsService,
                    this.awsService
                );
                break;
            default:
                throw new ProductActivityNotSupportedError();
        }

        const createdProduct = await strategy.create(params);

        return (await this.getProductById(createdProduct.id, businessUser.activity))!;
    }
}
