const mongoose = require("mongoose");

let schemaEmpresa = mongoose.Schema({
    blnEstado:
    {
        type: Boolean,
        default: true,
    },
    strNombre:
    {
        type: String,
        required: [true,'No se recibio el strNombre, favor de ingresarlo']
    },
    nmbTelefono:
    {
        type: Number,
        required: [true,'No se recibio el nmbtelefono, favor de ingresarlo']
    },
    strDescripcion:
    {
        type: String,
        required:[true,'No se recibio la strDescripcion, Favor de ingresarla']
    },
    nmbCodigoPostal:
    {
        type: Number,
        required: [true,'No se recibio el nmbCodigoPostal, favor de ingresarlo']
    },
    strCiudad:
    {
        type: String,
        required: [true,'No se recibio la ciudad, favor de ingresarlo']
    }
});

module.exports = mongoose.model('empresa',schemaEmpresa);