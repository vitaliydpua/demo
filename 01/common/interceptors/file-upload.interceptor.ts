import { FileInterceptor } from '@nestjs/platform-express';

import { uploadImageFilter } from '../filters/upload-image.filter';

export const FILE_UPLOAD_INTERCEPTOR = FileInterceptor('file', {
  fileFilter: uploadImageFilter,
  limits: {
    fileSize: 1e6 * 5,  // 5MB
  },
});
