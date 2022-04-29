const mongoose = require('mongoose');

let schemaRol = new mongoose.Schema({
    strNombre: {
        type: String,
        required: [true, "No se recibio strNombre, favor de ingresarlo"]
    },
    strDescripcion: {
        type: String, 
        requerido: [true, 'No se recibio strDescripcion favor de ingresarlo']
    },
    blnRolDefault: {
        type:Boolean,
        default: false
    },
    arrObjIdApis: []

})

module.exports = mongoose.model('Rol', schemaApi);