const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req,res,next) {
    //to get the toekn from the header
    const token = req.header('x-auth-token');
    if(!token){
        return res.status(401).json({ msg: 'No token, authorization denied' });
                //id be wanting to verify the token...:
        }try {//now im cheking the token alongside my secret code i have in my config file....
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({msg: 'Token is not valid'});
    }

    }
