const multer = require("multer");

const mymeType = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

const stockage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const type = mymeType[file.mimetype];
        const fullName = name+Date.now()+'.'+type;
        callback(null, fullName);
    }
})

module.exports = multer({storage:stockage}).single('image');