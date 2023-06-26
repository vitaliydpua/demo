import { ImagesModule } from '@inft-app/images/images.module';
import { ProductCategoriesController } from '@inft-app/products/controllers/product-categories.controller';
import { ProductsController } from '@inft-app/products/controllers/products.controller';
import { ProductsCategoriesService } from '@inft-app/products/services/products-categories.service';
import { ProductsService } from '@inft-app/products/services/products.service';
import { ServicesApiModule } from '@inft-common/api/services-api.module';
import { Module } from '@nestjs/common';

import { ProductsCoreModule } from '../../core/products/products-core.module';


@Module({
  imports: [ProductsCoreModule, ImagesModule, ServicesApiModule],
  providers: [ProductsService, ProductsCategoriesService],
  controllers: [ProductsController, ProductCategoriesController],
  exports: [ProductsService],
})
export class ProductsModule {}
