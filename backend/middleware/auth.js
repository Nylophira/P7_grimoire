const jwt = require("jsonwebtoken");

module.exports = ((req, res, next) => {
    try  {
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, '$2y$10$d4gDtGQYhg6HULtkXqG9k.pAmPhK1UO8BgY6HuctEjaJ11D4mV14G')
        const user = decode.userId;
        req.auth = {
            userId: user
        }
        next();
    } catch {
        res.status(403).json({message : 'Non autorisé !'});
    }
})