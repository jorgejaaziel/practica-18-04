const mongoose = require('mongoose');

let SchemaProducto = mongoose.Schema({
    blnEstado: {
        type: Boolean,
        default: true,
    },
    strNombre: {
        type: String,
        required: [true, 'No se recibio el strNombre favor de ingresarlo']
    },
    strDescripcion: {
        type: String,
        required: [true, 'No se recibio el strDescripcion favor de ingresarlo']
    },
    nmbPrecio: {
        type: Number,
        required: [true, 'No se recibio el nmbPrecio favor de ingresarlo']
    }
})

module.exports = mongoose.model('producto', SchemaProducto);