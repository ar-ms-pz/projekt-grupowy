import multer from 'multer';
import { diskImageStorage } from './disk-storage';
import { imageFilter } from './image-filter';

export const imageUploadHandler = multer({
    storage: diskImageStorage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: imageFilter,
});
