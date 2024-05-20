const jwt = require("jsonwebtoken");

module.exports = function(req,res,next){
    try {
        let token = req.header('x-token');
        if(!token){
            return res.status(404).send("token not found !!");
        } else {
            let decode = jwt.verify(token,'jwtsecure')
            req.user = decode.user
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Authentication Error !!")
    }
}