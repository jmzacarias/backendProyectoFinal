import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import bcrypt from 'bcrypt'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,__dirname+'/public/img')
    },
    filename: function(req,file,cb){
        cb(null,Date.now()+"-"+file.originalname)
    }
})

export const uploader = multer({storage})

export default __dirname;

export const createHash = password => bcrypt.hashSync(password , bcrypt.genSaltSync(10))

export const isValidPassword = (user, password) => bcrypt.compareSync(password,user.password)


