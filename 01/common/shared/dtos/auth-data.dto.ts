import { DeviceDto } from "@inft-app/devices/dtos/device.dto";
import { AuthToken } from "@inft-common/decorators/auth/auth-token.decorator";
import { Required } from "@inft-common/decorators";
import { AuthProvider } from "@inft-common/decorators/auth/auth-provider.decorator";
import { EAuthProvider } from "@inft-app/auth/enums/auth-provider.enum";

export class AuthDataDto extends DeviceDto {
  @AuthToken(Required.STRONG)
  authToken: string;

  @AuthProvider(Required.STRONG)
  provider: EAuthProvider;
}
