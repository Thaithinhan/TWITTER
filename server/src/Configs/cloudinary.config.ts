import cloudinary from 'cloudinary';
import { Request } from 'express';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Cấu hình Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET_KEY
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary.v2,
    params: async (req: Express.Request, file: Express.Multer.File): Promise<cloudinary.UploadApiOptions> => {
        let format: string;
        switch (file.mimetype) {
            case 'image/jpeg':
                format = 'jpg';
                break;
            case 'image/png':
                format = 'png';
                break;
            case 'image/gif':
                format = 'gif';
                break;
            case 'image/jpg':
                format = 'jpg';
                break;
            default:
                throw new Error('Unsupported file format.');
        }

        return {
            folder: 'tweets',
            format: format,
        };
    },
});

export default storage
