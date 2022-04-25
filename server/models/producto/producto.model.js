const mongoose = require('mongoose');

let schemaProducto = mongoose.Schema({
    strNombre: {
        type: String,
        requires:[true, 'No se recibio el strNombre favor de ingresarlo']
    },
    strDescripcion: {
        type: String,
        required: [true, 'No se recibio el strDescripcion favor de ingrsarlo']
    },
    nmbPrecio: {
        type:Number,
        required: [true, 'No se recibio el nmbPrecio favor de ingrsarlo']
    }
});

module.exports = mongoose.model('producto', schemaProducto);