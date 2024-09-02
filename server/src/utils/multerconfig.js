import multer from 'multer';

const storage = multer.memoryStorage(); 

const upload = multer({
    storage,
    limits: { fileSize: 1 * 1024 * 1024 }, // 1 MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
            return cb(new Error('Only PDFs are allowed'), false);
        }
        cb(null, true);
    }
});
export default upload;
