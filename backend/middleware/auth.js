const jwt = require("jsonwebtoken");

module.exports = ((req, res, next) => {
    try  {
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, process.env.SECRETTOKEN)
        const user = decode.userId;
        req.auth = {
            userId: user
        }
        next();
    } catch (error) {
        res.status(403).json({error});
    }
})