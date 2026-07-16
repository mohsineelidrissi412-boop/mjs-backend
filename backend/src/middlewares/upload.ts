import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

const uploadDir = process.env.UPLOAD_DIR || './uploads';

// S'assurer que le dossier d'upload existe
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Config de stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Validation des types de fichiers
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedImageTypes = /jpeg|jpg|png|webp/;
  const allowedDocTypes = /pdf/;

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype.toLowerCase();

  if (file.fieldname === 'cv') {
    // Validation pour le CV (PDF uniquement)
    const isPdf = allowedDocTypes.test(extname) && mimetype === 'application/pdf';
    if (isPdf) {
      return cb(null, true);
    }
    return cb(new Error("Erreur: Le CV doit être un fichier PDF uniquement."));
  } else {
    // Validation pour les images (avatar, logo, publications)
    const isImage = allowedImageTypes.test(extname) && allowedImageTypes.test(mimetype);
    if (isImage) {
      return cb(null, true);
    }
    return cb(new Error("Erreur: Uniquement les images au format PNG, JPG, JPEG ou WEBP sont autorisées."));
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: (Number(process.env.MAX_FILE_SIZE_MB) || 5) * 1024 * 1024 // 5MB
  }
});
