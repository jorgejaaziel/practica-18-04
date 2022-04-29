const mongoose = require('mongoose');

let schemaApi = new mongoose.Schema({
    blinEstado: {
        type: Boolean,
        default: true
    },
    strRuta: {
        type: String,
        required: [true, "No se recibio strRuta, favor de ingresarlo"]
    },
    strMetodo: {
        type: String,
        requerido: [true, 'No se recibio strMetodo favor de ingresarlo']
    },
    strDescripcion: {
        type: String, 
        requerido: [true, 'No se recibio strDescripcion favor de ingresarlo']
    },
    blnEsApi: {
        type: Boolean,
        default: true
    },
    blnEsMenu: {
        type: Boolean,
        default: false
    }

})

module.exports = mongoose.model('api', schemaApi);