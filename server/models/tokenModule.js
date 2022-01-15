// to keep refresh token and id of user and also IP of adress ... other useful things
// link of user and refresh token
const {Schema, model} = require('mongoose');

const TokenSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'UserSchema'},
    refreshToken: {type: String, required: true},
})

module.exports = model('TokenSchema', TokenSchema);