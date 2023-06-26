import { ModelDataMapper } from "@inft-common/abstract/model.mapper.abstract";
import { ProductMapper } from "@inft-app/products/models/product/product.mapper";
import { AwsServiceApi } from "@inft-common/api/aws/aws-service.api";
import { ProductPhotographersEntity } from "../../../../core/products/entities/product-photographers.entity";
import { ProductPhotographersModelData } from "@inft-app/products/models/product-photographers/product-photographers.model";

export class ProductPhotographersMapper implements ModelDataMapper<ProductPhotographersEntity, ProductPhotographersModelData> {
  constructor(private awsService: AwsServiceApi) {}

  mapData(data: ProductPhotographersEntity): ProductPhotographersModelData {
    return {
      ...(new ProductMapper(this.awsService).mapData(data)),
    };
  }
}
