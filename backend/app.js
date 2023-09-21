const express = require("express");
const app = express();

const mongoose = require("mongoose");
const bookRoute = require("./routes/rBook");
const userRoute = require("./routes/rUser");
const path = require("path");

mongoose.connect("mongodb+srv://millet:OvH49Ja9fAQDX34o@cluster0.7v12arp.mongodb.net/?retryWrites=true&w=majority",
{ useNewUrlParser: true,
  useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

//Pour le body en JSON : 
app.use(express.json());

//Le CORS :
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
 
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/api/books', bookRoute);
app.use('/api/auth', userRoute);

module.exports = app;