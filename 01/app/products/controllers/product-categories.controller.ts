import { JwtAuthGuard } from '@inft-app/auth/guards/jwt-auth.guard';
import { CreateProductCategoryDTO } from '@inft-app/products/controllers/dtos/product-categories/create/create-product-category.dto';
import { DeleteCategoryDTO } from '@inft-app/products/controllers/dtos/product-categories/delete/delete-category.dto';
import { UpdateCategoryDTO } from '@inft-app/products/controllers/dtos/product-categories/update/update-category.dto';
import { ProductCategoryModel } from '@inft-app/products/models/product/product-category/product-category.model';
import { ProductsCategoriesService } from '@inft-app/products/services/products-categories.service';
import { AppRequest } from '@inft-common/shared/types/app-request.type';
import { Body, Controller, Delete, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('PRODUCT-CATEGORIES')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/product-categories')
export class ProductCategoriesController {
  constructor(private readonly productsCategoriesService: ProductsCategoriesService) {}

  @Post()
  async createNewCategory(
      @Body() body: CreateProductCategoryDTO,
      @Req() req: AppRequest
  ): Promise<ProductCategoryModel> {
    return await this.productsCategoriesService.createNewCategory(body, req.user.id);
  }

  @Put()
  async updateCategory(@Body() body: UpdateCategoryDTO, @Req() req: AppRequest): Promise<void> {
    return await this.productsCategoriesService.updateCategoryName(body, req.user.id);
  }

  @Delete(':categoryId')
  async deleteCategory(@Param() params: DeleteCategoryDTO, @Req() req: AppRequest): Promise<void> {
    await this.productsCategoriesService.deleteCategory(params.categoryId, req.user.id);
  }
}
