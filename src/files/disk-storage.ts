import multer from 'multer';
import { IMAGE_UPLOAD_PATH } from '../config';

export const diskImageStorage = multer.diskStorage({
    destination: (req, _file, cb) => {
        cb(null, `${IMAGE_UPLOAD_PATH}/`);
    },
    filename: (_req, file, cb) => {
        const timestamp = Date.now();
        const splitFilename = file.originalname.split('.');
        const extension = splitFilename[splitFilename.length - 1];
        const random = Math.random().toString(36).substring(2, 15);

        cb(null, `${file.fieldname}-${timestamp}-${random}.${extension}`);
    },
});
