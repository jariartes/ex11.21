const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenUser = async token => {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id)
        return null
    const user = await User.findById(decodedToken.id)
    //console.log('getTokenUser', user)
    return user
}

module.exports = {
    getTokenUser
}