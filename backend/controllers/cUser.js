const user = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
   bcrypt.hash(req.body.password, 10)
   .then( (mdp) => {
        const unUser = new user ({
            email: req.body.email,
            password: mdp
        })
        unUser.save()
        .then(() => res.status(201).json({ message: 'Utilisateur crée !'}))
        .catch(error => res.status(400).json({error}))
   })
   .catch((error) => res.status(500).json(error))

}

exports.login = (req, res, next) => {
    user.findOne({email: req.body.email})
    .then((cible) => {
        if(!cible) {
            res.status(400).json({message: "Mot de passe ou identifiant incorrect"})
        } else {
            bcrypt.compare(req.body.password, cible.password)
            .then((resultat) => {
                if(!resultat) {
                    res.status(400).json({message: "Mot de passe ou identifiant incorrect"})
                } else {
                    res.status(200).json({
                        userId: cible._id,
                        token: jwt.sign(
                            {userId: cible._id},
                           process.env.SECRETTOKEN,
                            {expiresIn:'24h'}
                        )
                    })
                }
            })
            .catch((error) => res.status(500).json(error))
        }
    })
    .catch((error) => res.status(500).json(error))
}