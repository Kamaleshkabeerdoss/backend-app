// src/middlewares/upload.ts
import multer from 'multer';
import path from 'path';

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniquename = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniquename + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image & PDF files are allowed!'));
  }
};

// Max file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE }
});

// Export for single and multiple upload
export const singleUpload = upload.single('image');
export const multipleUpload = upload.array('images', 10);
