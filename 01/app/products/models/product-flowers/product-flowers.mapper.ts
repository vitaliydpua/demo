import { ModelDataMapper } from "@inft-common/abstract/model.mapper.abstract";
import { ProductMapper } from "@inft-app/products/models/product/product.mapper";
import { AwsServiceApi } from "@inft-common/api/aws/aws-service.api";
import { ProductFlowersEntity } from "../../../../core/products/entities/product-flowers.entity";
import { ProductFlowersModelData } from "@inft-app/products/models/product-flowers/product-flowers.model";

export class ProductFlowersMapper implements ModelDataMapper<ProductFlowersEntity, ProductFlowersModelData> {
  constructor(private awsService: AwsServiceApi) {}

  mapData(data: ProductFlowersEntity): ProductFlowersModelData {
    return {
      ...(new ProductMapper(this.awsService).mapData(data)),
    };
  }
}
