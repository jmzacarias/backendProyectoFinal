import productsDAO from "./models/productsSchema.js";
import usersDAO from "./models/usersSchema.js";

class UserManager {
    constructor (){

    }
    getUsers = async()=>{
        const users = await usersDAO.find().lean().exec()
        return users
    }

    getUserByEmail = async(email)=>{
        let user = usersDAO.findOne({email:email}).lean().exec()
        if(!user) return `[ERROR] There is no user with email ${email}`
        return user
    }

    addUser = async(newUser)=>{
        if(newUser.first_name.trim().length===0 || 
        newUser.last_name.trim().length===0 ||
        newUser.email.trim().length===0 ||
        newUser.password.trim().length===0 ||
        newUser.age.trim().length===0) return '[ERROR] Missing Fields';
        let age = parseInt(newUser.age)
        newUser.age=age
        if(isNaN(age)) return '[ERROR] Age must be a number'
        let userExists = await usersDAO.exists({email:newUser.email}).lean().exec()
        if(userExists) return `[ERROR] email ${newUser.email} is already registered`
        return usersDAO.create(newUser)
    }
}

export default UserManager