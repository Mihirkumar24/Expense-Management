import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function uploadFile(file, folder) {
    return cloudinary.uploader.upload(file, {
        folder
    });
}

export function deleteFile(public_id) {
    return cloudinary.uploader.destroy(public_id);
}