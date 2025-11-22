import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { BadRequestError } from '../utils/errors';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '5242880'); // 5MB default
const ALLOWED_FILE_TYPES = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/jpg,image/png,image/webp').split(',');

// Ensure upload directories exist
const uploadDirs = [
  path.join(UPLOAD_DIR, 'restaurants'),
  path.join(UPLOAD_DIR, 'menu-items'),
  path.join(UPLOAD_DIR, 'qrcodes'),
  path.join(UPLOAD_DIR, 'reviews'),
];

uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = UPLOAD_DIR;

    if (file.fieldname === 'logo' || file.fieldname === 'coverImage') {
      uploadPath = path.join(UPLOAD_DIR, 'restaurants');
    } else if (file.fieldname === 'images') {
      uploadPath = path.join(UPLOAD_DIR, 'menu-items');
    } else if (file.fieldname === 'reviewImages') {
      uploadPath = path.join(UPLOAD_DIR, 'reviews');
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// File filter
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestError(`Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`));
  }
};

// Create multer instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

// Middleware for single image upload
export const uploadSingle = (fieldName: string) => upload.single(fieldName);

// Middleware for multiple images upload
export const uploadMultiple = (fieldName: string, maxCount: number = 5) =>
  upload.array(fieldName, maxCount);

// Middleware for mixed uploads
export const uploadFields = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 },
  { name: 'images', maxCount: 5 },
]);
