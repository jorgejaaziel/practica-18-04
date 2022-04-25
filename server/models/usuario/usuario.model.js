const mongoose = require("mongoose");

let schemaUsuario = mongoose.Schema({
    strNombre:
    {
        type: String,
        required:[true,'No se recibio el Nombre. Favor de ingresarlo']
    },
    strApellido:
    {
        type: String,
        required:[true,'No se recibio el apellido. Favor de ingresarlo']
    },
    strNombreUsuario:
    {
        type: String,
        required:[true,'No se recibio el NombreUsuario. Favor de ingresarlo']
    },
    strEmail:
    {
        type: String,
        required:[true,'No se recibio email. Favor de ingresarlo']
    },
    strContrasena: {
        type: String,
        required:[true, 'No se recibio la contrasena, favor de ingresarla']
    },
    strContrasena:
    {
        type: String,
        required:[true,'No se recibio la contrasena. Favor de ingresarlo']
    }
});

module.exports = mongoose.model('usuario',schemaUsuario);