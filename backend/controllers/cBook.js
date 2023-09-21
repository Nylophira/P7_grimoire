const book = require("../models/book");

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
   .then((objets) => {
    res.status(200).json(objets)
    console.log(req.file)
   })
   .catch((error) =>  {
    res.status(400).json({error});
    })

}