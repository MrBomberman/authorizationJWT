const jwt = require('jsonwebtoken');
const TokenModel = require('../models/tokenModel.js');

// пользователь регистрируется - мы создаем для него пару токенов, рефреш токен записываем сразу в базу данных по айдишнику
class TokenService {
    generateTokens(payload){
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token){
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET) // to verify token which we get(its payload and secret key)
            return userData;
        } catch(e){
            return null;
        }
    }

    validateRefreshToken(token){
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET) // to verify token which we get(its payload and secret key)
            return userData;
        } catch(e){
            return null;
        }
    }

    async saveToken(userId, refreshToken){
        const tokenData = await TokenModel.findOne({userId})
        if(tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await TokenModel.create({user: userId, refreshToken})
        return token;
    }

    async removeToken(refreshToken){
        const tokenData = await TokenModel.deleteOne({refreshToken}); // находим запись с токеном в нашей базе данных токенов и удаляем ее
        return tokenData;

    }

    async findTokenInDb(refreshToken){
        const tokenData = await TokenModel.findOne({refreshToken}); // находим запись с токеном в нашей базе данных токенов и удаляем ее
        return tokenData;

    }
}

module.exports = new TokenService();