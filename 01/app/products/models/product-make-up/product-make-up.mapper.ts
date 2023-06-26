import { ModelDataMapper } from "@inft-common/abstract/model.mapper.abstract";
import { ProductMapper } from "@inft-app/products/models/product/product.mapper";
import { AwsServiceApi } from "@inft-common/api/aws/aws-service.api";
import { ProductMakeUpEntity } from "../../../../core/products/entities/product-make-up.entity";
import { ProductMakeUpModelData } from "@inft-app/products/models/product-make-up/product-make-up.model";

export class ProductMakeUpMapper implements ModelDataMapper<ProductMakeUpEntity, ProductMakeUpModelData> {
  constructor(private awsService: AwsServiceApi) {}

  mapData(data: ProductMakeUpEntity): ProductMakeUpModelData {
    return {
      ...(new ProductMapper(this.awsService).mapData(data)),
    };
  }
}
