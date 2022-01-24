const ApiError = require('../exceptions/apiError.js');
const tokenService = require('../service/tokenService.js');

module.exports = function (req, res, next){ // функция некст вызывает следующий в цепочке middleware
    try {
        const authorizationHeader = req.headers.authorization; // в момент отправки запроса мы можем прочитать токен из headers
        if(!authorizationHeader) {
            return next(ApiError.UnauthorizedError())
        }

        const accessToken = authorizationHeader.split(' ')[1]; // get token from array which contains two elements and second is token
        if(!accessToken){
            return next(ApiError.UnauthorizedError())
        }

        const userData = tokenService.validateAccessToken(accessToken);
        if(!userData){
            return next(ApiError.UnauthorizedError())
        }

        req.user = userData;
        next(); // передаем управление следующему middleware
    } catch(e){
        return next(ApiError.UnauthorizedError())
    }
}