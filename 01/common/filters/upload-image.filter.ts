import { InvalidImageFormatError } from '../error/custom-errors/common/invalid-image-format.error';
import { PATTERNS } from '../shared/utils/patterns';

export const uploadImageFilter = (req, file, callback) => {
    if (!file.originalname.match(PATTERNS.availableUploadImageFormats)) {
        return callback(new InvalidImageFormatError(), false);
    }
    callback(null, true);
};
