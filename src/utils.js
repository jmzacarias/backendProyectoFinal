import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import multer from 'multer';
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,__dirname+'/public/img')
    },
    filename: function(req,file,cb){
        cb(null,file.originalname)
    }
})

export const uploader = multer({storage})
export default __dirname;