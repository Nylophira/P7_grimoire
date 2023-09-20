const book = require("../models/book");

exports.readAll = (req, res, next) => {
    book.find()
    .then((objets) => res.status(200).json(objets))
    .catch((error) =>  res.status(400).json(error))

}

exports.updateAll = (req, res, next) => {
   const unBook = new book ({
        ...req.body, 
        userId: req.auth.userId
   })
   unBook.save()
   .then((objets) => {
    res.status(200).json(objets)
   })
   .catch((error) =>  {
    res.status(400).json({error});
    console.log(req.auth.userId)
    })

}