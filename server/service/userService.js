// to create, delete, update and other things with users
const UserModel = require('../models/userModel.js')
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const emailService = require('./emailService.js');
const tokenService = require('./tokenService.js');
const UserDto = require('../dtos/userDto.js');
const ApiError = require('../exceptions/apiError.js');

class UserService {
    async registration(email, password){
        const candidate = await UserModel.findOne({email})
        if (candidate) {
            throw ApiError.BadRequests(`User with ${email} already exists`); // check email of new user
        }
        const hashPassword = await bcrypt.hash(password, 3); // hash user password
        const activationLink = uuid.v4(); // made link for activation of account
        const user = await UserModel.create({email, password: hashPassword, activationLink}); // creates object in mongo db and saves it
        await emailService.sendActivationEmail(email, `${process.env.API_URL}/api/activate/${activationLink}`); // send to email a link for activation


        const userDto = new UserDto(user); // id, email, isActivated
        const tokens = await tokenService.generateTokens({...userDto}); // generate tokens
        await tokenService.saveToken(userDto.id, tokens.refreshToken); // save our id and refresh token of user to mongo db collection
    
        return {...tokens, user: userDto}
    }

    async activate(activationLink){ // to make status of activation = true in our collection in mongo db
        const user = await UserModel.findOne({activationLink});
        if(!user){
            throw ApiError.BadRequests("Link was incorrect")
        } 
        user.isActivated = true;
        await user.save()
    }

    async login(email, password){
        const user = await UserModel.findOne({email});
        if(!user){ // if we don't have user in our db
            throw ApiError.BadRequests("User with this email wasn't found")
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if(!isPassEquals){ // if password and hash password wasn't equal
            throw ApiError.BadRequests("Password was incorrect")
        }
        const userDto = new UserDto(user); // delete unneccessary fields from model
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken); // save our id and refresh token of user to mongo db collection
    
        return {...tokens, user: userDto}
    }

    async logout(refreshToken){
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken){
        if(!refreshToken){ // if user doesnt have refresh token - he/she wasn't authorized
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken); // checking validation of token 
        const tokenFromDb = await tokenService.findTokenInDb(refreshToken); // need to find token in db
        if(!userData || !tokenFromDb){
            throw ApiError.UnauthorizedError();
        }
        // if success we generate a new pais of tokens
        const user = await UserModel.findById(userData.id)
        const userDto = new UserDto(user); // delete unneccessary fields from model
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken); // save our id and refresh token of user to mongo db collection
    
        return {...tokens, user: userDto}
    }

    async getAllUsers(){
        const users = await UserModel.find();
        return users;
    }
}

module.exports = new UserService();