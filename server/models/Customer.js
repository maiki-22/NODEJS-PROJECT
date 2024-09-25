const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const LibroSchema = new Schema({
    ISBN: {
        type: Number,
        required: true,
        unique: true
    },
    titulo:{
        type: String,
        required: true
    },
    autor:{
        type:String,
        required: true
    },
    
    Ano_de_publicacion:{
        type: Date
    },
    editorial:{
        type: String,
        required: true
    },
    precio:{
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('Libro', LibroSchema);