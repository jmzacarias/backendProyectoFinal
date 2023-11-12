import passport from 'passport'
import local from 'passport-local'
import gitHubStrategy from 'passport-github2'
import usersDAO from '../dao/mongooseManagers/models/usersSchema.js'
import { createHash } from '../utils.js'
import { isValidPassword } from '../utils.js'



const localStrategy = local.Strategy

const initializePassport = ()=> {

    passport.use('register', new localStrategy({
        passReqToCallback: true,
        usernameField: 'email'    
    }, async(req, username, password, done)=>{
        const { first_name, last_name, email, age } = req.body
        try {
            const user = await usersDAO.findOne({ email: username })
            if(user) {
                return done(null, false)
            }
            const newUser = {
                first_name, last_name, email, age, password: createHash(password)
            }
            const result = await usersDAO.create(newUser)
            return done(null,result)
        } catch (error) {
            return done(error)
        }
    }))

    passport.serializeUser((user,done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async(id, done)=> {
        const user = await usersDAO.findById(id)
        done(null,user)
    })

    passport.use('login', new localStrategy({
        usernameField: 'email',
    }, async(username, password, done) => {
        try {
            console.log({username:username})
            // if(username===`adminCoder@coder.com` && password ===  `adminCod3r123`) {
            //     const user = { username , 
            //         first_name : 'Coder',
            //         last_name: 'Coder',
            //         email: 'adminCoder@coder.com',
            //         age: 99
            //     }
            //     return done(null, user)
            // }
            const user = await usersDAO.findOne({ email:username })
            if(!user){ 
                return done( null, false )
             }
            if(!isValidPassword(user, password)) return done(null, false)
            return done(null,user)
        } catch (error) {
            console.log({error: error.message})
            done(null, profile)
        }
    }))

    passport.use('github', new gitHubStrategy({
        clientID: 'Iv1.d7200fc20f84473d',
        clientSecret: '7d0a759eaed63a174cfc11d3f9e4f12fb467d65b',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async(accessToken, refreshToken, profile, done)=>{
        console.log({ profile:profile })
        try {
            const user = await usersDAO.findOne({ email: profile._json.login })
            console.log({user66passportConfig:user})
            if(user) return done(null, user)
            const newUser = {
                first_name: profile._json.login,
                last_name: profile.username,
                email: profile._json.login,
                password: 'as',
                age: 0
            }
            console.log({newuser74passportConfig:newUser})
            await usersDAO.create(newUser)
            return done(null, newUser )

        } catch (error) {
            console.log({error:error})
            return done('Error to login with github')
        }
    }) )
}

export default initializePassport