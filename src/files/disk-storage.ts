import multer from 'multer';

export const diskImageStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, 'images/');
    },
    filename: (_req, file, cb) => {
        const timestamp = Date.now();
        const splitFilename = file.originalname.split('.');
        const extension = splitFilename[splitFilename.length - 1];

        cb(null, file.fieldname + '-' + timestamp + '.' + extension);
    },
});
