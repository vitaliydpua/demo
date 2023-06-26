import {
  CreateProductCategoryDTO
} from '@inft-app/products/controllers/dtos/product-categories/create/create-product-category.dto';
import { UpdateCategoryDTO } from '@inft-app/products/controllers/dtos/product-categories/update/update-category.dto';
import { ProductCategoryFactory } from '@inft-app/products/models/product/product-category/product-category.factory';
import { ProductCategoryMapper } from '@inft-app/products/models/product/product-category/product-category.mapper';
import { ProductCategoryModel } from '@inft-app/products/models/product/product-category/product-category.model';
import { ProductCategoryAlreadyExistsError } from '@inft-common/error/custom-errors/products/product-category-already-exists.error';
import { ProductCategoryIsNotYoursError } from '@inft-common/error/custom-errors/products/product-category-is-not-yours.error';
import { UUID } from '@inft-common/shared/types/uuid.type';
import { ForbiddenException, Injectable } from '@nestjs/common';

import { ProductCategoriesCoreService } from '../../../core/products/services/product-categories-core.service';
import { ProductsCoreService } from '../../../core/products/services/products-core.service';

@Injectable()
export class ProductsCategoriesService {
  constructor(
    private readonly productsService: ProductsCoreService,
    private readonly productCategoriesService: ProductCategoriesCoreService
  ) {}

  async createNewCategory(params: CreateProductCategoryDTO, businessId: UUID): Promise<ProductCategoryModel> {
    const entity = await this.productCategoriesService.saveNewCategory({
      name: params.name,
      businessId,
      position: params.position ?? 0,
    });

    return new ProductCategoryFactory().getModelFromData(
      new ProductCategoryMapper().mapData(entity)
    );
  }

  async updateCategoryName(params: UpdateCategoryDTO, businessId: UUID): Promise<void> {
    const category = await this.productCategoriesService.getCategoryById(params.categoryId);

    if (category?.businessId !== businessId) {
      throw new ForbiddenException();
    }

    await this.productCategoriesService.updateName(params.categoryId, params.name);
  }

  async deleteCategory(id: UUID, businessId: UUID): Promise<void> {
    const category = await this.productCategoriesService.getCategoryById(id);

    if (category?.businessId !== businessId) {
      throw new ProductCategoryIsNotYoursError();
    }

    await this.productCategoriesService.deleteCategory(id);
  }
}
