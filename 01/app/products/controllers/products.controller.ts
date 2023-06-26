import { JwtAuthGuard } from '@inft-app/auth/guards/jwt-auth.guard';
import { AddProductImageDTO } from '@inft-app/products/controllers/dtos/products/create/add-product-image.dto';
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
  CreateProductSweetsDTO,
} from '@inft-app/products/controllers/dtos/products/create/create-product.dto';
import {
  GetBusinessProductsByIdDTO,
} from '@inft-app/products/controllers/dtos/products/get/get-business-products-by-id.dto';
import { SearchProductsDTO } from '@inft-app/products/controllers/dtos/products/get/search-products.dto';
import { ProductModel } from '@inft-app/products/models/product/product.model';
import { ProductsService } from '@inft-app/products/services/products.service';
import { BusinessActivity } from '@inft-app/users/guards/business-activity.guard';
import { BusinessUserModel } from '@inft-app/users/models/business-user/business-user.model';
import { Roles } from '@inft-common/guards/role.guard';
import { FILE_UPLOAD_INTERCEPTOR } from '@inft-common/interceptors/file-upload.interceptor';
import { EBusinessActivity } from '@inft-common/shared/enums/business-activity.enum';
import { EUserRole } from '@inft-common/shared/enums/user-role.enum';
import { UploadFileData } from '@inft-common/shared/interfaces/upload-file.interface';
import { AppRequest } from '@inft-common/shared/types/app-request.type';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ApiImplicitFile } from '@nestjs/swagger/dist/decorators/api-implicit-file.decorator';

@ApiTags('PRODUCTS')
@ApiBearerAuth()
@Controller('api/v1/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @BusinessActivity(EBusinessActivity.CLOTHES)
  @Roles(EUserRole.BUSINESS)
  @UseGuards(JwtAuthGuard)
  @Post('clothes')
  async createProductClothes(@Body() body: CreateProductClothesDto, @Req() req: AppRequest): Promise<ProductModel> {
    return await this.productsService.createBusinessProduct(req.user as BusinessUserModel, body);
  }

  @BusinessActivity(EBusinessActivity.SWEETS)
  @Roles(EUserRole.BUSINESS)
  @UseGuards(JwtAuthGuard)
  @Post('sweets')
  async createProductSweets(@Body() body: CreateProductSweetsDTO, @Req() req: AppRequest): Promise<ProductModel> {
    return await this.productsService.createBusinessProduct(req.user as BusinessUserModel, body);
  }

  @BusinessActivity(EBusinessActivity.ANIMATORS)
  @Roles(EUserRole.BUSINESS)
  @UseGuards(JwtAuthGuard)
  @Post('animators')
  async createProductAnimators(@Body() body: CreateProductAnimatorsDTO, @Req() req: AppRequest): Promise<ProductModel> {
    return await this.productsService.createBusinessProduct(req.user as BusinessUserModel, body);
  }

  @BusinessActivity(EBusinessActivity.DECORATIONS)
  @Roles(EUserRole.BUSINESS)
  @UseGuards(JwtAuthGuard)
  @Post('decorations')
  async createProductDecorations(
      @Body() body: CreateProductDecorationsDTO,
      @Req() req: AppRequest
  ): Promise<ProductModel> {
    return await this.productsService.createBusinessProduct(req.user as BusinessUserModel, body);
  }

  @BusinessActivity(EBusinessActivity.FLOWERS)
  @Roles(EUserRole.BUSINESS)
  @UseGuards(JwtAuthGuard)
  @Post('flowers')
  async createProductFlowers(@Body() body: CreateProductFlowersDTO, @Req() req: AppRequest): Promise<ProductModel> {
    return await this.productsService.createBusinessProduct(req.user as BusinessUserModel, body);
  }

  @BusinessActivity(EBusinessActivity.PHOTOGRAPHERS)
  @Roles(EUserRole.BUSINESS)
  @UseGuards(JwtAuthGuard)
  @Post('photographers')
  async createProductPhotographers(
      @Body() body: CreateProductPhotographersDTO,
      @Req() req: AppRequest
  ): Promise<ProductModel> {
    return await this.productsService.createBusinessProduct(req.user as BusinessUserModel, body);
  }

  @BusinessActivity(EBusinessActivity.MAKE_UP)
  @Roles(EUserRole.BUSINESS)
  @UseGuards(JwtAuthGuard)
  @Post('make-up')
  async createProductMakeUp(@Body() body: CreateProductMakeUpDTO, @Req() req: AppRequest): Promise<ProductModel> {
    return await this.productsService.createBusinessProduct(req.user as BusinessUserModel, body);
  }

  @Roles(EUserRole.BUSINESS)
  @UseGuards(JwtAuthGuard)
  @Post('inner-additional')
  async addInnerAdditional(@Body() body: CreateProductInnerAdditionalDto, @Req() req: AppRequest): Promise<void> {
    await this.productsService.addProductInnerAdditional(body, req.user.id);
  }

  @Get('business')
  async businessProducts(@Query() query: GetBusinessProductsByIdDTO): Promise<{ [category: string]: ProductModel[] }> {
    const data = await this.productsService.getBusinessProducts(query.businessId, query.activity);
    console.log(data);
    return data;
  }

  @Get('search')
  async searchProducts(@Query() query: SearchProductsDTO): Promise<{ [category: string]: ProductModel[] }> {
    return await this.productsService.searchProducts(query);
  }

  @ApiConsumes('multipart/form-data')
  @ApiImplicitFile({ name: 'file', required: true })
  @UseInterceptors(FILE_UPLOAD_INTERCEPTOR)
  @Roles(EUserRole.BUSINESS)
  @UseGuards(JwtAuthGuard)
  @Post('add-image/:productId')
  async addProductImage(
    @Param() params: AddProductImageDTO,
    @UploadedFile() file: UploadFileData,
    @Req() req: AppRequest
  ): Promise<void> {
    if (!file) {
      throw new BadRequestException('The file is required');
    }

    await this.productsService.addProductImage(params.productId, req.user.id, file);
  }

  @ApiConsumes('multipart/form-data')
  @ApiImplicitFile({ name: 'file', required: true })
  @UseInterceptors(FILE_UPLOAD_INTERCEPTOR)
  @Roles(EUserRole.BUSINESS)
  @UseGuards(JwtAuthGuard)
  @Post('add-inner-additional-image/:productId')
  async addProductInnerAdditionalImage(
      @Param() params: AddProductImageDTO,
      @UploadedFile() file: UploadFileData,
      @Req() req: AppRequest
  ): Promise<void> {
    if (!file) {
      throw new BadRequestException('The file is required');
    }

    await this.productsService.addProductInnerAdditionalImage(params.productId, req.user.id, file);
  }
}
