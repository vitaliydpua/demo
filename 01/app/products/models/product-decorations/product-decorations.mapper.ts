import { ModelDataMapper } from "@inft-common/abstract/model.mapper.abstract";
import { ProductMapper } from "@inft-app/products/models/product/product.mapper";
import { AwsServiceApi } from "@inft-common/api/aws/aws-service.api";
import { ProductDecorationsModelData } from "@inft-app/products/models/product-decorations/product-decorations.model";
import { ProductDecorationsEntity } from "../../../../core/products/entities/product-decorations.entity";

export class ProductDecorationsMapper implements ModelDataMapper<ProductDecorationsEntity, ProductDecorationsModelData> {
  constructor(private awsService: AwsServiceApi) {}

  mapData(data: ProductDecorationsEntity): ProductDecorationsModelData {
    return {
      ...(new ProductMapper(this.awsService).mapData(data)),
    };
  }
}
