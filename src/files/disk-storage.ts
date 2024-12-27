import multer from 'multer';

export const diskImageStorage = multer.diskStorage({
    destination: (req, _file, cb) => {
        cb(null, 'images/');
    },
    filename: (_req, file, cb) => {
        const timestamp = Date.now();
        const splitFilename = file.originalname.split('.');
        const extension = splitFilename[splitFilename.length - 1];
        const random = Math.random().toString(36).substring(2, 15);

        cb(null, `${file.fieldname}-${timestamp}-${random}.${extension}`);
    },
});
