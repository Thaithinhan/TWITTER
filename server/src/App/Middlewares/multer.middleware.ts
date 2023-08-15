import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', '..', '..', 'public', 'images'));
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });

export default upload;

