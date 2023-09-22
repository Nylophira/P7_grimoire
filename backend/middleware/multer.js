const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");

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

const upload = multer({storage:stockage}).single('image');

module.exports = (req, res, next) => {
    upload (req, res, (err) => {
        if (err) {
            return res.status(400).json({message: 'erreur sur Multer'})
        }
        if (req.file)  {
            const temp = `temp_${req.file.filename}`;
            sharp(req.file.path)
            .resize({height: 350, width:350, fit: 'cover'})
            .toFile(`images/${temp}`, (error) => {
                if(error) {
                console.log(error);
                return res.status(500).json({message: 'erreur sur Sharp'})
            }
            fs.unlinkSync(req.file.path);
            fs.renameSync(`images/${temp}`, req.file.path)
        });
    }
        
    next() 
        
    });
}