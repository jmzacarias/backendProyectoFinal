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


export const handlePolicies = policies => (req, res, next) => {
    const user = req.user || null
     if (!policies.includes(user.role.toUpperCase())) {
        return res.status(403).render('errors/base', { error: 'Necesita autorización'})
      }
      return next()
}

export const isAdmin = async(req, res, next) => {
    console.log({reqBodyIsAdmin: req.body})
    const isValidCredentials = (req.body.email === 'adminCoder@coder.com' && req.body.password === 'adminCod3r123');
    console.log({isvalidcredentials:isValidCredentials})
    if (isValidCredentials) {
        await new Promise((resolve, reject) => {
            req.session.user = {
                first_name: 'CoderHouse',
                last_name: 'Admin',
                email: 'adminCoder@coder.com',
                role: 'admin'
            }
            resolve();
        });
        return res.status(200).redirect('/products')
    } else {
      next();
    }
  };