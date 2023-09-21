const book = require("../models/book");
const fs = require("fs");

exports.readAll = (req, res, next) => {
    book.find()
    .then((objets) => res.status(200).json(objets))
    .catch((error) =>  res.status(400).json(error))

}

exports.updateAll = (req, res, next) => {

    const objet = JSON.parse(req.body.book);
    delete objet._userId;
    const unBook = new book ({
        ...objet, 
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
   unBook.save()
   .then((objets) => res.status(200).json(objets) )
   .catch((error) => res.status(400).json({error}))

}

exports.readOne = (req, res, next) => {
    book.findOne({_id: req.params.id})
    .then((objet) =>  res.status(200).json(objet))
    .catch((error) => res.status(400).json({error}))
}

exports.updateOne = (req, res, next) => {
    const objet = req.file ? 
        {...JSON.parse(req.body.book), imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`} :
        {...req.body};

    delete objet._userId;

    book.findOne({_id: req.params.id})
    .then((unBook) => {
        if(unBook.userId == req.auth.userId) {
            book.updateOne({_id: req.params.id}, {...objet, _id:req.params.id})
            .then(() => res.status(200).json({message: 'Livre mis à jour'}))
            .catch((error) => res.status(400).json({error}))
        } else {
            res.status(401).json({message: 'Non autorisé !'})
        }
    })
    .catch(() => res.status(400).json({message : 'Recherche échouée'}))
}

exports.delOne = (req ,res, next) => {
    book.findOne({_id: req.params.id})
    .then((unBook) => {
        if(unBook.userId == req.auth.userId) {
            const nomImg = unBook.imageUrl.split('/images/')[1];
            fs.unlink(`images/${nomImg}`, () => {
                 book.deleteOne({_id: req.params.id})
                .then(() => res.status(200).json({message: 'Livre supprimé'}))
                .catch((error) => res.status(400).json({error}))
            })
        } else {
            console.log("pas là ?");
            res.status(401).json({message: 'Non autorisé !'})
        }
    })
    .catch(() => res.status(400).json({message : 'recherche échouée'}))
}