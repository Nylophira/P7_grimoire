const book = require("../models/book");
const fs = require("fs");

exports.readAll = (req, res, next) => {
    book.find()
    .then((objets) => res.status(200).json(objets))
    .catch((error) =>  res.status(400).json({error}))

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
   .catch((error) => res.status(401).json({error}))

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
            //remplacement de l'image
            if (req.file) {
                const nomImg = unBook.imageUrl.split('/images/')[1];
                fs.unlinkSync(`images/${nomImg}`);
            }
            book.updateOne({_id: req.params.id}, {...objet, _id:req.params.id})
            .then(() => res.status(200).json({message: 'Livre mis à jour'}))
            .catch((error) => res.status(400).json({error}))
        } else {
            res.status(401).json({message: 'Non autorisé !'})
        }
    })
    .catch((error) => res.status(400).json({error}))
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
            res.status(401).json({message: 'Non autorisé !'})
        }
    })
    .catch((error) => res.status(400).json({error}))
}

exports.rating = (req, res, next) => {
     book.findOne({_id: req.params.id})
     .then((unBook) => {
        if(unBook.ratings.includes(req.auth.userId)) {
            res.status(401).json({message: 'Non autorisé !'})
        } else {
            //Calcul de la moyenne
            const nbr = unBook.ratings.length+1;
            const sum = unBook.ratings.reduce((acc, curr ) => { return acc+curr.grade}, req.body.rating)
            const average = sum/nbr;
            const newNote = {userId: req.auth.userId, grade: req.body.rating }
            //Intégration des résultats
             book.updateOne({_id: req.params.id}, { averageRating: average, $push: {ratings: newNote}})
            .then(() => {
               book.findOne({_id: req.params.id})
               .then((newBook) =>  res.status(200).json(newBook))
               .catch((error) => res.status(400).json({error}))
            })
            .catch((error) => res.status(401).json({error}))
        }
     })
     .catch((error) => res.status(400).json({error}))
}

exports.bestRating = (req, res, next) => {
    book.find()
    .then((objets) => {
        const notes = Array.from(objets);
        const trie = notes.sort((a, b)=> b.averageRating-a.averageRating);
        const top = trie.slice(0,3);
        res.status(200).json(top); 
    })
    .catch((error) =>  res.status(400).json({error}))
}